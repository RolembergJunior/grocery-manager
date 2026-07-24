import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const CANCELABLE_STATUSES = ["active", "trialing", "past_due"];

function unixToISO(seconds: unknown): string | null {
  if (typeof seconds !== "number" || !Number.isFinite(seconds)) return null;
  const date = new Date(seconds * 1000);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function resolveSubscriptionEndISO(subscription: Stripe.Subscription): string | null {
  const item = subscription.items?.data?.[0] as
    | { current_period_end?: number }
    | undefined;

  const candidates: unknown[] = [
    subscription.cancel_at,
    (subscription as unknown as { current_period_end?: number })
      .current_period_end,
    item?.current_period_end,
  ];

  for (const candidate of candidates) {
    const iso = unixToISO(candidate);
    if (iso) return iso;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const { stripeCustomerId } = await request.json();

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "stripeCustomerId is required" },
        { status: 400 }
      );
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "all",
      limit: 10,
    });

    const active = subscriptions.data.find((sub) =>
      CANCELABLE_STATUSES.includes(sub.status)
    );

    if (!active) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const updated = await stripe.subscriptions.update(active.id, {
      cancel_at_period_end: true,
    });

    const subscriptionEndDate = resolveSubscriptionEndISO(updated);

    const usersSnap = await adminDb
      .collection("users")
      .where("stripeCustomerId", "==", stripeCustomerId)
      .limit(1)
      .get();

    if (!usersSnap.empty) {
      const payload: Record<string, unknown> = {
        cancelAtPeriodEnd: true,
        updatedAt: new Date().toISOString(),
      };

      if (subscriptionEndDate) {
        payload.subscriptionEndDate = subscriptionEndDate;
      }

      await usersSnap.docs[0].ref.set(payload, { merge: true });
    }

    return NextResponse.json({
      status: updated.status,
      cancelAt: subscriptionEndDate,
    });
  } catch (error: any) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
