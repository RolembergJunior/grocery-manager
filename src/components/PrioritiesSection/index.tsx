"use client";

import { useAtomValue } from "jotai";
import { productsAtom } from "@/lib/atoms/products";
import { AlertCircle, TrendingDown, Clock } from "lucide-react";
import { useMemo } from "react";
import { STATUSPRODUCT, type Product } from "@/app/type";
import RenderWhen from "../RenderWhen";

export default function PrioritiesSection() {
  const products = useAtomValue(productsAtom);

  const priorities = useMemo(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const urgentItems = products.filter(
      (p) => p.statusCompra === STATUSPRODUCT.NEED_SHOPPING
    );

    const lowStockItems = products.filter(
      (p) => p.statusCompra === STATUSPRODUCT.ALMOST_EMPTY
    );

    const recentItems = products.filter((p) => {
      const updatedAt = new Date(p.updatedAt);
      return updatedAt >= oneDayAgo;
    });

    return {
      urgent: urgentItems.slice(0, 5),
      lowStock: lowStockItems.slice(0, 5),
      recent: recentItems.slice(0, 5),
    };
  }, [products]);

  const hasAnyPriority =
    priorities.urgent.length ||
    priorities.lowStock.length ||
    priorities.recent.length;

  if (!hasAnyPriority) return null;

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Prioridades do Momento
      </h3>
      <div className="relative mb-6">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-4 scroll-smooth">
          <RenderWhen isTrue={!!priorities.urgent.length}>
            <PriorityCard
              title="Sem estoque"
              count={priorities.urgent.length}
              items={priorities.urgent}
              icon={<AlertCircle className="w-5 h-5" />}
              colorClass="bg-[#F47E3E]"
              textColorClass="text-white"
            />
          </RenderWhen>

          <RenderWhen isTrue={!!priorities.lowStock.length}>
            <PriorityCard
              title="Estoque Baixo"
              count={priorities.lowStock.length}
              items={priorities.lowStock}
              icon={<TrendingDown className="w-5 h-5" />}
              colorClass="bg-[#E66BA0]"
              textColorClass="text-white"
            />
          </RenderWhen>

          <RenderWhen isTrue={!!priorities.recent.length}>
            <PriorityCard
              title="Recentes"
              count={priorities.recent.length}
              items={priorities.recent}
              icon={<Clock className="w-5 h-5" />}
              colorClass="bg-[#6B9BD1]"
              textColorClass="text-white"
            />
          </RenderWhen>
        </div>
      </div>
    </>
  );
}

interface PriorityCardProps {
  title: string;
  count: number;
  items: Product[];
  icon: React.ReactNode;
  colorClass: string;
  textColorClass: string;
}

function PriorityCard({
  title,
  count,
  items,
  icon,
  colorClass,
  textColorClass,
}: PriorityCardProps) {
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
            className={`${textColorClass} text-xs bg-white/10 px-2 py-1.5 rounded-lg truncate group-hover:bg-white/20 transition-colors`}
          >
            {item.name}
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
