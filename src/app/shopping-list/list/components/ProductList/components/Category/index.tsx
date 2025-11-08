"use client";

import React from "react";
import { Product } from "@/app/type";
import ShoppingListItem from "./components/ShoppingListItem";

export default function Category({
  category,
  categoryItems,
}: {
  category: string;
  categoryItems: Product[];
}) {
  return (
    <div key={category} className="mb-6">
      <h2 className="text-lg font-bold text-slate-700 mb-3 px-2">
        {category} ({categoryItems.length})
      </h2>

      <div className="space-y-2">
        {categoryItems.map((item) => (
          <ShoppingListItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
