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

interface ProductListProps {
  products: Products;
  searchTerm?: string;
  statusFilter?: string;
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
  statusFilter = "all",
}: ProductListProps) {
  const filteredProducts = useMemo(() => {
    const sorteredCategories = getSortedCategories(products);

    return sorteredCategories.reduce(
      (acc: FilteredCategoryProps[], category) => {
        const items = getItemsByCategory(products, category);
        const filteredItems = filterItems(items, searchTerm, statusFilter);
        const { totalItems, itemsToBuy } = getCategoryStats(filteredItems);

        if (filteredItems.length > 0) {
          acc.push({
            category,
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
  }, [products, searchTerm, statusFilter]);

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
