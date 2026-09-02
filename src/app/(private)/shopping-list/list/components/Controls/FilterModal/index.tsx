"use client";

import { Filter } from "lucide-react";
import Modal from "@/components/Modal";
import MultiSelect from "@/components/MultiSelect";
import { useState } from "react";
import RenderWhen from "@/components/RenderWhen";

type FilterModalProps = {
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
  selectedChecked,
  selectedFromList,
  onFilterChange,
}: FilterModalProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFiltersCount = [
    selectedChecked.length > 0,
    selectedFromList.length > 0,
  ].filter(Boolean).length;

  return (
    <>
      <button
        onClick={() => setIsFilterOpen((v) => !v)}
        className={`flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-sm transition-colors ${
          activeFiltersCount > 0
            ? "bg-[var(--color-blue)] border-[var(--color-blue)]"
            : "bg-white border-gray-100 hover:bg-gray-50"
        }`}
        title="Filtrar itens"
      >
        <Filter
          className={`w-4 h-4 ${
            activeFiltersCount > 0 ? "text-white" : "text-gray-700"
          }`}
        />
        <span
          className={`text-sm font-bold ${
            activeFiltersCount > 0 ? "text-white" : "text-gray-800"
          }`}
        >
          Filtros
        </span>
        <RenderWhen isTrue={activeFiltersCount > 0}>
          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-extrabold text-white">
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
