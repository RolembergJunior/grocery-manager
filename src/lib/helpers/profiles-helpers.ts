import "server-only";
import type { Profile } from "@/app/type";
import { withTimestamps } from "./constants";
import { getRefCollection } from "@/lib/firestore";
import { COLLECTIONS } from "@/app/type";

export async function updateProfile(
  userId: string,
  data: Partial<Omit<Profile, "createdAt" | "updatedAt">>
): Promise<void> {
  const updateData = withTimestamps(data, true);
  await getRefCollection(COLLECTIONS.PROFILES, userId).update(updateData);
}

export async function getProfile(userId: string): Promise<Profile> {
  const snapshot = await getRefCollection(COLLECTIONS.PROFILES, userId).get();

  return snapshot.data() as Profile;
}
