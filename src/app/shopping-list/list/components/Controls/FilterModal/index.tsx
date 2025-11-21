"use client";

import { Filter } from "lucide-react";
import Modal from "@/components/Modal";
import MultiSelect from "@/components/MultiSelect";
import { Category } from "@/app/type";
import { useState } from "react";
import RenderWhen from "@/components/RenderWhen";

type FilterModalProps = {
  categories: Category[];
  selectedCategories: string[];
  selectedChecked: string[];
  selectedFromList: string[];
  onFilterChange: (filterKey: string, value: string[]) => void;
};

const checkedOptions = [
  { value: true, label: "Marcados" },
  { value: false, label: "Não marcados" },
];

const fromListOptions = [
  { value: "inventory", label: "Do Estoque" },
  { value: "created", label: "Criados Manualmente" },
];

export default function FilterButtonModal({
  categories,
  selectedCategories,
  selectedChecked,
  selectedFromList,
  onFilterChange,
}: FilterModalProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = [
    selectedCategories.length > 0,
    selectedChecked.length > 0,
    selectedFromList.length > 0,
  ].filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setIsFilterOpen((v) => !v)}
        className={`relative p-3 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 transition-all duration-200 group ${
          isFilterOpen ? "bg-blue-50 border-blue-300" : ""
        }`}
        title="Filtrar itens"
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
        iconTitle={<Filter className="w-5 h-5 text-[var(--color-blue)]" />}
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--color-text-dark)] uppercase tracking-wide">
              Categoria
            </h3>
            <MultiSelect
              placeholder="Selecione categorias"
              options={categories.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              value={selectedCategories}
              onChange={(value) => onFilterChange("category", value || [])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--color-text-dark)] uppercase tracking-wide">
              Status de Marcação
            </h3>
            <MultiSelect
              placeholder="Selecione o status"
              options={checkedOptions}
              value={selectedChecked}
              onChange={(value) => onFilterChange("checked", value || [])}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--color-text-dark)] uppercase tracking-wide">
              Origem do Item
            </h3>
            <MultiSelect
              placeholder="Selecione a origem"
              options={fromListOptions}
              value={selectedFromList}
              onChange={(value) => onFilterChange("fromList", value || [])}
              className="w-full"
            />
          </div>

          <RenderWhen isTrue={activeFiltersCount > 0}>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-text-gray)]">
                  {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""}{" "}
                  ativo
                  {activeFiltersCount > 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => {
                    onFilterChange("category", []);
                    onFilterChange("checked", []);
                    onFilterChange("fromList", []);
                  }}
                  className="text-sm font-medium text-[var(--color-blue)] hover:text-[var(--color-blue)]/80 transition-colors"
                >
                  Limpar todos
                </button>
              </div>
            </div>
          </RenderWhen>
        </div>
      </Modal>
    </>
  );
}
