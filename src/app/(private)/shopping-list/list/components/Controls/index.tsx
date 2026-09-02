"use client";

import { Search } from "lucide-react";
import { Category, ListItem } from "@/app/type";
import FilterButtonModal from "./FilterModal";
import { useMemo } from "react";
import { palletColors } from "@/app/utils";

type ControlsProps = {
  items: ListItem[];
  categories: Category[];
  searchTerm: string;
  selectedCategories: string[];
  selectedChecked: string[];
  selectedFromList: string[];
  onChangeFilter: (filterKey: string, value: string[]) => void;
  onChangeSearchTerm: (value: string) => void;
};

type CategoryChip = {
  value: string;
  label: string;
  color: string;
};

const FALLBACK_COLOR = "#9CA3AF";

export default function Controls({
  items,
  categories,
  searchTerm,
  selectedCategories,
  selectedChecked,
  selectedFromList,
  onChangeFilter,
  onChangeSearchTerm,
}: ControlsProps) {
  const categoryChips = useMemo<CategoryChip[]>(() => {
    const seen = new Set<string>();
    const chips: CategoryChip[] = [];

    items.forEach((item) => {
      const key = item.category;
      if (!key || seen.has(key)) return;
      seen.add(key);

      const category = categories.find((c) => c.id === key);
      const color =
        palletColors[category?.colorId as keyof typeof palletColors]
          ?.backgroundColor ?? FALLBACK_COLOR;

      chips.push({ value: key, label: category?.name || key, color });
    });

    return chips.sort((a, b) => a.label.localeCompare(b.label));
  }, [items, categories]);

  const isAllCategories = selectedCategories.length === 0;

  function toggleCategory(value: string) {
    const next = selectedCategories.includes(value)
      ? selectedCategories.filter((v) => v !== value)
      : [...selectedCategories, value];
    onChangeFilter("category", next);
  }

  return (
    <div className="my-4 w-full">
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
          <input
            type="text"
            placeholder="Buscar itens..."
            value={searchTerm}
            onChange={(e) => onChangeSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-800 placeholder-gray-400 focus:border-[var(--color-blue)] focus:outline-none transition-colors"
          />
        </div>

        <FilterButtonModal
          selectedChecked={selectedChecked}
          selectedFromList={selectedFromList}
          onFilterChange={onChangeFilter}
        />
      </div>

      {categoryChips.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2.5 md:pb-1">
          <button
            onClick={() => onChangeFilter("category", [])}
            className={`shrink-0 px-4 py-2 rounded-full border text-xs font-bold transition-colors ${
              isAllCategories
                ? "bg-[var(--color-blue)] border-[var(--color-blue)] text-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Todos
          </button>

          {categoryChips.map((chip) => {
            const selected = selectedCategories.includes(chip.value);
            return (
              <button
                key={chip.value}
                onClick={() => toggleCategory(chip.value)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold transition-colors ${
                  selected
                    ? "bg-[var(--color-blue)] border-[var(--color-blue)] text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: selected ? "#FFFFFF" : chip.color }}
                />
                {chip.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
