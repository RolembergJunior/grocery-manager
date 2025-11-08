"use client";

import { Search } from "lucide-react";

import { ListItem } from "@/app/type";
import { useState } from "react";
import FilterModal from "./components/FilterModal";
import ShoopingStatus from "./components/ShoopingStatus";
import AddItemButton from "./components/AddItem";

export default function Controls({
  products,
  onChangeData,
}: {
  products: ListItem[];
  onChangeData: (data: ListItem[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const categories = products.map((product, index) => ({
    value: product.category,
    label: product.category,
  }));

  function handleAddItem(item: Omit<ListItem, "id">) {
    onChangeData([...products, item]);
  }

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-2 w-full gap-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Procurar itens..."
            className="w-full pl-12 pr-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm focus:shadow-md text-gray-800 placeholder-gray-400 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        <FilterModal
          categories={categories}
          onApplyFilters={(filters) => setCategoryFilters(filters.category)}
          currentFilters={{ category: categoryFilters }}
        />

        <AddItemButton onAddItem={handleAddItem} />
      </div>

      <ShoopingStatus onFilterChange={setStatusFilter} />
    </div>
  );
}
