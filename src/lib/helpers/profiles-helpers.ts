import "server-only";
import { adminDb } from "../firebaseAdmin";
import type { Profile } from "@/app/type";
import { COLLECTIONS, withTimestamps } from "./constants";

export async function updateProfile(
  userId: string,
  data: Partial<Omit<Profile, "createdAt" | "updatedAt">>
): Promise<void> {
  const updateData = withTimestamps(data, true);
  await adminDb.collection(COLLECTIONS.PROFILES).doc(userId).update(updateData);
}

export async function getProfile(userId: string): Promise<Profile> {
  const snapshot = await adminDb
    .collection(COLLECTIONS.PROFILES)
    .doc(userId)
    .get();

  return snapshot.data() as Profile;
}
