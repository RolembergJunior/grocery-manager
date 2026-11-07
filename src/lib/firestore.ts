import "server-only";
import type {
  CollectionReference,
  DocumentReference,
} from "firebase-admin/firestore";
import { adminDb } from "./firebaseAdmin";
import { COLLECTIONS } from "@/app/type";

export function getRefCollection(collection: COLLECTIONS): CollectionReference;
export function getRefCollection(
  collection: COLLECTIONS,
  id: string
): DocumentReference;
export function getRefCollection(collection: COLLECTIONS, id?: string) {
  const ref = adminDb.collection(collection);
  return id === undefined ? ref : ref.doc(id);
}
