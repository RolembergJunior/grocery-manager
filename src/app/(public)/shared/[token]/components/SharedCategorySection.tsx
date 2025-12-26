"use client";

import type { ListItem } from "@/app/type";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SharedNotebookItem from "./SharedNotebookItem";
import RenderWhen from "@/components/RenderWhen";

interface SharedCategorySectionProps {
  category: string;
  items: ListItem[];
  token: string;
  defaultExpanded?: boolean;
  onToggle: (itemId: string, checked: boolean) => void;
}

export default function SharedCategorySection({
  category,
  items,
  token,
  defaultExpanded = true,
  onToggle,
}: SharedCategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isExpanded ? "" : "-rotate-90"
            }`}
          />
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {category || "Sem categoria"}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {checkedCount}/{totalCount}
          </span>
          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--color-blue)] transition-all duration-300"
              style={{
                width:
                  totalCount > 0
                    ? `${(checkedCount / totalCount) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </button>

      <RenderWhen isTrue={isExpanded}>
        <div className="mt-2 pl-2">
          {items.map((item) => (
            <SharedNotebookItem
              key={item.id}
              item={item}
              token={token}
              onToggle={onToggle}
            />
          ))}
        </div>
      </RenderWhen>
    </div>
  );
}
