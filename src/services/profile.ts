"use server";

import { Profile } from "@/app/type";
import { authenticatedFetch, authenticatedFetchVoid } from "@/lib/api-helper";

export async function getUserProfile() {
  try {
    const data = await authenticatedFetch<{ profile: Profile }>(
      `/api/profile`,
      {
        method: "GET",
      }
    );

    if (!data) return null;

    return data.profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function updateAllProfiles() {
  try {
    await authenticatedFetchVoid(`/api/profile`, {
      method: "PUT",
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}
