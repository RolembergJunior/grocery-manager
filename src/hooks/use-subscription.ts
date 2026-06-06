import { profileAtom } from "@/lib/atoms/profile";
import { useAtomValue } from "jotai";

export function useSubscription() {
  const profile = useAtomValue(profileAtom);

  const status = profile?.stripeCustomerStatus;
  const isActive = status === "trialing" || status === "active";

  return {
    isActive,
    isTrialing: status === "trialing",
    stripeCustomerStatus: status ?? null,
    stripeCustomerId: profile?.stripeCustomerId ?? null,
  };
}
