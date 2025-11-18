import "server-only";
import { adminDb } from "../firebaseAdmin";
import type { ListItem } from "@/app/type";
import { COLLECTIONS, withTimestamps } from "./constants";

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

export async function getListItemById(id: string) {
  const snapshot = await adminDb
    .collection(COLLECTIONS.LIST_ITEMS)
    .doc(id)
    .get();

  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data();
}

export async function getListItemsByListId(
  listId: string,
  includeRemoved = false
): Promise<ListItem[]> {
  let query = adminDb
    .collection(COLLECTIONS.LIST_ITEMS)
    .where("listId", "==", listId);

  if (!includeRemoved) {
    query = query.where("isRemoved", "==", false);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as ListItem);
}

export async function getListItemsByItemId(
  itemId: string,
  includeRemoved = false
): Promise<ListItem[]> {
  let query = adminDb
    .collection(COLLECTIONS.LIST_ITEMS)
    .where("itemId", "==", itemId);

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

export async function hardDeleteListItemsById(id: string): Promise<void> {
  const batch = adminDb.batch();

  const snapshot = await adminDb
    .collection(COLLECTIONS.LIST_ITEMS)
    .where("listId", "==", id)
    .get();

  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
}

export async function batchUpdateItems(items: ListItem[]): Promise<void> {
  const batch = adminDb.batch();

  items.forEach((item) => {
    const docRef = adminDb.collection(COLLECTIONS.LIST_ITEMS).doc(item.id);
    batch.update(docRef, item);
  });

  await batch.commit();
}
