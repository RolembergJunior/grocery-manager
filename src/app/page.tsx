"use client";

import React, { JSX, useState } from "react";
import { calculateStatistics } from "./utils";
import RenderWhen from "@/components/RenderWhen";
import EmptyProducts from "@/components/EmptyProducts";
import Statistics from "@/components/Statistics";
import Controls from "@/components/Controls";
import ProductList from "@/components/ProductList";
import { useAtomValue } from "jotai";
import { productsAtom } from "@/lib/atoms";

export default function Home(): JSX.Element {
  const products = useAtomValue(productsAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { totalItems, needsShopping, totalCategories } =
    calculateStatistics(products);

  return (
    <div className="min-h-dvh md:min-h-screen bg-[#1E459F] p-2">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 text-center text-white">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">
            Compra Casa Divo
          </h1>
          <p className="text-blue-100">
            Organize seus produtos por categoria e nunca esqueça o que precisa
            comprar!
          </p>
        </div>

        <div className="p-2">
          <Statistics
            totalItems={totalItems}
            needsShopping={needsShopping}
            totalCategories={totalCategories}
          />

          <Controls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            products={products}
          />

          <RenderWhen
            isTrue={!!products.length}
            elseElement={<EmptyProducts />}
          >
            <ProductList
              products={products}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          </RenderWhen>
        </div>
      </div>
    </div>
  );
}
