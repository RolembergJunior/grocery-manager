"use client";

import { useAtomValue } from "jotai";
import { productsAtom } from "@/lib/atoms/products";
import { Calendar, AlertTriangle, Sparkles } from "lucide-react";
import { useMemo } from "react";
import RenderWhen from "../RenderWhen";
import { RecurrencyCard } from "./components/RecurrencyCard";
import { getNextRecurrence } from "@/app/utils";

export default function RecurrenciesSection() {
  const products = useAtomValue(productsAtom);

  const recurrencies = useMemo(() => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const recurrentProducts = products.filter((p) => p.recurrencyConfig);

    const upcoming = recurrentProducts.filter((p) => {
      const nextRecurrence = getNextRecurrence(p);
      return nextRecurrence <= sevenDaysFromNow && nextRecurrence > now;
    });

    const overdue = recurrentProducts.filter((p) => {
      const nextRecurrence = getNextRecurrence(p);
      return nextRecurrence < now;
    });

    const recentlyActivated = recurrentProducts.filter((p) => {
      const updatedAt = new Date(p.updatedAt);
      return updatedAt >= threeDaysAgo;
    });

    return {
      upcoming: upcoming
        .slice(0, 5)
        .sort((a, b) => a.name.localeCompare(b.name)),
      overdue: overdue.slice(0, 5).sort((a, b) => a.name.localeCompare(b.name)),
      recentlyActivated: recentlyActivated
        .slice(0, 5)
        .sort((a, b) => a.name.localeCompare(b.name)),
    };
  }, [products]);

  const hasAnyRecurrency =
    recurrencies.upcoming.length > 0 ||
    recurrencies.overdue.length > 0 ||
    recurrencies.recentlyActivated.length > 0;

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Recorrências Ativas
      </h3>
      <div className="relative mb-6">
        <RenderWhen isTrue={!hasAnyRecurrency}>
          <div className="flex items-center justify-center py-8 px-4">
            <p className="text-[var(--color-text-gray)]/60 text-sm text-center">
              Nenhuma recorrência ativa. Configure recorrências nos seus
              produtos para acompanhar compras regulares.
            </p>
          </div>
        </RenderWhen>
        <RenderWhen isTrue={hasAnyRecurrency}>
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-4 scroll-smooth">
            <RenderWhen isTrue={!!recurrencies.upcoming.length}>
              <RecurrencyCard
                title="Próximas"
                count={recurrencies.upcoming.length}
                items={recurrencies.upcoming}
                icon={<Calendar className="w-5 h-5" />}
                colorClass="bg-[#6B9BD1]"
                textColorClass="text-white"
                showDays
              />
            </RenderWhen>

            <RenderWhen isTrue={!!recurrencies.overdue.length}>
              <RecurrencyCard
                title="Atrasadas"
                count={recurrencies.overdue.length}
                items={recurrencies.overdue}
                icon={<AlertTriangle className="w-5 h-5" />}
                colorClass="bg-[#F47E3E]"
                textColorClass="text-white"
                showDays
              />
            </RenderWhen>

            <RenderWhen isTrue={!!recurrencies.recentlyActivated.length}>
              <RecurrencyCard
                title="Recém-ativadas"
                count={recurrencies.recentlyActivated.length}
                items={recurrencies.recentlyActivated}
                icon={<Sparkles className="w-5 h-5" />}
                colorClass="bg-[#C4C857]"
                textColorClass="text-[#655C23]"
                showDays
              />
            </RenderWhen>
          </div>
        </RenderWhen>
      </div>
    </>
  );
}
