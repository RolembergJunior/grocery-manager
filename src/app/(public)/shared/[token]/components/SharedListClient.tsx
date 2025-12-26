"use client";

import { useState, useMemo } from "react";
import type { List, ListItem, Category } from "@/app/type";
import { Share2 } from "lucide-react";
import SharedNotebookList from "./SharedNotebookList";
import SharedProgressBar from "./SharedProgressBar";

interface SharedListClientProps {
  list: List;
  initialItems: ListItem[];
  categories: Category[];
  token: string;
}

export default function SharedListClient({
  list,
  initialItems,
  categories,
  token,
}: SharedListClientProps) {
  const [items, setItems] = useState<ListItem[]>(initialItems);

  const { checkedCount, totalCount, progressPercentage } = useMemo(() => {
    const checked = items.filter((item) => item.checked).length;
    const total = items.length;
    const percentage = total > 0 ? (checked / total) * 100 : 0;

    return {
      checkedCount: checked,
      totalCount: total,
      progressPercentage: Number(percentage.toFixed(2)),
    };
  }, [items]);

  function handleToggle(itemId: string, checked: boolean) {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, checked } : item))
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-blue)]/10 rounded-lg">
              <Share2 className="w-5 h-5 text-[var(--color-blue)]" />
            </div>
            <span className="text-sm font-medium text-[var(--color-blue)]">
              Lista Compartilhada
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">{list.name}</h1>

          {list.description && (
            <p className="text-gray-500 mt-1">{list.description}</p>
          )}
        </div>

        <SharedProgressBar
          checkedCount={checkedCount}
          totalCount={totalCount}
          progressPercentage={progressPercentage}
        />

        <SharedNotebookList
          items={items}
          categories={categories}
          token={token}
          onToggle={handleToggle}
        />

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Marque os itens conforme for comprando
          </p>
        </div>
      </div>
    </div>
  );
}
