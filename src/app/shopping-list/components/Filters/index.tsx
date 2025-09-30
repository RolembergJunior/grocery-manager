import { Search } from "lucide-react";
import { Item } from "@/app/type";
import { getCategories } from "@/app/utils";
import SelectComponent from "@/components/Select";
import ShoopingStatus from "./components/ShoopingStatus";

interface FilterProps {
  searchTerm: string;
  selectedCategory: string;
  onChangeSearch: (searchTerm: string) => void;
  onChangeCategory: (category: string | number | null) => void;
  onChangeStatus: (status: string) => void;
  products: Item[];
}

export default function Filters({
  searchTerm,
  selectedCategory,
  onChangeSearch,
  onChangeCategory,
  onChangeStatus,
  products,
}: FilterProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Procurar itens..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              onChangeSearch(e.target.value);
            }}
          />
        </div>

        <div className="relative">
          <SelectComponent
            options={getCategories(products || [])}
            defaultValue={selectedCategory}
            showSelectAll
            onChange={(e: string[]) => onChangeCategory(e[0])}
          />
        </div>
      </div>

      <ShoopingStatus onFilterChange={onChangeStatus} />
    </div>
  );
}
