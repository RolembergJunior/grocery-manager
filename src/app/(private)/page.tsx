"use client";

import HeaderPage from "@/components/HeaderPage";
import CategorySection from "@/components/CategorySection";
import ListSection from "@/components/ListSection";
import PrioritiesSection from "@/components/PrioritiesSection";
import RecurrenciesSection from "@/components/RecurrenciesSection";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import { useSubscription } from "@/hooks/use-subscription";
import RenderWhen from "@/components/RenderWhen";
import Banner from "@/components/Banner";

export default function GroceryHome() {
  const { isActive, inGracePeriod } = useSubscription();

  return (
    <div className="min-h-dvh md:screen p-4 pb-20">
      <HeaderPage hasNameApp />

      <RenderWhen isTrue={inGracePeriod || !isActive}>
        <Banner />
      </RenderWhen>

      <PrioritiesSection />

      <CategorySection />

      <RenderWhen isTrue={inGracePeriod || isActive}>
        <RecurrenciesSection />

        <ListSection />
      </RenderWhen>

      {/* <RecentActivitySection /> */}

      {/* <ReviewStockSection /> */}

      <OnboardingTutorial />
    </div>
  );
}
