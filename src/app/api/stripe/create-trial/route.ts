import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireUidFromRequest } from "@/lib/auth-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: Request) {
  try {
    let uid: string;
    try {
      uid = await requireUidFromRequest(request);
    } catch {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { email, name } = await request.json();

    // Re-entrant safety: if user already has a customer, return it
    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (userSnap.exists && userSnap.data()?.stripeCustomerId) {
      return NextResponse.json({
        stripeCustomerId: userSnap.data()!.stripeCustomerId,
        stripeCustomerStatus: userSnap.data()!.stripeCustomerStatus ?? "trialing",
      });
    }

    const customer = await stripe.customers.create({
      email: email || undefined,
      name: name || undefined,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_SUBSCRIPTION_PRICE_ID! }],
      trial_period_days: 90,
      payment_behavior: "default_incomplete",
    });

    await userRef.set(
      {
        stripeCustomerId: customer.id,
        stripeCustomerStatus: subscription.status,
        subscriptionStartDate: new Date(
          subscription.current_period_start * 1000,
        ).toISOString(),
        subscriptionEndDate: new Date(
          subscription.current_period_end * 1000,
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    return NextResponse.json({
      stripeCustomerId: customer.id,
      stripeCustomerStatus: subscription.status,
    });
  } catch (error: any) {
    console.error("Error creating trial:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
