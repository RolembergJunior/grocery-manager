"use client";

import { getItemsByCategory, getCategoryStats } from "./utils";
import { useMemo } from "react";
import CategoryCard from "./components/CategoryCard";
import { Product, Category } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";

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
  const filteredProductsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      const itemsByCategory = getItemsByCategory(products, category.id);

      const { totalItems } = getCategoryStats(itemsByCategory);

      acc.push({
        category,
        items: itemsByCategory.sort((a, b) => a.name.localeCompare(b.name)),
        totalItems,
      });

      return acc;
    }, [] as FilteredCategoryProps[]);
  }, [products.length, categories.length]);

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
