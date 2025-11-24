"use client";

import { useAtomValue } from "jotai";
import { productsAtom } from "@/lib/atoms/products";
import { Calendar, AlertTriangle, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { type Product } from "@/app/type";
import RenderWhen from "../RenderWhen";

export default function RecurrenciesSection() {
  const products = useAtomValue(productsAtom);

  const recurrencies = useMemo(() => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const recurrentProducts = products.filter(
      (p) => p.reccurency && p.reccurency > 0
    );

    const upcoming = recurrentProducts.filter((p) => {
      const updatedAt = new Date(p.updatedAt);
      const nextRecurrence = new Date(
        updatedAt.getTime() + (p.reccurency || 0) * 24 * 60 * 60 * 1000
      );
      return nextRecurrence <= sevenDaysFromNow && nextRecurrence > now;
    });

    const overdue = recurrentProducts.filter((p) => {
      const updatedAt = new Date(p.updatedAt);
      const nextRecurrence = new Date(
        updatedAt.getTime() + (p.reccurency || 0) * 24 * 60 * 60 * 1000
      );
      return nextRecurrence < now;
    });

    const recentlyActivated = recurrentProducts.filter((p) => {
      const updatedAt = new Date(p.updatedAt);
      return updatedAt >= threeDaysAgo;
    });

    return {
      upcoming: upcoming.slice(0, 5),
      overdue: overdue.slice(0, 5),
      recentlyActivated: recentlyActivated.slice(0, 5),
    };
  }, [products]);

  const hasAnyRecurrency =
    recurrencies.upcoming.length > 0 ||
    recurrencies.overdue.length > 0 ||
    recurrencies.recentlyActivated.length > 0;

  if (!hasAnyRecurrency) return null;

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Recorrências Ativas
      </h3>
      <div className="relative mb-6">
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
      </div>
    </>
  );
}

interface RecurrencyCardProps {
  title: string;
  count: number;
  items: Product[];
  icon: React.ReactNode;
  colorClass: string;
  textColorClass: string;
  showDays?: boolean;
}

function RecurrencyCard({
  title,
  count,
  items,
  icon,
  colorClass,
  textColorClass,
  showDays = false,
}: RecurrencyCardProps) {
  return (
    <div
      className={`${colorClass} rounded-2xl p-4 flex flex-col min-w-[200px] max-w-[200px] flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-300 snap-start cursor-pointer active:scale-95 group`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`${textColorClass} flex items-center gap-2`}>
          {icon}
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <span
          className={`${textColorClass} text-xs bg-white/20 px-2 py-1 rounded-full font-medium`}
        >
          {count}
        </span>
      </div>
      <div className="space-y-1.5">
        {items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className={`${textColorClass} text-xs bg-white/10 px-2 py-1.5 rounded-lg group-hover:bg-white/20 transition-colors`}
          >
            <div className="truncate">{item.name}</div>
            {showDays && item.reccurency && (
              <div className="text-[10px] opacity-75 mt-0.5">
                A cada {item.reccurency} dias
              </div>
            )}
          </div>
        ))}
        {count > 3 && (
          <div
            className={`${textColorClass} text-xs text-center opacity-75 pt-1`}
          >
            +{count - 3} mais
          </div>
        )}
      </div>
    </div>
  );
}
