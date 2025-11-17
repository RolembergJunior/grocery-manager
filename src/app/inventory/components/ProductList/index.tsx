"use client";

import { Category, Product } from "../../../type";
import { getItemsByCategory, getCategoryStats, filterItems } from "./utils";
import RenderWhen from "../../../../components/RenderWhen";
import { useMemo } from "react";
import CategoryCard from "./components/CategoryCard";
import { useAtomValue } from "jotai";
import { mainSearchAtom, mainFiltersAtom } from "@/lib/atoms";

interface ProductListProps {
  products: Product[];
  categories: Category[];
}

interface FilteredCategoryProps {
  category: Category;
  items: Product[];
  totalItems: number;
}

export default function ProductList({
  products,
  categories,
}: ProductListProps) {
  const searchTerm = useAtomValue(mainSearchAtom);
  const selectedFilter = useAtomValue(mainFiltersAtom);

  const filteredProductsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      const itemsByCategory = getItemsByCategory(products, category.id);
      const filteredItems = filterItems(
        itemsByCategory,
        searchTerm,
        selectedFilter
      );

      const { totalItems } = getCategoryStats(filteredItems);

      acc.push({
        category,
        items: filteredItems,
        totalItems,
      });

      return acc;
    }, [] as FilteredCategoryProps[]);
  }, [products, searchTerm, selectedFilter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 h-full overflow-y-auto">
      <RenderWhen isTrue={filteredProductsByCategory.length > 0}>
        {filteredProductsByCategory.map(({ category, items, totalItems }) => (
          <CategoryCard
            key={category.id}
            category={category}
            items={items}
            totalItems={totalItems}
          />
        ))}
      </RenderWhen>
    </div>
  );
}
