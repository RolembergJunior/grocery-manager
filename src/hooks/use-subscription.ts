import { profileAtom } from "@/lib/atoms/profile";
import { useAtomValue } from "jotai";

export function useSubscription() {
  const profile = useAtomValue(profileAtom);

  function isSubscriptionActive() {
    const stripeCustomerStatus = (profile as any)?.stripeCustomerStatus;
    const subscriptionEndDate = (profile as any)?.subscriptionEndDate;

    if (!stripeCustomerStatus || stripeCustomerStatus === "canceled") {
      return false;
    }

    if (stripeCustomerStatus === "trialing" && !subscriptionEndDate) {
      return true;
    }

    if (!subscriptionEndDate) {
      return stripeCustomerStatus === "active" || stripeCustomerStatus === "trialing";
    }

    const endDate = new Date(subscriptionEndDate);
    const today = new Date();

    return endDate >= today;
  }

  const stripeCustomerStatus = profile?.stripeCustomerStatus;

  return {
    isPremium: stripeCustomerStatus === "active",
    isPro: stripeCustomerStatus === "active",
    isFree: !stripeCustomerStatus || stripeCustomerStatus === "canceled",
    isTrial: stripeCustomerStatus === "trialing",
    isActive: isSubscriptionActive(),
  };
}
