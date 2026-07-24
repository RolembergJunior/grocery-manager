import "server-only";
import type { DocumentReference } from "firebase-admin/firestore";
import { adminDb } from "../firebaseAdmin";

export const COLLECTIONS = {
  PROFILES: "users",
  PRODUCTS: "products",
  CATEGORIES: "categories",
  LISTS: "lists",
  LIST_ITEMS: "list_items",
} as const;

export function withTimestamps<T extends object>(data: T, isUpdate = false) {
  const now = new Date().toISOString();
  if (isUpdate) {
    return { ...data, updatedAt: now };
  }
  return { ...data, createdAt: now, updatedAt: now };
}

// Firestore batches are capped at 500 writes; chunk deletes to stay safe.
export async function batchDeleteRefs(
  refs: DocumentReference[],
): Promise<void> {
  for (let i = 0; i < refs.length; i += 450) {
    const batch = adminDb.batch();
    refs.slice(i, i + 450).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}
