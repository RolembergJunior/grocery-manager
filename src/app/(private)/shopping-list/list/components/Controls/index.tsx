"use client";

import { Search } from "lucide-react";
import { Category, ListItem, OptionsType } from "@/app/type";
import FilterButtonModal from "./FilterModal";
import { useMemo } from "react";
import { getCategoryName } from "@/lib/utils";

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
  const normalizedCategories = useMemo(() => {
    const categoryArray: OptionsType[] = [];

    items.forEach((item) => {
      const refferedCategory = categories.find(
        (category) => category.id === item.category
      );
      const existsCategory = categoryArray.find(
        (category) => category.value === item.category
      );

      if (!existsCategory) {
        if (refferedCategory) {
          categoryArray.push({
            value: refferedCategory.id,
            label: refferedCategory.name,
          });
        } else {
          categoryArray.push({ value: item.category, label: item.category });
        }
      }
    });

    return categoryArray.sort((a, b) => {
      if (a.value === "Sem categoria") return 1;
      if (b.value === "Sem categoria") return -1;
      return a.value!.toString().localeCompare(b.value!.toString());
    });
  }, [items]);

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
        categoryOptions={normalizedCategories}
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
