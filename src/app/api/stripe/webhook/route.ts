import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

async function updateUserSubscription(
  customerId: string,
  stripeStatus: string,
  dates?: { start: number; end: number },
  protectActive = false,
) {
  const snapshot = await adminDb
    .collection("users")
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .get();

  if (snapshot.empty) return;

  const doc = snapshot.docs[0];

  if (protectActive && doc.data().stripeCustomerStatus === "active") {
    // Never downgrade an active paying user due to a stale event
    return;
  }

  const updates: Record<string, string> = {
    stripeCustomerStatus: stripeStatus,
    updatedAt: new Date().toISOString(),
  };

  if (dates) {
    updates.subscriptionStartDate = new Date(dates.start * 1000).toISOString();
    updates.subscriptionEndDate = new Date(dates.end * 1000).toISOString();
  }

  await doc.ref.update(updates);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await updateUserSubscription(
          sub.customer as string,
          sub.status,
          { start: sub.current_period_start, end: sub.current_period_end },
          true,
        );
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const sub = await stripe.subscriptions.retrieve(
          invoice.subscription as string,
        );
        await updateUserSubscription(
          invoice.customer as string,
          sub.status,
          { start: sub.current_period_start, end: sub.current_period_end },
        );
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await updateUserSubscription(
          sub.customer as string,
          sub.status,
          { start: sub.current_period_start, end: sub.current_period_end },
          true,
        );
        break;
      }
    }
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
