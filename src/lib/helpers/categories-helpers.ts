import "server-only";
import type { Category } from "@/app/type";
import { getRefCollection } from "@/lib/firestore";
import { COLLECTIONS } from "@/app/type";


export async function createCategory(
  data: Omit<Category, "id">
): Promise<Category> {
  const docRef = getRefCollection(COLLECTIONS.CATEGORIES).doc();
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
  let query = getRefCollection(COLLECTIONS.CATEGORIES)
    .where("userId", "==", userId);

  if (!includeRemoved) {
    query = query.where("isRemoved", "==", false);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Category);
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "id" | "userId">>
): Promise<void> {
  await getRefCollection(COLLECTIONS.CATEGORIES, id).update(data);
}

export async function softDeleteCategory(id: string): Promise<void> {
  await getRefCollection(COLLECTIONS.CATEGORIES, id).update({
    isRemoved: true,
  });
}

export async function hardDeleteCategory(id: string): Promise<void> {
  await getRefCollection(COLLECTIONS.CATEGORIES, id).delete();
}
