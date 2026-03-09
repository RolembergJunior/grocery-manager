import { SUBSCRIPTION_STATUS } from "@/app/type";
import { profileAtom } from "@/lib/atoms/profile";
import { useAtomValue } from "jotai";

const GRACE_PERIOD_DAYS = 5;

export function useSubscription() {
  const profile = useAtomValue(profileAtom);

  function isSubscriptionActive() {
    const { subscriptionStatus, subscriptionEndDate } = profile || {};

    if (subscriptionStatus === SUBSCRIPTION_STATUS.FREE) {
      return false;
    }

    if (!subscriptionEndDate) {
      return true;
    }

    const endDate = new Date(subscriptionEndDate);
    const gracePeriodEnd = new Date(endDate);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + GRACE_PERIOD_DAYS);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    gracePeriodEnd.setHours(0, 0, 0, 0);

    return today <= gracePeriodEnd;
  }

  function getGracePeriodInfo() {
    const { subscriptionStatus, subscriptionEndDate } = profile || {};

    if (
      !subscriptionEndDate ||
      subscriptionStatus === SUBSCRIPTION_STATUS.FREE
    ) {
      return { inGracePeriod: false, daysRemaining: 0 };
    }

    const endDate = new Date(subscriptionEndDate);
    const gracePeriodEnd = new Date(endDate);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + GRACE_PERIOD_DAYS);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    gracePeriodEnd.setHours(0, 0, 0, 0);

    const inGracePeriod = today > endDate && today <= gracePeriodEnd;
    const daysRemaining = inGracePeriod
      ? Math.ceil(
          (gracePeriodEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        )
      : 0;

    return { inGracePeriod, daysRemaining };
  }

  const gracePeriodInfo = getGracePeriodInfo();

  return {
    isPremium: profile?.subscriptionStatus === SUBSCRIPTION_STATUS.PREMIUM,
    isPro: profile?.subscriptionStatus === SUBSCRIPTION_STATUS.PRO,
    isFree: profile?.subscriptionStatus === SUBSCRIPTION_STATUS.FREE,
    isTrial: profile?.subscriptionStatus === SUBSCRIPTION_STATUS.TRIAL,
    isActive: isSubscriptionActive(),
    inGracePeriod: gracePeriodInfo.inGracePeriod,
    daysRemainingInGrace: gracePeriodInfo.daysRemaining,
  };
}
