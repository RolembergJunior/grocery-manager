"use client";

import React from "react";
import { Plus, Minus, X } from "lucide-react";
import { Item } from "@/app/type";

interface QuantityControlsProps {
  item: Item;
  updateBoughtQuantity: (id: number, change: number) => void;
  removeItem: (id: number) => void;
}

export default function QuantityControls({
  item,
  updateBoughtQuantity,
  removeItem,
}: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() =>
          updateBoughtQuantity(item.id, (item.boughtQuantity || 1) - 1)
        }
        disabled={(item.boughtQuantity || 0) <= 0}
        className="w-8 h-8 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-full flex items-center justify-center transition-all duration-200"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-8 text-center font-medium text-slate-800">
        {item.boughtQuantity || 0}
      </span>

      <button
        onClick={() =>
          updateBoughtQuantity(item.id, (item.boughtQuantity || 0) + 1)
        }
        disabled={(item.boughtQuantity || 0) >= item.neededQuantity}
        className="w-8 h-8 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        onClick={() => removeItem(item.id)}
        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center ml-2 transition-all duration-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
