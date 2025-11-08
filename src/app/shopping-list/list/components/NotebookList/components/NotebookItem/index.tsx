"use client";

import { useState } from "react";
import { Minus, Plus, X, ChevronDown } from "lucide-react";
import type { ListItem } from "@/app/type";
import { updateListItem } from "@/services/list-items";
import { toast } from "sonner";
import RenderWhen from "@/components/RenderWhen";

interface NotebookItemProps {
  item: ListItem;
}

export default function NotebookItem({ item }: NotebookItemProps) {
  const [checked, setChecked] = useState(item.checked);
  const [quantity, setQuantity] = useState(item.neededQuantity);
  const [observation, setObservation] = useState(item.observation);
  const [showObservation, setShowObservation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleCheckToggle() {
    const newChecked = !checked;
    setChecked(newChecked);

    try {
      await updateListItem(item.id, { checked: newChecked });
    } catch (error) {
      setChecked(!newChecked);
      toast.error("Erro ao atualizar item");
    }
  }

  async function handleQuantityChange(delta: number) {
    const newQuantity = Math.max(0, quantity + delta);
    setQuantity(newQuantity);

    if (isUpdating) return;
    setIsUpdating(true);

    try {
      await updateListItem(item.id, { neededQuantity: newQuantity });
      toast.success("Quantidade atualizada");
    } catch (error) {
      setQuantity(quantity);
      toast.error("Erro ao atualizar quantidade");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="border-b border-gray-200 pb-4">
      <div className="flex items-center gap-4">
        <button
          onClick={handleCheckToggle}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            checked
              ? "bg-[var(--color-blue)] border-[var(--color-blue)]"
              : "border-gray-300 hover:border-[var(--color-blue)]"
          }`}
        >
          <RenderWhen isTrue={checked}>
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </RenderWhen>
        </button>

        <div className="flex-1 truncate">
          <span
            className={`text-lg ${
              checked
                ? "line-through text-gray-400"
                : "text-[var(--color-text-dark)]"
            }`}
          >
            {item.name}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity === 0 || isUpdating}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-lg font-semibold text-[var(--color-text-dark)] min-w-[2rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={isUpdating}
            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <button
          className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
          onClick={() => {
            toast.error("Funcionalidade em desenvolvimento");
          }}
        >
          <X className="w-4 h-4 text-red-600" />
        </button>
      </div>

      <div className="mt-3 ml-10">
        <button
          onClick={() => setShowObservation(!showObservation)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--color-blue)] transition-colors"
        >
          <span>Observação</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              showObservation ? "rotate-180" : ""
            }`}
          />
        </button>

        <RenderWhen isTrue={showObservation}>
          <textarea
            value={observation || ""}
            readOnly
            placeholder="Sem observação!"
            className="w-full mt-2 p-3 border border-gray-200 rounded-lg focus:border-[var(--color-blue)] text-sm resize-none"
            rows={2}
          />
        </RenderWhen>
      </div>
    </div>
  );
}
