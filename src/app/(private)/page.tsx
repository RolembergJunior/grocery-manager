"use client";

import HeaderPage from "@/components/HeaderPage";
import CategorySection from "@/components/CategorySection";
import ListSection from "@/components/ListSection";
import PrioritiesSection from "@/components/PrioritiesSection";
import RecurrenciesSection from "@/components/RecurrenciesSection";
import ReviewStockSection from "@/components/ReviewStockSection";
import RecentActivitySection from "@/components/RecentActivitySection";
import FreeTierBanner from "@/components/FreeTierBanner";
import { useSubscription } from "@/hooks/use-subscription";
import RenderWhen from "@/components/RenderWhen";

export default function GroceryHome() {
  const { isActive, isPremium, isPro, isFree, isTrial } = useSubscription();

  return (
    <div className="min-h-dvh md:screen p-4 pb-20">
      <HeaderPage hasNameApp />

      <RenderWhen isTrue={isTrial}>
        <FreeTierBanner />
      </RenderWhen>

      <RenderWhen isTrue={(isPro || isPremium || isTrial) && isActive}>
        <PrioritiesSection />
      </RenderWhen>

      <CategorySection />

      <RenderWhen isTrue={(isPro || isPremium || isTrial) && isActive}>
        <RecurrenciesSection />

        <ListSection />
      </RenderWhen>

      {/* <RecentActivitySection /> */}

      {/* <ReviewStockSection /> */}
    </div>
  );
}
