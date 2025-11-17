"use client";

import { Search } from "lucide-react";
import { ListItem } from "@/app/type";
import FilterButtonModal from "./FilterModal";
import { useAtom } from "jotai";
import { mainSearchAtom, mainFiltersAtom } from "@/lib/atoms";

type ControlsProps = {
  products: ListItem[];
};

export default function Controls({ products }: ControlsProps) {
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
          className="w-full pl-12 pr-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm focus:shadow-md text-gray-800 placeholder-gray-400 transition-all duration-200"
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

      {/* <AddItemButtonModal /> */}
    </div>
  );
}
