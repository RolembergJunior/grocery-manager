"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ListItem } from "@/app/type";
import { toast } from "sonner";
import RenderWhen from "@/components/RenderWhen";
import QuantityControl from "./QantityControl";
import { updateItem } from "@/services/list-manager";

interface NotebookItemProps {
  item: ListItem;
}

export default function NotebookItem({ item }: NotebookItemProps) {
  const [checked, setChecked] = useState(item.checked);
  const [showObservation, setShowObservation] = useState(false);

  async function handleCheckToggle() {
    const newChecked = !checked;
    setChecked(newChecked);

    try {
      await updateItem(item.listId, item.id, { checked: newChecked });
    } catch (error) {
      setChecked(!newChecked);
      toast.error("Erro ao atualizar item");
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-3 hover:shadow-md transition-all overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={handleCheckToggle}
              className={`shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                checked
                  ? "bg-[var(--color-blue)] border-[var(--color-blue)]"
                  : "border-gray-300 hover:border-[var(--color-blue)]"
              }`}
            >
              <RenderWhen isTrue={checked}>
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </RenderWhen>
            </button>

            <h3
              className={`text-base font-medium transition-all ${
                checked ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              {item.name}
            </h3>
          </div>

          <QuantityControl
            itemId={item.id}
            boughtQuantity={item.boughtQuantity || 0}
            neededQuantity={item.neededQuantity}
            unit={item.unit}
            disabled={checked}
          />
        </div>

        {/* <RenderWhen isTrue={!!item.observation}> */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowObservation(!showObservation)}
            className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors w-full"
          >
            <span>Observação</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showObservation ? "rotate-180" : ""
              }`}
            />
            {!showObservation && (
              <span className="ml-auto text-gray-400 truncate max-w-[200px]">
                {item.observation}
              </span>
            )}
          </button>

          <RenderWhen isTrue={showObservation}>
            <div className="mt-2 px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md">
              {item.observation}
            </div>
          </RenderWhen>
        </div>
        {/* </RenderWhen> */}
      </div>
    </div>
  );
}
