"use client";

import { Search } from "lucide-react";
import { Category } from "@/app/type";
import FilterButtonModal from "./FilterModal";

type ControlsProps = {
  categories: Category[];
  searchTerm: string;
  selectedCategories: string[];
  selectedChecked: string[];
  selectedFromList: string[];
  onChangeFilter: (filterKey: string, value: string[]) => void;
  onChangeSearchTerm: (value: string) => void;
};

export default function Controls({
  categories,
  searchTerm,
  selectedCategories,
  selectedChecked,
  selectedFromList,
  onChangeFilter,
  onChangeSearchTerm,
}: ControlsProps) {
  return (
    <div className="flex justify-between items-center my-4 w-full gap-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar itens da lista..."
          value={searchTerm}
          onChange={(e) => onChangeSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:shadow-md text-gray-800 placeholder-gray-400 transition-all duration-200"
        />
      </div>

      <FilterButtonModal
        categories={categories}
        selectedCategories={selectedCategories}
        selectedChecked={selectedChecked}
        selectedFromList={selectedFromList}
        onFilterChange={(filterKey: string, value: string[]) => {
          onChangeFilter(filterKey, value);
        }}
      />
    </div>
  );
}
