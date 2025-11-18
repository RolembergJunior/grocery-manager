import "server-only";
import { adminDb } from "../firebaseAdmin";
import type { Category } from "@/app/type";
import { COLLECTIONS } from "./constants";

export async function createCategory(
  data: Omit<Category, "id">
): Promise<Category> {
  const docRef = adminDb.collection(COLLECTIONS.CATEGORIES).doc();
  const categoryData: Category = {
    ...data,
    id: docRef.id,
  };
  await docRef.set(categoryData);
  return categoryData;
}

export async function getCategoriesByUserId(
  userId: string,
  includeRemoved = false
): Promise<Category[]> {
  let query = adminDb
    .collection(COLLECTIONS.CATEGORIES)
    .where("userId", "==", userId);

  if (!includeRemoved) {
    query = query.where("isRemoved", "==", false);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as Category);
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "id" | "userId">>
): Promise<void> {
  await adminDb.collection(COLLECTIONS.CATEGORIES).doc(id).update(data);
}

export async function softDeleteCategory(id: string): Promise<void> {
  await adminDb.collection(COLLECTIONS.CATEGORIES).doc(id).update({
    isRemoved: true,
  });
}
