import { Item } from "@/app/type";
import {
  getItemStatus,
  getStatusText,
  formatCategoryTitle,
  formatItemCountText,
} from "./utils";
import ProductCard from "./components/ProductCard";

interface CategoryCardProps {
  category: string;
  items: Item[];
  totalItems: number;
  itemsToBuy: number;
}

export default function CategoryCard({
  category,
  items,
  totalItems,
  itemsToBuy,
}: CategoryCardProps) {
  return (
    <div
      key={category}
      className="bg-white rounded-2xl shadow-lg hover:transform hover:-translate-y-2 transition-all"
    >
      <div className="bg-gradient-to-r from-teal-200 to-pink-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 capitalize mb-1">
          {formatCategoryTitle(category)}
        </h3>
        <p className="text-gray-600 text-sm">
          {formatItemCountText(totalItems, itemsToBuy)}
        </p>
      </div>
      <>
        {items?.map((item: Item) => (
          <ProductCard
            key={item.id}
            item={item}
            status={getItemStatus(item)}
            statusText={getStatusText(getItemStatus(item))}
          />
        ))}
      </>
    </div>
  );
}
