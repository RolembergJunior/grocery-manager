import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

/**
 * RevenueCat event types mapped onto the status vocabulary already used by the
 * Stripe webhook. Anything unlisted is logged and ignored.
 */
const EVENT_STATUS_MAP: Record<string, string> = {
  INITIAL_PURCHASE: "active",
  RENEWAL: "active",
  UNCANCELLATION: "active",
  CANCELLATION: "canceled",
  EXPIRATION: "canceled",
  BILLING_ISSUE: "past_due",
};

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (
    !process.env.REVENUECAT_WEBHOOK_SECRET ||
    authHeader !== process.env.REVENUECAT_WEBHOOK_SECRET
  ) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const event = body?.event;

    if (!event?.type || !event?.app_user_id) {
      return NextResponse.json({ error: "Malformed event" }, { status: 400 });
    }

    const status = EVENT_STATUS_MAP[event.type];

    if (!status) {
      console.log(`RevenueCat: ignoring event type ${event.type}`);
      // 200 so RevenueCat does not retry an event we deliberately skip.
      return NextResponse.json({ received: true });
    }

    const updates: Record<string, string> = {
      stripeCustomerStatus: status,
      subscriptionSource: "play",
      updatedAt: new Date().toISOString(),
    };

    if (event.expiration_at_ms) {
      updates.subscriptionEndDate = new Date(
        event.expiration_at_ms,
      ).toISOString();
    }

    if (event.purchased_at_ms) {
      updates.subscriptionStartDate = new Date(
        event.purchased_at_ms,
      ).toISOString();
    }

    await adminDb
      .collection("users")
      .doc(event.app_user_id)
      .set(updates, { merge: true });

    // A Play subscriber must not also hold a live Stripe subscription. Cancel
    // the Stripe side once, on first purchase only.
    if (event.type === "INITIAL_PURCHASE") {
      try {
        const snap = await adminDb
          .collection("users")
          .doc(event.app_user_id)
          .get();
        const stripeCustomerId = snap.data()?.stripeCustomerId;

        if (stripeCustomerId) {
          const subs = await stripe.subscriptions.list({
            customer: stripeCustomerId,
            status: "all",
            limit: 10,
          });

          for (const sub of subs.data) {
            if (sub.status === "trialing" || sub.status === "active") {
              await stripe.subscriptions.cancel(sub.id);
              console.log(`RevenueCat: cancelled Stripe sub ${sub.id}`);
            }
          }
        }
      } catch (stripeError) {
        // Never fail the webhook over this — the entitlement is already written.
        console.error("Failed to cancel Stripe subscription:", stripeError);
      }
    }

    console.log(
      `RevenueCat: ${event.type} -> ${status} for ${event.app_user_id}`,
    );

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("RevenueCat webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
