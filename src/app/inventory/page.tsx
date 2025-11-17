"use client";

import RenderWhen from "@/components/RenderWhen";
import EmptyProducts from "@/app/inventory/components/EmptyProducts";
import Controls from "@/components/Controls";
import ProductList from "@/app/inventory/components/ProductList";
import { useAtomValue } from "jotai";
import { productsAtom } from "@/lib/atoms/products";
import { categoriesAtom } from "@/lib/atoms/categories";

export default function Inventory() {
  const products = useAtomValue(productsAtom);
  const categories = useAtomValue(categoriesAtom);

  return (
    <div className="min-h-[calc(100vh-70px)] md:min-h-screen p-2 pb-24">
      <Controls products={products} />

      <RenderWhen isTrue={!!categories.length} elseElement={<EmptyProducts />}>
        <ProductList products={products} categories={categories} />
      </RenderWhen>
    </div>
  );
}
