"use client";

import HeaderPage from "@/components/HeaderPage";
import CategorySection from "@/components/CategorySection";
import ListSection from "@/components/ListSection";
import PrioritiesSection from "@/components/PrioritiesSection";
import RecurrenciesSection from "@/components/RecurrenciesSection";
import ReviewStockSection from "@/components/ReviewStockSection";
import RecentActivitySection from "@/components/RecentActivitySection";
import FreeTierBanner from "@/components/FreeTierBanner";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import { useSubscription } from "@/hooks/use-subscription";
import RenderWhen from "@/components/RenderWhen";

export default function GroceryHome() {
  const { isActive, isTrialing } = useSubscription();

  return (
    <div className="min-h-dvh md:screen p-4 pb-20">
      <HeaderPage hasNameApp />

      <RenderWhen isTrue={isTrialing}>
        <FreeTierBanner />
      </RenderWhen>

      <RenderWhen isTrue={isActive}>
        <PrioritiesSection />
      </RenderWhen>

      <CategorySection />

      <RenderWhen isTrue={isActive}>
        <RecurrenciesSection />

        <ListSection />
      </RenderWhen>

      {/* <RecentActivitySection /> */}

      {/* <ReviewStockSection /> */}

      <OnboardingTutorial />
    </div>
  );
}
