"use client";

import { Search } from "lucide-react";
import { Item } from "@/app/type";
import AddItemButtonModal from "./AddItemModal";
import FilterButtonModal from "./FilterModal";

type ControlsProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilters: { [filterKey: string]: string[] };
  onFilterChange: (filterKey: string, value: string[]) => void;
  products: Item[];
};

export default function Controls({
  searchTerm,
  onSearchChange,
  selectedFilters,
  onFilterChange,
  products,
}: ControlsProps) {
  return (
    <>
      <div className="flex justify-between items-center my-8 w-full gap-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:shadow-md text-gray-800 placeholder-gray-400 transition-all duration-200"
          />
        </div>

        <FilterButtonModal
          products={products}
          selectedFilters={selectedFilters}
          onFilterChange={onFilterChange}
        />

        <AddItemButtonModal />
      </div>
    </>
  );
}
