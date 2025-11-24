"use client";

import { useAtomValue } from "jotai";
import { productsAtom } from "@/lib/atoms/products";
import { TrendingUp, Lightbulb } from "lucide-react";
import { useMemo } from "react";
import { type Product } from "@/app/type";
import RenderWhen from "../RenderWhen";

export default function ReviewStockSection() {
  const products = useAtomValue(productsAtom);

  const reviewItems = useMemo(() => {
    const frequentWithoutRecurrency = products.filter((p) => {
      const hasNoRecurrency = !p.reccurency || p.reccurency === 0;
      const updatedAt = new Date(p.updatedAt);
      const createdAt = new Date(p.createdAt);
      const daysSinceCreation =
        (updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      return hasNoRecurrency && daysSinceCreation > 7;
    });

    const suggestions = frequentWithoutRecurrency.filter((p) => {
      return p.neededQuantity > 0;
    });

    return {
      frequentWithoutRecurrency: frequentWithoutRecurrency.slice(0, 5),
      suggestions: suggestions.slice(0, 5),
    };
  }, [products]);

  const hasAnyReview =
    reviewItems.frequentWithoutRecurrency.length > 0 ||
    reviewItems.suggestions.length > 0;

  if (!hasAnyReview) return null;

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Revisar Estoque
      </h3>
      <div className="relative mb-6">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-4 scroll-smooth">
          <RenderWhen isTrue={!!reviewItems.frequentWithoutRecurrency.length}>
            <ReviewCard
              title="Sem Recorrência"
              count={reviewItems.frequentWithoutRecurrency.length}
              items={reviewItems.frequentWithoutRecurrency}
              icon={<TrendingUp className="w-5 h-5" />}
              colorClass="bg-[#FBE6C9]"
              textColorClass="text-[#EF702D]"
            />
          </RenderWhen>

          <RenderWhen isTrue={!!reviewItems.suggestions.length}>
            <ReviewCard
              title="Sugestões"
              count={reviewItems.suggestions.length}
              items={reviewItems.suggestions}
              icon={<Lightbulb className="w-5 h-5" />}
              colorClass="bg-[#E4D579]"
              textColorClass="text-[#655C23]"
              description="Considere adicionar recorrência"
            />
          </RenderWhen>
        </div>
      </div>
    </>
  );
}

interface ReviewCardProps {
  title: string;
  count: number;
  items: Product[];
  icon: React.ReactNode;
  colorClass: string;
  textColorClass: string;
  description?: string;
}

function ReviewCard({
  title,
  count,
  items,
  icon,
  colorClass,
  textColorClass,
  description,
}: ReviewCardProps) {
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
          className={`${textColorClass} text-xs bg-white/30 px-2 py-1 rounded-full font-medium`}
        >
          {count}
        </span>
      </div>
      <RenderWhen isTrue={!!description}>
        <p className={`${textColorClass} text-[10px] opacity-75 mb-2`}>
          {description}
        </p>
      </RenderWhen>

      <div className="space-y-1.5">
        {items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className={`${textColorClass} text-xs bg-white/20 px-2 py-1.5 rounded-lg truncate group-hover:bg-white/30 transition-colors`}
          >
            {item.name}
          </div>
        ))}

        <RenderWhen isTrue={count > 3}>
          <div
            className={`${textColorClass} text-xs text-center opacity-75 pt-1`}
          >
            +{count - 3} mais
          </div>
        </RenderWhen>
      </div>
    </div>
  );
}
