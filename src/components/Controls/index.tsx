"use client";

import { Plus, Search } from "lucide-react";
import { Product } from "@/app/type";
import FilterButtonModal from "./FilterModal";
import { useAtom } from "jotai";
import { mainSearchAtom, mainFiltersAtom } from "@/lib/atoms";
import { useState } from "react";
import CreateCategoryModal from "./CreateCategoryModal";

type ControlsProps = {
  products: Product[];
};

export default function Controls({ products }: ControlsProps) {
  const [isOpenCreateCategoryModal, setIsOpenCreateCategoryModal] =
    useState(false);

  const [searchTerm, setSearchTerm] = useAtom(mainSearchAtom);
  const [selectedFilters, setSelectedFilters] = useAtom(mainFiltersAtom);

  return (
    <div className="flex justify-between items-center my-4 w-full gap-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm">
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar produtos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:shadow-md text-gray-800 placeholder-gray-400 transition-all duration-200"
        />
      </div>

      <FilterButtonModal
        products={products}
        selectedFilters={selectedFilters}
        onFilterChange={(filterKey: string, value: string[]) => {
          setSelectedFilters({
            ...selectedFilters,
            [filterKey]: value,
          });
        }}
      />

      <button
        className="bg-blue p-3 rounded-2xl"
        onClick={() => setIsOpenCreateCategoryModal(true)}
      >
        <Plus color="white" />
      </button>

      <CreateCategoryModal
        isModalOpen={isOpenCreateCategoryModal}
        onCloseModal={() => setIsOpenCreateCategoryModal(false)}
        categoryToEdit={null}
      />
    </div>
  );
}
