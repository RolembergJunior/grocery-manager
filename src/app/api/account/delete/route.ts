import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb, adminAuth } from "@/lib/firebaseAdmin";
import { COLLECTIONS, batchDeleteRefs } from "@/lib/helpers/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const USER_DATA_COLLECTIONS = [
  COLLECTIONS.PRODUCTS,
  COLLECTIONS.CATEGORIES,
  COLLECTIONS.LISTS,
  COLLECTIONS.LIST_ITEMS,
];

async function deleteUserDocsInCollection(collection: string, uid: string) {
  const snap = await adminDb
    .collection(collection)
    .where("userId", "==", uid)
    .get();

  await batchDeleteRefs(snap.docs.map((doc) => doc.ref));
}

export async function POST(request: Request) {
  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400 });
    }

    const userRef = adminDb.collection(COLLECTIONS.PROFILES).doc(uid);
    const userSnap = await userRef.get();
    const stripeCustomerId = userSnap.exists
      ? (userSnap.data()?.stripeCustomerId as string | undefined)
      : undefined;

    if (stripeCustomerId) {
      try {
        await stripe.customers.del(stripeCustomerId);
      } catch (err) {
        console.error("Error deleting Stripe customer:", err);
      }
    }

    await Promise.all(
      USER_DATA_COLLECTIONS.map((collection) =>
        deleteUserDocsInCollection(collection, uid),
      ),
    );

    await userRef.delete();

    try {
      await adminAuth.deleteUser(uid);
    } catch (err) {
      console.error("Error deleting auth user:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
