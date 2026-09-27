import "server-only";
import type { DocumentReference } from "firebase-admin/firestore";
import { adminDb } from "../firebaseAdmin";
import type { ListItem, Product } from "@/app/type";
import {
  chunk,
  selectListItemIdsToDelete,
  selectOrphanListItemIds,
  selectProductsWithMissingCategory,
} from "@/lib/delete-cascade";
import { COLLECTIONS } from "./constants";

const BATCH_LIMIT = 450;

function ref(collection: string, id: string) {
  return adminDb.collection(collection).doc(id);
}

async function fetchAllProducts(userId: string): Promise<Product[]> {
  const snap = await adminDb
    .collection(COLLECTIONS.PRODUCTS)
    .where("userId", "==", userId)
    .get();

  return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Product);
}

async function fetchAllListItems(userId: string): Promise<ListItem[]> {
  const snap = await adminDb
    .collection(COLLECTIONS.LIST_ITEMS)
    .where("userId", "==", userId)
    .get();

  return snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as ListItem);
}

async function fetchAllCategoryIds(userId: string): Promise<string[]> {
  const snap = await adminDb
    .collection(COLLECTIONS.CATEGORIES)
    .where("userId", "==", userId)
    .get();

  return snap.docs.map((doc) => doc.id);
}

async function commitDeletes(refs: DocumentReference[]): Promise<void> {
  for (const group of chunk(refs, BATCH_LIMIT)) {
    const batch = adminDb.batch();
    for (const docRef of group) batch.delete(docRef);
    await batch.commit();
  }
}

export async function deleteCategoryCascade(
  userId: string,
  categoryId: string,
): Promise<{ productIds: string[]; listItemIds: string[] }> {
  const products = await fetchAllProducts(userId);
  const listItems = await fetchAllListItems(userId);

  const productIds = products
    .filter((p) => String(p.category) === categoryId)
    .map((p) => p.id);
  const listItemIds = selectListItemIdsToDelete({
    deletedProductIds: productIds,
    listItems,
  });

  await commitDeletes([
    ...listItemIds.map((id) => ref(COLLECTIONS.LIST_ITEMS, id)),
    ...productIds.map((id) => ref(COLLECTIONS.PRODUCTS, id)),
    ref(COLLECTIONS.CATEGORIES, categoryId),
  ]);

  return { productIds, listItemIds };
}

export async function deleteProductCascade(
  userId: string,
  productId: string,
): Promise<{ listItemIds: string[] }> {
  const listItems = await fetchAllListItems(userId);

  const listItemIds = selectListItemIdsToDelete({
    deletedProductIds: [productId],
    listItems,
  });

  await commitDeletes([
    ...listItemIds.map((id) => ref(COLLECTIONS.LIST_ITEMS, id)),
    ref(COLLECTIONS.PRODUCTS, productId),
  ]);

  return { listItemIds };
}

export async function cleanupOrphans(userId: string): Promise<{
  deletedIds: string[];
  deletedProductIds: string[];
}> {
  const listItems = await fetchAllListItems(userId);
  const products = await fetchAllProducts(userId);
  const categoryIds = await fetchAllCategoryIds(userId);

  const deletedProductIds = selectProductsWithMissingCategory({
    products,
    categoryIds,
  }).map((p) => p.id);
  const deletedProductIdSet = new Set(deletedProductIds);
  const keptProductIds = products
    .map((p) => p.id)
    .filter((id) => !deletedProductIdSet.has(id));

  const deletedIds = selectOrphanListItemIds({
    productIds: keptProductIds,
    listItems,
  });

  await commitDeletes([
    ...deletedIds.map((id) => ref(COLLECTIONS.LIST_ITEMS, id)),
    ...deletedProductIds.map((id) => ref(COLLECTIONS.PRODUCTS, id)),
  ]);

  return { deletedIds, deletedProductIds };
}
