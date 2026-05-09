import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: Request) {
  try {
    const { uid, email, name } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    // Re-entrant safety: if user already has a customer, return it
    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (userSnap.exists && userSnap.data()?.stripeCustomerId) {
      return NextResponse.json({
        stripeCustomerId: userSnap.data()!.stripeCustomerId,
      });
    }

    const customer = await stripe.customers.create({
      email: email || undefined,
      name: name || undefined,
    });

    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID! }],
      trial_period_days: 90,
      payment_behavior: "default_incomplete",
    });

    const now = new Date().toISOString();
    await userRef.set(
      {
        stripeCustomerId: customer.id,
        subscriptionStatus: "trial",
        subscriptionStartDate: now,
        updatedAt: now,
      },
      { merge: true }
    );

    return NextResponse.json({ stripeCustomerId: customer.id });
  } catch (error: any) {
    console.error("Error creating trial:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
