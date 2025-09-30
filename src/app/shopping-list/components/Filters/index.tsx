import { Search } from "lucide-react";
import { Item } from "@/app/type";
import { getCategories } from "@/app/utils";
import SelectComponent from "@/components/Select";
import ShoopingStatus from "./components/ShoopingStatus";
import { useAtom } from "jotai";
import { searchFilterAtom, categoryFilterAtom, statusFilterAtom } from "@/lib/atoms";

interface FilterProps {
  products: Item[];
}

export default function Filters({ products }: FilterProps) {
  const [searchTerm, setSearchTerm] = useAtom(searchFilterAtom);
  const [selectedCategory, setSelectedCategory] = useAtom(categoryFilterAtom);
  const [, setStatusFilter] = useAtom(statusFilterAtom);

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
              setSearchTerm(e.target.value);
            }}
          />
        </div>

        <div className="relative">
          <SelectComponent
            options={getCategories(products || [])}
            defaultValue={selectedCategory}
            showSelectAll
            onChange={(e: string[]) => setSelectedCategory(e[0])}
          />
        </div>
      </div>

      <ShoopingStatus onFilterChange={setStatusFilter} />
    </div>
  );
}
