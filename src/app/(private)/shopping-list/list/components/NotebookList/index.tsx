import { useMemo } from "react";
import type { Category, ListItem } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";
import CategorySection from "./components/CategorySection";
import { getCategoryName } from "@/lib/utils";
import { palletColors } from "@/app/utils";

const FALLBACK_COLOR = "#9CA3AF";

interface NotebookListProps {
  items: ListItem[];
  categories: Category[];
}

export default function NotebookList({ items, categories }: NotebookListProps) {
  function categoryColor(categoryId: string): string {
    const colorId = categories.find((c) => c.id === categoryId)?.colorId;
    return (
      palletColors[colorId as keyof typeof palletColors]?.backgroundColor ??
      FALLBACK_COLOR
    );
  }

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
    <div className="max-w-4xl mx-auto mt-2">
      <div>
        <RenderWhen
          isTrue={!!items.length}
          elseElement={
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">Nenhum item nesta lista</p>
              <p className="text-sm mt-2">Adicione itens para começar</p>
            </div>
          }
        >
          {groupedItems.map(([category, categoryItems]) => (
            <CategorySection
              key={category}
              category={getCategoryName(categories, category)}
              color={categoryColor(category)}
              items={categoryItems}
            />
          ))}
        </RenderWhen>
      </div>
    </div>
  );
}
