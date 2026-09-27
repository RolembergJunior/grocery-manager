import "server-only";
import { adminDb } from "../firebaseAdmin";
import type { Product } from "@/app/type";
import { getRefCollection } from "@/lib/firestore";
import { COLLECTIONS } from "@/app/type";


export async function createProduct(
  data: Omit<Product, "id">
): Promise<Product> {
  const docRef = getRefCollection(COLLECTIONS.PRODUCTS).doc();
  const productData: Product = {
    ...data,
    id: docRef.id,
  };
  await docRef.set(productData);
  return productData;
}

export async function getProduct(id: string): Promise<Product | null> {
  const doc = await getRefCollection(COLLECTIONS.PRODUCTS, id).get();
  if (!doc.exists) return null;
  return { ...doc.data(), id: doc.id } as Product;
}

export async function getProductsByUserId(
  userId: string,
  includeRemoved = false
): Promise<Product[]> {
  let query = getRefCollection(COLLECTIONS.PRODUCTS)
    .where("userId", "==", userId);

  if (!includeRemoved) {
    query = query.where("isRemoved", "==", 0);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Product);
}

export async function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "userId">>
): Promise<void> {
  await getRefCollection(COLLECTIONS.PRODUCTS, id).update(data);
}

export async function softDeleteProduct(id: string): Promise<void> {
  await getRefCollection(COLLECTIONS.PRODUCTS, id).update({
    isRemoved: 1,
  });
}

export async function batchUpdateProducts(updates: Product[]): Promise<void> {
  const batch = adminDb.batch();

  updates.forEach((product) => {
    const docRef = getRefCollection(COLLECTIONS.PRODUCTS, product.id);
    batch.update(docRef, product);
  });

  await batch.commit();
}
