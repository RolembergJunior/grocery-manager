import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const REACTIVATABLE_STATUSES = ["active", "trialing", "past_due"];

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

    const scheduled = subscriptions.data.find(
      (sub) =>
        REACTIVATABLE_STATUSES.includes(sub.status) && sub.cancel_at_period_end
    );

    if (!scheduled) {
      return NextResponse.json(
        { error: "No subscription scheduled for cancellation" },
        { status: 404 }
      );
    }

    const updated = await stripe.subscriptions.update(scheduled.id, {
      cancel_at_period_end: false,
    });

    const usersSnap = await adminDb
      .collection("users")
      .where("stripeCustomerId", "==", stripeCustomerId)
      .limit(1)
      .get();

    if (!usersSnap.empty) {
      await usersSnap.docs[0].ref.set(
        {
          cancelAtPeriodEnd: false,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    return NextResponse.json({ status: updated.status });
  } catch (error: any) {
    console.error("Error reactivating subscription:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
