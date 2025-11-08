import "server-only";
import { adminDb } from "./firebaseAdmin";
import type { Profile, Product, Category, List, ListItem } from "@/app/type";

// Collection names
export const COLLECTIONS = {
  PROFILES: "users",
  PRODUCTS: "products",
  CATEGORIES: "categories",
  LISTS: "lists",
  LIST_ITEMS: "list_items",
} as const;

// Helper to add timestamps
function withTimestamps<T extends object>(data: T, isUpdate = false) {
  const now = new Date().toISOString();
  if (isUpdate) {
    return { ...data, updatedAt: now };
  }
  return { ...data, createdAt: now, updatedAt: now };
}

// ============================================
// PROFILES CRUD
// ============================================

export async function createProfile(
  userId: string,
  data: Omit<Profile, "createdAt" | "updatedAt">
): Promise<Profile> {
  const profileData = withTimestamps(data) as Profile;
  await adminDb.collection(COLLECTIONS.PROFILES).doc(userId).set(profileData);
  return profileData;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const doc = await adminDb.collection(COLLECTIONS.PROFILES).doc(userId).get();
  if (!doc.exists) return null;
  return doc.data() as Profile;
}

export async function updateProfile(
  userId: string,
  data: Partial<Omit<Profile, "createdAt" | "updatedAt">>
): Promise<void> {
  const updateData = withTimestamps(data, true);
  await adminDb.collection(COLLECTIONS.PROFILES).doc(userId).update(updateData);
}

// ============================================
// PRODUCTS CRUD
// ============================================

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

export async function hardDeleteProduct(id: string): Promise<void> {
  await adminDb.collection(COLLECTIONS.PRODUCTS).doc(id).delete();
}

// ============================================
// CATEGORIES CRUD
// ============================================

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

export async function getCategory(id: string): Promise<Category | null> {
  const doc = await adminDb.collection(COLLECTIONS.CATEGORIES).doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as Category;
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

export async function hardDeleteCategory(id: string): Promise<void> {
  await adminDb.collection(COLLECTIONS.CATEGORIES).doc(id).delete();
}

// ============================================
// LISTS CRUD
// ============================================

export async function createList(data: Omit<List, "id">): Promise<List> {
  const docRef = adminDb.collection(COLLECTIONS.LISTS).doc();
  const listData: List = {
    ...data,
    id: docRef.id,
  };
  await docRef.set(listData);
  return listData;
}

export async function getList(id: string): Promise<List | null> {
  const doc = await adminDb.collection(COLLECTIONS.LISTS).doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as List;
}

export async function getListsByUserId(
  userId: string,
  includeRemoved = false
): Promise<List[]> {
  let query = adminDb
    .collection(COLLECTIONS.LISTS)
    .where("userId", "==", userId);

  if (!includeRemoved) {
    query = query.where("isRemoved", "==", false);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as List);
}

export async function updateList(
  id: string,
  data: Partial<Omit<List, "id" | "userId" | "createdAt">>
): Promise<void> {
  const updateData = withTimestamps(data, true);
  await adminDb.collection(COLLECTIONS.LISTS).doc(id).update(updateData);
}

export async function softDeleteList(id: string): Promise<void> {
  const updateData = withTimestamps({ isRemoved: true }, true);
  await adminDb.collection(COLLECTIONS.LISTS).doc(id).update(updateData);
}

export async function hardDeleteList(id: string): Promise<void> {
  await adminDb.collection(COLLECTIONS.LISTS).doc(id).delete();
}

// ============================================
// LIST_ITEMS CRUD
// ============================================

export async function createListItem(
  data: Omit<ListItem, "id">
): Promise<ListItem> {
  const docRef = adminDb.collection(COLLECTIONS.LIST_ITEMS).doc();
  const listItemData: ListItem = {
    ...data,
    id: docRef.id,
  };
  await docRef.set(listItemData);
  return listItemData;
}

export async function getListItem(id: string): Promise<ListItem | null> {
  const doc = await adminDb.collection(COLLECTIONS.LIST_ITEMS).doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as ListItem;
}

export async function getListItemsByListId(
  listId: string,
  includeRemoved = false
): Promise<ListItem[]> {
  let query = adminDb
    .collection(COLLECTIONS.LIST_ITEMS)
    .where("list_id", "==", listId);

  if (!includeRemoved) {
    query = query.where("isRemoved", "==", false);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as ListItem);
}

export async function getListItemsByUserId(
  userId: string,
  includeRemoved = false
): Promise<ListItem[]> {
  let query = adminDb
    .collection(COLLECTIONS.LIST_ITEMS)
    .where("userId", "==", userId);

  if (!includeRemoved) {
    query = query.where("isRemoved", "==", false);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as ListItem);
}

export async function updateListItem(
  id: string,
  data: Partial<Omit<ListItem, "id" | "userId" | "createdAt">>
): Promise<void> {
  const updateData = withTimestamps(data, true);
  await adminDb.collection(COLLECTIONS.LIST_ITEMS).doc(id).update(updateData);
}

export async function softDeleteListItem(id: string): Promise<void> {
  const updateData = withTimestamps({ isRemoved: true }, true);
  await adminDb.collection(COLLECTIONS.LIST_ITEMS).doc(id).update(updateData);
}

export async function hardDeleteListItem(id: string): Promise<void> {
  await adminDb.collection(COLLECTIONS.LIST_ITEMS).doc(id).delete();
}

// ============================================
// BATCH OPERATIONS
// ============================================

/**
 * Batch update multiple products
 */
export async function batchUpdateProducts(
  updates: Array<{ id: string; data: Partial<Omit<Product, "id" | "userId">> }>
): Promise<void> {
  const batch = adminDb.batch();

  updates.forEach(({ id, data }) => {
    const docRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc(id);
    batch.update(docRef, data);
  });

  await batch.commit();
}

/**
 * Batch soft delete multiple products
 */
export async function batchSoftDeleteProducts(ids: string[]): Promise<void> {
  const batch = adminDb.batch();

  ids.forEach((id) => {
    const docRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc(id);
    batch.update(docRef, { isRemoved: 1 });
  });

  await batch.commit();
}

/**
 * Transaction: Update list and its items atomically
 */
export async function updateListWithItems(
  listId: string,
  listData: Partial<Omit<List, "id" | "userId" | "createdAt">>,
  itemIds: string[]
): Promise<void> {
  await adminDb.runTransaction(async (transaction) => {
    const listRef = adminDb.collection(COLLECTIONS.LISTS).doc(listId);
    const listDoc = await transaction.get(listRef);

    if (!listDoc.exists) {
      throw new Error("List not found");
    }

    const updateData = withTimestamps(
      {
        ...listData,
        itemId: itemIds,
      },
      true
    );

    transaction.update(listRef, updateData);
  });
}
