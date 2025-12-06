import "server-only";
import { adminDb } from "../firebaseAdmin";
import type { Product } from "@/app/type";
import { COLLECTIONS } from "./constants";

export async function createProduct(
  data: Omit<Product, "id">
): Promise<Product> {
  const docRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc();
  const productData: Product = {
    ...data,
    id: docRef.id,
  };
  await docRef.set(productData);
  return productData;
}

export async function getProduct(id: string): Promise<Product | null> {
  const doc = await adminDb.collection(COLLECTIONS.PRODUCTS).doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as Product;
}

export async function getProductsByUserId(
  userId: string,
  includeRemoved = false
): Promise<Product[]> {
  let query = adminDb
    .collection(COLLECTIONS.PRODUCTS)
    .where("userId", "==", userId);

  if (!includeRemoved) {
    query = query.where("isRemoved", "==", 0);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as Product);
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "userId">>
): Promise<void> {
  await adminDb.collection(COLLECTIONS.PRODUCTS).doc(id).update(data);
}

export async function softDeleteProduct(id: string): Promise<void> {
  await adminDb.collection(COLLECTIONS.PRODUCTS).doc(id).update({
    isRemoved: 1,
  });
}

export async function hardDeleteProduct(itemId: string) {
  await adminDb.collection(COLLECTIONS.PRODUCTS).doc(itemId).delete();

  const snapshot = adminDb
    .collection(COLLECTIONS.LIST_ITEMS)
    .where("itemId", "==", itemId);

  const updates = (await snapshot.get()).docs;

  const batch = adminDb.batch();

  updates.forEach((itemList) => {
    const docRef = adminDb.collection(COLLECTIONS.LIST_ITEMS).doc(itemList.id);
    batch.delete(docRef);
  });

  await batch.commit();
}

export async function batchUpdateProducts(updates: Product[]): Promise<void> {
  const batch = adminDb.batch();

  updates.forEach((product) => {
    const docRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc(product.id);
    batch.update(docRef, product);
  });

  await batch.commit();
}

export async function hardDeleteProductsByCategory(
  categoryId: string
): Promise<void> {
  const batch = adminDb.batch();

  const snapshot = await adminDb
    .collection(COLLECTIONS.PRODUCTS)
    .where("category", "==", categoryId)
    .get();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}
