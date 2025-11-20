"use client";

import { Filter } from "lucide-react";
import Modal from "../../Modal";
import MultiSelect from "../../MultiSelect";
import { Category } from "@/app/type";
import { useState } from "react";
import { buyStatusOptions } from "@/app/utils";
import RenderWhen from "@/components/RenderWhen";

type FilterModalProps = {
  categories: Category[];
  selectedFilters: string[];
  selectedStatus: string[];
  onFilterChange: (filterKey: string, value: string[]) => void;
};

export default function FilterButtonModal({
  categories,
  selectedFilters,
  selectedStatus,
  onFilterChange,
}: FilterModalProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = [
    selectedFilters.length > 0,
    selectedStatus.length > 0,
  ].filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setIsFilterOpen((v) => !v)}
        className={`relative p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 transition-all duration-200 group ${
          isFilterOpen ? "bg-blue-50 border-blue-300" : ""
        }`}
        title="Filtrar produtos"
      >
        <Filter className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        <RenderWhen isTrue={activeFiltersCount > 0}>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            {activeFiltersCount}
          </span>
        </RenderWhen>
      </button>

      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtros"
        iconTitle={<Filter className="w-5 h-5 text-gray-600" />}
      >
        <div className="space-y-2 max-h-60">
          <MultiSelect
            label="Categoria"
            placeholder="Selecione uma categoria"
            options={categories.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={selectedFilters}
            onChange={(value) => onFilterChange("category", value || [])}
            className="w-full"
          />

          <MultiSelect
            label="Status"
            placeholder="Selecione um status"
            options={buyStatusOptions}
            value={selectedStatus}
            onChange={(value) => onFilterChange("statusCompra", value || [])}
            className="w-full"
          />
        </div>
      </Modal>
    </>
  );
}
