"use client";

import { Filter } from "lucide-react";
import Modal from "../../Modal";
import SelectComponent from "../../Select";
import { Product } from "@/app/type";
import { useState } from "react";

type FilterModalProps = {
  products: Product[];
  selectedFilters: { [filterKey: string]: string[] };
  onFilterChange: (filterKey: string, value: string[]) => void;
};

export default function FilterButtonModal({
  products,
  selectedFilters,
  onFilterChange,
}: FilterModalProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsFilterOpen((v) => !v)}
        className={`p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 transition-all duration-200 group ${
          isFilterOpen ? "bg-blue-50 border-blue-300" : ""
        }`}
        title="Filtrar produtos"
      >
        <Filter className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
      </button>

      <Modal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtros"
        iconTitle={<Filter className="w-5 h-5 text-gray-600" />}
      >
        <div>
          <SelectComponent
            label="Categoria"
            placeholder="Selecione uma categoria"
            options={products.map((item) => ({
              value: item.category,
              label: item.name,
            }))}
            defaultValue={selectedFilters?.["category"] as string[]}
            onChange={(value) => onFilterChange("category", value || [])}
            multiSelect
            className="w-full"
          />

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => null}
              className="flex-1 bg-blue hover:bg-blue/90 active:bg-blue/80 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Filtrar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
