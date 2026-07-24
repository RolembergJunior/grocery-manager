import "server-only";
import Stripe from "stripe";
import { adminDb, adminAuth } from "../firebaseAdmin";
import { COLLECTIONS } from "./constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const USER_DATA_COLLECTIONS = [
  COLLECTIONS.PRODUCTS,
  COLLECTIONS.CATEGORIES,
  COLLECTIONS.LISTS,
  COLLECTIONS.LIST_ITEMS,
];

async function deleteUserDocs(collection: string, uid: string) {
  const snap = await adminDb
    .collection(collection)
    .where("userId", "==", uid)
    .get();

  for (let i = 0; i < snap.docs.length; i += 450) {
    const batch = adminDb.batch();
    snap.docs.slice(i, i + 450).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

export async function cleanupOrphanAuthUser(uid: string): Promise<void> {
  try {
    await adminAuth.deleteUser(uid);
  } catch (err) {
    console.error("Error cleaning up orphan auth user:", err);
  }
}

export async function accountExists(uid: string): Promise<boolean> {
  const snap = await adminDb.collection(COLLECTIONS.PROFILES).doc(uid).get();

  if (!snap.exists) {
    await cleanupOrphanAuthUser(uid);
    return false;
  }

  return true;
}

export async function deleteAccount(uid: string): Promise<{ existed: boolean }> {
  const userRef = adminDb.collection(COLLECTIONS.PROFILES).doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    await cleanupOrphanAuthUser(uid);
    return { existed: false };
  }

  const stripeCustomerId = userSnap.data()?.stripeCustomerId as
    | string
    | undefined;

  if (stripeCustomerId) {
    try {
      await stripe.customers.del(stripeCustomerId);
    } catch (err) {
      console.error("Error deleting Stripe customer:", err);
    }
  }

  await Promise.all(
    USER_DATA_COLLECTIONS.map((collection) => deleteUserDocs(collection, uid)),
  );

  await userRef.delete();
  await cleanupOrphanAuthUser(uid);

  return { existed: true };
}
