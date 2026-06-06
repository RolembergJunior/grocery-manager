import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { requireSessionUid } from "@/lib/auth-server";
import { adminDb } from "@/lib/firebaseAdmin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  const origin = new URL(request.url).origin;

  if (!sessionId) {
    return NextResponse.redirect(`${origin}/subscribe`);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.redirect(`${origin}/subscribe`);
    }

    const uid = await requireSessionUid();

    await adminDb.collection("users").doc(uid).update({
      stripeCustomerStatus: "active",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Checkout success error:", error);
    // Redirect home anyway — webhook will correct status if Firestore update failed
  }

  return NextResponse.redirect(`${origin}/`);
}
