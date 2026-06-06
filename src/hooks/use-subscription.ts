import { profileAtom } from "@/lib/atoms/profile";
import { useAtomValue } from "jotai";

export function useSubscription() {
  const profile = useAtomValue(profileAtom);

  const status = profile?.stripeCustomerStatus;
  // trialing users get full access during their trial period
  const isActive = status === "trialing" || status === "active";

  return {
    isActive,
    isTrialing: status === "trialing",
  };
}
