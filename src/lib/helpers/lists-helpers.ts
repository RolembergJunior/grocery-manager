import "server-only";
import type { List } from "@/app/type";
import { withTimestamps } from "./constants";
import { getRefCollection } from "@/lib/firestore";
import { COLLECTIONS } from "@/app/type";

export async function createList(data: Omit<List, "id">): Promise<List> {
  const docRef = getRefCollection(COLLECTIONS.LISTS).doc();
  const listData: List = {
    ...data,
    id: docRef.id,
  };
  await docRef.set(listData);
  return listData;
}

export async function getListsByUserId(
  userId: string,
  includeRemoved = false
): Promise<List[]> {
  let query = getRefCollection(COLLECTIONS.LISTS).where("userId", "==", userId);

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
  await getRefCollection(COLLECTIONS.LISTS, id).update(updateData);
}

export async function softDeleteList(id: string): Promise<void> {
  const updateData = withTimestamps({ isRemoved: true }, true);
  await getRefCollection(COLLECTIONS.LISTS, id).update(updateData);
}

export async function hardDeleteList(id: string): Promise<void> {
  await getRefCollection(COLLECTIONS.LISTS, id).delete();
}
