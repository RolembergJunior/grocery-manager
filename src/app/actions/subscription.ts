"use server";

import { requireSessionUid } from "@/lib/auth-server";
import { updateProfile } from "@/lib/helpers/profiles-helpers";

export async function activateSubscription(): Promise<void> {
  const uid = await requireSessionUid();
  await updateProfile(uid, { stripeCustomerStatus: "active" });
}
