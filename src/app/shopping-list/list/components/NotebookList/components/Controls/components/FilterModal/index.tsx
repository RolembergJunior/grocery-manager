"use client";

import { Filter } from "lucide-react";
import Modal from "@/components/Modal";
import SelectComponent from "@/components/MultiSelect";
import RenderWhen from "@/components/RenderWhen";
import { OptionsType } from "@/app/type";
import { useState } from "react";

interface FilterModalProps {
  categories: OptionsType[];
  onApplyFilters: (filters: { category: string[] }) => void;
  currentFilters: { category: string[] };
}

export default function FilterModal({
  categories,
  onApplyFilters,
  currentFilters,
}: FilterModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    currentFilters.category || []
  );

  const hasActiveFilters = currentFilters.category?.length > 0;

  function handleOpenModal() {
    setIsModalOpen(true);
    setSelectedCategories(currentFilters.category || []);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  function handleApplyFilters() {
    onApplyFilters({ category: selectedCategories });
    handleCloseModal();
  }

  function handleClearFilters() {
    setSelectedCategories([]);
    onApplyFilters({ category: [] });
    handleCloseModal();
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`px-3 py-2 rounded-xl bg-white border shadow-sm hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 transition-all duration-200 group relative ${
          hasActiveFilters
            ? "bg-blue-50 border-blue-300 border-2"
            : "border-gray-200"
        }`}
        title="Filtrar produtos"
      >
        <Filter
          className={`w-5 h-5 transition-colors ${
            hasActiveFilters
              ? "text-blue-600"
              : "text-gray-600 group-hover:text-blue-600"
          }`}
        />
        <RenderWhen isTrue={hasActiveFilters}>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {currentFilters.category.length}
          </span>
        </RenderWhen>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Filtros"
        iconTitle={<Filter className="w-6 h-6 text-blue-600" />}
      >
        <div className="space-y-4">
          <SelectComponent
            label="Categoria"
            placeholder="Selecione categorias"
            options={categories}
            defaultValue={selectedCategories}
            onChange={(values) => setSelectedCategories(values)}
            multiSelect
            showSelectAll
            className="w-full"
          />

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex-1 px-2 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={handleApplyFilters}
              className="flex-1 bg-blue hover:bg-blue/70 active:bg-blue/80 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Filtrar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
