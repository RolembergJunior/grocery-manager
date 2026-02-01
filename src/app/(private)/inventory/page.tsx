"use client";

import RenderWhen from "@/components/RenderWhen";
import EmptyProducts from "@/app/(private)/inventory/components/EmptyProducts";
import Controls from "@/components/Controls";
import ProductList from "@/app/(private)/inventory/components/ProductList";
import { useAtomValue } from "jotai";
import { productsAtom } from "@/lib/atoms/products";
import { categoriesAtom } from "@/lib/atoms/categories";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/app/type";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

  const products = useAtomValue(productsAtom);
  const categories = useAtomValue(categoriesAtom);

  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const category = searchParams.get("category");

  useEffect(() => {
    if (filter && category) {
      setFilters({ ...filters, category: [category] });
    }
  }, [filter, category]);

  const filteredCategories = useMemo(() => {
    if (!filters.category || filters.category.length === 0) {
      return categories;
    }

    return categories.filter((category) => {
      return (filters.category || []).includes(category.id);
    });
  }, [filters, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = searchTerm
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesSelectFilter = Object.entries(filters).length
        ? Object.entries(filters).every(([key, value]) =>
            value.length
              ? value.includes(item[key as keyof Product] as string)
              : true,
          )
        : true;

      return matchesSearch && matchesSelectFilter;
    });
  }, [products, searchTerm, JSON.stringify(filters)]);

  return (
    <div className="min-h-[calc(100vh-70px)] md:min-h-screen p-2 pb-24">
      <Controls
        categories={categories}
        selectedCategories={filters?.category || []}
        selectedStatus={filters?.statusCompra || []}
        searchTerm={searchTerm}
        onChangeFilter={(filterKey: string, value: string[]) =>
          setFilters({ ...filters, [filterKey]: value })
        }
        onChangeSearchTerm={(value: string) => setSearchTerm(value)}
      />

      <RenderWhen isTrue={!!categories.length} elseElement={<EmptyProducts />}>
        <ProductList
          products={filteredProducts}
          categories={filteredCategories}
        />
      </RenderWhen>
    </div>
  );
}
