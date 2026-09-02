"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, StickyNote } from "lucide-react";
import type { ListItem } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";
import ItemCheckbox from "@/components/ItemCheckbox";
import { useToggleListItem } from "@/hooks/use-toggle-list-item";
import { formatDecimalBR } from "@/lib/helpers/number-helpers";

interface NotebookItemProps {
  item: ListItem;
}

export default function NotebookItem({ item }: NotebookItemProps) {
  const [showObservation, setShowObservation] = useState(false);
  const { onToggle } = useToggleListItem();

  const hasObservation = !!item.observation?.trim();

  return (
    <div className="py-3">
      <div className="flex items-center gap-3">
        <ItemCheckbox
          checked={!!item.checked}
          onToggle={() => onToggle(item)}
          size={24}
        />

        <h3
          className={`flex-1 text-base font-medium line-clamp-2 transition-all ${
            item.checked ? "line-through text-gray-400" : "text-gray-900"
          }`}
        >
          {item.name}
        </h3>

        <div
          className={`flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg bg-gray-100 transition-opacity ${
            item.checked ? "opacity-40" : ""
          }`}
        >
          <span className="text-sm font-semibold text-gray-700">
            {formatDecimalBR(item.neededQuantity)}
          </span>
          <span className="text-xs text-gray-400">{item.unit}</span>
        </div>
      </div>

      <RenderWhen isTrue={hasObservation}>
        <button
          onClick={() => setShowObservation((v) => !v)}
          className="flex items-center gap-2 mt-2 w-full text-left"
        >
          <StickyNote className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
          <span className="flex-1 text-xs text-gray-500 truncate">
            {item.observation}
          </span>
          <RenderWhen
            isTrue={showObservation}
            elseElement={
              <ChevronDown className="w-3.5 h-3.5 text-[#C4C7CC] shrink-0" />
            }
          >
            <ChevronUp className="w-3.5 h-3.5 text-[#C4C7CC] shrink-0" />
          </RenderWhen>
        </button>

        <RenderWhen isTrue={showObservation}>
          <div className="mt-2 px-3 py-2 bg-[#FFFBEB] border border-[#FDE9C8] rounded-lg">
            <p className="text-[13px] text-[#78500A] leading-5">
              {item.observation}
            </p>
          </div>
        </RenderWhen>
      </RenderWhen>
    </div>
  );
}
