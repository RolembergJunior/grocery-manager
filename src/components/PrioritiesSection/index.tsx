"use client";

import { useAtomValue } from "jotai";
import { productsAtom } from "@/lib/atoms/products";
import { AlertCircle, TrendingDown, Clock } from "lucide-react";
import { useMemo } from "react";
import { STATUSPRODUCT, type Product } from "@/app/type";
import RenderWhen from "../RenderWhen";
import PriorityCard from "./PriorityCard";

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

  const hasAnyPriority = Boolean(
    priorities.urgent.length ||
      priorities.lowStock.length ||
      priorities.recent.length
  );

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Prioridades do Momento
      </h3>
      <div className="relative mb-6">
        <RenderWhen isTrue={!hasAnyPriority}>
          <div className="flex items-center justify-center py-8 px-4">
            <p className="text-[var(--color-text-gray)]/60 text-sm text-center">
              Nenhuma prioridade no momento. Adicione produtos ao seu inventário
              para ver as prioridades.
            </p>
          </div>
        </RenderWhen>
        <RenderWhen isTrue={hasAnyPriority}>
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
        </RenderWhen>
      </div>
    </>
  );
}
