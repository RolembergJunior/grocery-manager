"use client";

import { Item, Products } from "../../app/type";
import {
  getSortedCategories,
  getItemsByCategory,
  getCategoryStats,
  filterItems,
} from "./utils";
import RenderWhen from "../RenderWhen";
import { useMemo } from "react";
import CategoryCard from "./components/CategoryCard";
import { getCategoryName } from "@/app/utils";

interface ProductListProps {
  products: Products;
  searchTerm?: string;
  selectedFilter: { [key: string]: string[] };
}

interface FilteredCategoryProps {
  category: string;
  items: Item[];
  totalItems: number;
  itemsToBuy: number;
  hasItemsToBuy: boolean;
}

export default function ProductList({
  products,
  searchTerm = "",
  selectedFilter,
}: ProductListProps) {
  const filteredProducts = useMemo(() => {
    const sorteredCategories = getSortedCategories(products);

    return sorteredCategories.reduce(
      (acc: FilteredCategoryProps[], category) => {
        const items = getItemsByCategory(products, category);
        const filteredItems = filterItems(items, searchTerm, selectedFilter);
        const { totalItems, itemsToBuy } = getCategoryStats(filteredItems);

        if (filteredItems.length > 0) {
          acc.push({
            category: getCategoryName(category),
            items: filteredItems,
            totalItems,
            itemsToBuy,
            hasItemsToBuy: itemsToBuy > 0,
          });
        }

        return acc;
      },
      []
    );
  }, [products, searchTerm, selectedFilter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <RenderWhen isTrue={filteredProducts.length > 0}>
        {filteredProducts.map((category) => (
          <CategoryCard key={category.category} {...category} />
        ))}
      </RenderWhen>
    </div>
  );
}
