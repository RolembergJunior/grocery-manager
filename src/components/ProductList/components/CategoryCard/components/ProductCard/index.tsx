"use client";

import { Item } from "@/app/type";
import { useState } from "react";
import ProductObservation from "./components/ProductObservation";
import StatusSelect from "./components/StatusSelect";
import QuantityInputs from "./components/QuantityInputs";
import { getStatusText } from "./utils";
import DeleteButton from "./components/DeleteButton";

interface ProductCardProps {
  item: Item;
  status: number;
}

export default function ProductCard({ item, status }: ProductCardProps) {
  return (
    <div
      key={item.id}
      className="group relative p-6 bg-white  border border-gray-200 "
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-2">
            <StatusSelect currentStatus={status} item={item} />
          </div>
        </div>

        <DeleteButton itemId={item.id} />
      </div>

      <QuantityInputs item={item} />

      <ProductObservation item={item} />
    </div>
  );
}
