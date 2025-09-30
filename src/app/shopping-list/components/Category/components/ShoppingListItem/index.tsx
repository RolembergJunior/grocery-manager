"use client";

import React from "react";
import { Check } from "lucide-react";
import { Item } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";
import QuantityControls from "../QuantityControls";
import ItemObservation from "../ItemObservation";

interface ShoppingListItemProps {
  item: Item;
  handleCheckProduct: (id: number) => void;
  updateBoughtQuantity: (id: number, change: number) => void;
  removeItem: (id: number) => void;
}

function getStatusStyles(completed: boolean, isRemoved: boolean) {
  if (isRemoved) {
    return {
      container: "opacity-50 scale-95 border-red-200 bg-red-50/30",
      checkbox: "cursor-not-allowed opacity-50",
      text: "line-through text-red-400",
    };
  }

  if (completed) {
    return {
      container: "border-green-200 bg-green-50",
      checkbox: "bg-green-500 border-green-500 text-white",
      text: "text-green-700 line-through",
    };
  }

  return {
    container: "border-slate-200",
    checkbox: "border-slate-300 hover:border-blue-600",
    text: "text-slate-800",
  };
}

export default function ShoppingListItem({
  item,
  handleCheckProduct,
  updateBoughtQuantity,
  removeItem,
}: ShoppingListItemProps) {
  const isRemoved = item.isRemoved === 1;
  const statusStyles = getStatusStyles(!!item.completed, isRemoved);

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border p-4 transition-all duration-300
        ${statusStyles.container}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCheckProduct(item.id)}
              disabled={isRemoved}
              className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center
                transition-all duration-200 cursor-pointer
                ${statusStyles.checkbox}
              `}
            >
              {item.completed && <Check className="w-4 h-4" />}
            </button>

            <div className="flex-1">
              <h3
                className={`
                  font-medium transition-all duration-200
                  ${statusStyles.text}
                `}
              >
                {item.name}
                {isRemoved && (
                  <span className="ml-2 text-xs font-semibold text-red-500 bg-red-100 px-2 py-1 rounded-full">
                    Removido
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-500">
                {item.currentQuantity + (item.boughtQuantity || 0)}/
                {item.neededQuantity} ({item.unit})
              </p>
            </div>
          </div>
        </div>

        <RenderWhen isTrue={!item.completed && !isRemoved}>
          <QuantityControls
            item={item}
            updateBoughtQuantity={updateBoughtQuantity}
            removeItem={removeItem}
          />
        </RenderWhen>
      </div>

      <ItemObservation observation={item.observation} isRemoved={isRemoved} />
    </div>
  );
}
