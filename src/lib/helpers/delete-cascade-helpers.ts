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

// Firestore allows 500 writes per batch; keep headroom.
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

// Batches run in order, so whatever comes last (the category or product
// itself) is only removed once everything that points to it is gone. A
// failure midway leaves it in place and the delete can simply be retried.
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
  // Read products first, then list items: a list item written after the
  // product read is still caught by the list item read that follows.
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

// Repairs data left behind by earlier deletes: products whose category no
// longer exists (with their list items), and list items whose product is gone.
// Items are matched by itemId only, never by name.
export async function cleanupOrphans(userId: string): Promise<{
  deletedIds: string[];
  deletedProductIds: string[];
}> {
  // Read list items, then products, then categories: everything a later read
  // is checked against already existed when the earlier one ran, so data
  // created between the reads is never mistaken for an orphan.
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
