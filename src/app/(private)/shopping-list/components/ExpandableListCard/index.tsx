"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, Maximize2, CheckCircle2 } from "lucide-react";
import type { Category, ListItem } from "@/app/type";
import { getCategoryName } from "@/lib/utils";
import { palletColors } from "@/app/utils";
import RenderWhen from "@/components/RenderWhen";

interface ExpandableListCardProps {
  title: string;
  subtitle?: string;
  /** Tailwind classes for the header background (solid color or gradient). */
  headerClassName: string;
  headerActions?: ReactNode;
  items: ListItem[];
  categories: Category[];
  onOpenFull: () => void;
  onFinalize: () => void;
  renderItem: (item: ListItem) => ReactNode;
  emptyText?: string;
  emptySubtext?: string;
}

export default function ExpandableListCard({
  title,
  subtitle,
  headerClassName,
  headerActions,
  items,
  categories,
  onOpenFull,
  onFinalize,
  renderItem,
  emptyText = "Nenhum item nesta lista",
  emptySubtext = "Adicione itens para começar",
}: ExpandableListCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const groupedItems = useMemo(() => {
    const groups: Record<string, ListItem[]> = {};

    items.forEach((item) => {
      const category = item.category || "Sem categoria";
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    });

    return Object.entries(groups).sort(([a], [b]) => {
      if (a === "Sem categoria") return 1;
      if (b === "Sem categoria") return -1;
      return a.localeCompare(b);
    });
  }, [items]);

  function categoryColor(categoryId: string): string {
    const colorId = categories.find((c) => c.id === categoryId)?.colorId;
    return (
      palletColors[colorId as keyof typeof palletColors]?.backgroundColor ||
      "#9CA3AF"
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div
        className={`w-full p-5 flex items-center justify-between ${headerClassName}`}
      >
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="flex items-center gap-4 flex-1 text-left cursor-pointer"
        >
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <ChevronDown
              className={`w-6 h-6 text-white transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <h3 className="text-white text-lg font-bold">{title}</h3>
              <RenderWhen isTrue={!!subtitle}>
                <p className="text-white/80 text-sm mt-0.5">{subtitle}</p>
              </RenderWhen>
            </div>
            <span className="inline-flex self-start bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-semibold text-xs">
              {checkedCount}/{totalCount} itens
            </span>
          </div>
        </button>

        <RenderWhen isTrue={!!headerActions}>
          <div className="flex items-center gap-2">{headerActions}</div>
        </RenderWhen>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-[10000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="p-4 bg-gray-50/50">
          {/* Action zone */}
          <div className="bg-white rounded-xl p-3 mb-3 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-gray-500 shrink-0">
                Progresso
              </span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-blue)] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-bold text-[var(--color-blue)] shrink-0">
                {progress.toFixed(0)}%
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onOpenFull}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                Abrir lista
              </button>

              <button
                onClick={onFinalize}
                disabled={!checkedCount}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white font-bold text-sm transition-all ${
                  checkedCount
                    ? "bg-[var(--color-blue)] hover:opacity-90"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Finalizar
              </button>
            </div>
          </div>

          {/* Grouped items */}
          <RenderWhen
            isTrue={totalCount > 0}
            elseElement={
              <div className="py-8 text-center text-[var(--color-text-gray)]">
                <p className="text-base">{emptyText}</p>
                <p className="text-sm mt-1 opacity-75">{emptySubtext}</p>
              </div>
            }
          >
            {groupedItems.map(([category, categoryItems]) => (
              <div key={category} className="mb-2">
                <div className="flex items-center gap-2 px-1 mt-2 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: categoryColor(category) }}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    {getCategoryName(categories, category)}
                  </span>
                </div>

                <div className="space-y-2">
                  {categoryItems.map((item) => (
                    <div
                      key={item.id}
                      style={{ opacity: item.checked ? 0.55 : 1 }}
                    >
                      {renderItem(item)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </RenderWhen>
        </div>
      </div>
    </div>
  );
}
