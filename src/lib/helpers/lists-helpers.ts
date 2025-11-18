import "server-only";
import { adminDb } from "../firebaseAdmin";
import type { List } from "@/app/type";
import { COLLECTIONS, withTimestamps } from "./constants";

export async function createList(data: Omit<List, "id">): Promise<List> {
  const docRef = adminDb.collection(COLLECTIONS.LISTS).doc();
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
