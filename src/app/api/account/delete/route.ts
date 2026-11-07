import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminAuth } from "@/lib/firebaseAdmin";
import { batchDeleteRefs } from "@/lib/helpers/constants";
import { getRefCollection } from "@/lib/firestore";
import { COLLECTIONS } from "@/app/type";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const USER_DATA_COLLECTIONS = [
  COLLECTIONS.PRODUCTS,
  COLLECTIONS.CATEGORIES,
  COLLECTIONS.LISTS,
  COLLECTIONS.LIST_ITEMS,
];

async function deleteUserDocsInCollection(
  collection: COLLECTIONS,
  uid: string
) {
  const snap = await getRefCollection(collection)
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

    const userRef = getRefCollection(COLLECTIONS.PROFILES, uid);
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
