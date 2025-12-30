"use client";

import { useMemo } from "react";
import type { Category, ListItem } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";
import SharedCategorySection from "../SharedCategorySection";
import { getCategoryName } from "@/lib/utils";

interface SharedNotebookListProps {
  items: ListItem[];
  categories: Category[];
  token: string;
  onToggle: (itemId: string, checked: boolean) => void;
}

export default function SharedNotebookList({
  items,
  categories,
  token,
  onToggle,
}: SharedNotebookListProps) {
  const groupedItems = useMemo(() => {
    const groups: Record<string, ListItem[]> = {};

    items.forEach((item) => {
      const category = item.category || "Sem categoria";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    return Object.entries(groups).sort(([a], [b]) => {
      if (a === "Sem categoria") return 1;
      if (b === "Sem categoria") return -1;
      return a.localeCompare(b);
    });
  }, [items]);

  return (
    <div className="mt-4">
      <RenderWhen
        isTrue={!!items.length}
        elseElement={
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">Nenhum item nesta lista</p>
            <p className="text-sm mt-2">A lista está vazia</p>
          </div>
        }
      >
        {groupedItems.map(([category, categoryItems]) => (
          <SharedCategorySection
            key={category}
            category={getCategoryName(categories, category)}
            items={categoryItems}
            token={token}
            onToggle={onToggle}
          />
        ))}
      </RenderWhen>
    </div>
  );
}
