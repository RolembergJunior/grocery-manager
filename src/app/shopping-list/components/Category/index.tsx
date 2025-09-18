"use client";

import React from "react";
import { Plus, Minus, Check, X } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";
import { Item } from "@/app/type";

export default function Category({
  category,
  categoryItems,
  handleCheckProduct,
  updateBoughtQuantity,
  removeItem,
}: {
  category: string;
  categoryItems: Item[];
  handleCheckProduct: (id: number) => void;
  updateBoughtQuantity: (id: number, change: number) => void;
  removeItem: (id: number) => void;
}) {
  return (
    <div key={category} className="mb-6">
      <h2 className="text-lg font-bold text-slate-700 mb-3 px-2">
        {category} ({categoryItems.length})
      </h2>

      <div className="space-y-2">
        {categoryItems.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-lg shadow-sm border p-4 ${
              item.completed
                ? "border-green-200 bg-green-50"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCheckProduct(item.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      item.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-slate-300 hover:border-blue-600"
                    }`}
                  >
                    {item.completed && <Check className="w-4 h-4" />}
                  </button>

                  <div>
                    <h3
                      className={`font-medium ${
                        item.completed
                          ? "text-green-700 line-through"
                          : "text-slate-800"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {item.currentQuantity + (item.boughtQuantity || 0)}/
                      {item.neededQuantity}
                    </p>
                  </div>
                </div>
              </div>

              <RenderWhen isTrue={!item.completed}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateBoughtQuantity(
                        item.id,
                        (item.boughtQuantity || 1) - 1
                      )
                    }
                    disabled={(item.boughtQuantity || 0) <= 0}
                    className="w-8 h-8 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-full flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-8 text-center font-medium text-slate-800">
                    {item.boughtQuantity || 0}
                  </span>

                  <button
                    onClick={() =>
                      updateBoughtQuantity(
                        item.id,
                        (item.boughtQuantity || 0) + 1
                      )
                    }
                    disabled={(item.boughtQuantity || 0) >= item.neededQuantity}
                    className="w-8 h-8 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </RenderWhen>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Observações
                </h2>
              </div>
              <RenderWhen
                isTrue={!!item.observation}
                elseElement={
                  <p className="text-sm text-gray-400 leading-relaxed text-center font-semibold">
                    Nenhuma observação
                  </p>
                }
              >
                <p className="text-sm text-gray-700 leading-relaxed">
                  {item.observation}
                </p>
              </RenderWhen>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
