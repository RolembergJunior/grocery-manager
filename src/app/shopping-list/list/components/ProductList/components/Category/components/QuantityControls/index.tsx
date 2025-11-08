"use client";

import React from "react";
import { Plus, Minus, X } from "lucide-react";
import { Product } from "@/app/type";
import { useSetAtom } from "jotai";
import { updateBoughtQuantityAtom, removeItemAtom } from "@/lib/atoms";

interface QuantityControlsProps {
  item: Product;
}

export default function QuantityControls({ item }: QuantityControlsProps) {
  const updateQuantity = useSetAtom(updateBoughtQuantityAtom);
  const removeItem = useSetAtom(removeItemAtom);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() =>
          updateQuantity({
            id: item.id,
            quantity: (item.currentQuantity || 1) - 1,
          })
        }
        disabled={(item.currentQuantity || 0) <= 0}
        className="w-8 h-8 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-full flex items-center justify-center transition-all duration-200"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span className="w-8 text-center font-medium text-slate-800">
        {item.currentQuantity || 0}
      </span>

      <button
        onClick={() =>
          updateQuantity({
            id: item.id,
            quantity: (item.boughtQuantity || 0) + 1,
          })
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
