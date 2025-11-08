"use client";

import { Product, Category } from "@/app/type";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatCategoryTitle } from "./utils";
import ProductCard from "./components/ProductCard";
import EmptyState from "./components/EmptyState";
import RenderWhen from "@/components/RenderWhen";
import { palletColors } from "@/app/utils";
import CreateItemButton from "./components/CreateItemButton";

interface CategoryCardProps {
  category: Category;
  items: Product[];
  totalItems: number;
}

export default function CategoryCard({
  category,
  items,
  totalItems,
}: CategoryCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statusCounts = items.reduce(
    (acc, item) => {
      const status = item.statusCompra;
      if (status === 1) acc.comprar++;
      else if (status === 2) acc.acabando++;
      else if (status === 3) acc.tem++;
      return acc;
    },
    { comprar: 0, acabando: 0, tem: 0 }
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          palletColors[category.colorId as keyof typeof palletColors].bgClass
        } ${
          palletColors[category.colorId as keyof typeof palletColors].textClass
        } ${
          palletColors[category.colorId as keyof typeof palletColors]
            .borderClass
        } w-full p-2 flex flex-col gap-2 items-center justify-between transition-all cursor-pointer`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <ChevronDown
              className={`w-6 h-6 text-white transition-transform duration-300 ${
                isOpen ? "rotate-0" : "-rotate-90"
              }`}
            />

            <h3
              className={`${
                palletColors[category.colorId as keyof typeof palletColors]
                  .textClass
              } text-xl font-bold capitalize`}
            >
              {formatCategoryTitle(category.name)}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <RenderWhen isTrue={statusCounts.comprar > 0}>
                <div className="bg-white text-red-400 w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                  <span>{statusCounts.comprar}</span>
                </div>
              </RenderWhen>
              <RenderWhen isTrue={statusCounts.acabando > 0}>
                <div className="bg-white text-orange-400 w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                  <span>{statusCounts.acabando}</span>
                </div>
              </RenderWhen>
              <RenderWhen isTrue={statusCounts.tem > 0}>
                <div className="bg-white text-green-600 w-8 h-8 flex items-center justify-center rounded-full font-semibold">
                  <span>{statusCounts.tem}</span>
                </div>
              </RenderWhen>

              {/* <div className="w-8 h-8 text-black/50 bg-white rounded-full flex items-center justify-center font-bold ">
                {totalItems}
              </div> */}
            </div>

            <div className="w-[1px] h-[1rem] bg-white/50" />

            <CreateItemButton category={category} />
          </div>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[10000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <RenderWhen
          isTrue={items && items.length > 0}
          elseElement={<EmptyState />}
        >
          <div className="divide-y divide-gray-200">
            {items.map((item: Product) => (
              <ProductCard
                key={item.id}
                item={item}
                status={item.statusCompra}
                colorId={category.colorId}
              />
            ))}
          </div>
        </RenderWhen>
      </div>
    </div>
  );
}
