import { profileAtom } from "@/lib/atoms/profile";
import { useAtomValue } from "jotai";

export function useSubscription() {
  const profile = useAtomValue(profileAtom);

  function isSubscriptionActive() {
    const { subscriptionStatus, subscriptionEndDate } = profile || {};

    if (subscriptionStatus === "free") {
      return false;
    }

    if (!subscriptionEndDate && subscriptionStatus === "trial") {
      return true;
    }

    const endDate = new Date(subscriptionEndDate!);
    const today = new Date();

    return endDate >= today;
  }

  return {
    isPremium: profile?.subscriptionStatus === "premium",
    isPro: profile?.subscriptionStatus === "pro",
    isFree: profile?.subscriptionStatus === "free",
    isTrial: profile?.subscriptionStatus === "trial",
    isActive: isSubscriptionActive(),
  };
}
