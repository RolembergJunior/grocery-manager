"use client";

import React from "react";
import { Item } from "@/app/type";
import { getCategoryName } from "@/app/utils";
import ShoppingListItem from "./components/ShoppingListItem";

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
        {getCategoryName(category)} ({categoryItems.length})
      </h2>

      <div className="space-y-2">
        {categoryItems.map((item) => (
          <ShoppingListItem
            key={item.id}
            item={item}
            handleCheckProduct={handleCheckProduct}
            updateBoughtQuantity={updateBoughtQuantity}
            removeItem={removeItem}
          />
        ))}
      </div>
    </div>
  );
}
