"use client";

import { Filter } from "lucide-react";
import Modal from "../../Modal";
import SelectComponent from "../../Select";
import { getCategories } from "@/app/utils";
import { Item } from "@/app/type";

type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: Item[];
  selectedFilters: { [filterKey: string]: string[] };
  onFilterChange: (filterKey: string, value: string[]) => void;
};

export default function FilterModal({
  isOpen,
  onClose,
  products,
  selectedFilters,
  onFilterChange,
}: FilterModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filtros"
      iconTitle={<Filter className="w-5 h-5 text-gray-600" />}
    >
      <div>
        <SelectComponent
          label="Categoria"
          placeholder="Selecione uma categoria"
          options={getCategories(products)}
          defaultValue={selectedFilters?.["category"] as string[]}
          onChange={(value) => onFilterChange("category", value || [])}
          multiSelect
        />

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => null}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Filtrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
