"use client";

import { Filter, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Item } from "@/app/type";
import FilterModal from "./FilterModal";
import AddItemModal from "./AddItemModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

        <button
          onClick={() => setIsFilterOpen((v) => !v)}
          className={`px-4 py-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 transition-all duration-200 group ${
            isFilterOpen ? "bg-blue-50 border-blue-300" : ""
          }`}
          title="Filtrar produtos"
        >
          <Filter className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </button>

        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className={`p-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md transition-all duration-200 group flex items-center gap-2 font-medium ${
            isModalOpen ? "bg-blue-700" : ""
          }`}
          title="Adicionar novo produto"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        products={products}
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
      />

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
