"use client";

import type { ListItem } from "@/app/type";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import NotebookItem from "../NotebookItem";
import RenderWhen from "@/components/RenderWhen";

interface CategorySectionProps {
  category: string;
  color: string;
  items: ListItem[];
  defaultExpanded?: boolean;
}

export default function CategorySection({
  category,
  color,
  items,
  defaultExpanded = true,
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-3">
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className={`w-full flex items-center gap-2.5 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors ${
          isExpanded ? "border-b border-gray-100" : ""
        }`}
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="flex-1 text-left text-xs font-bold uppercase tracking-wider text-gray-600 truncate">
          {category || "Sem categoria"}
        </span>
        <span className="text-[11px] text-gray-400 font-semibold">
          {checkedCount}/{totalCount}
        </span>
        <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-blue)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${
            isExpanded ? "" : "-rotate-90"
          }`}
        />
      </button>

      <RenderWhen isTrue={isExpanded}>
        <div className="px-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={index > 0 ? "border-t border-gray-100" : ""}
            >
              <NotebookItem item={item} />
            </div>
          ))}
        </div>
      </RenderWhen>
    </div>
  );
}
