import { atom } from "jotai";
import type { Product } from "@/app/type";
import { subscribeProducts } from "@/services/products";

export const productsAtom = atom<Product[]>([]);

export const isLoadingProductsAtom = atom(false);

export const isProductsEmptyAtom = atom((get) => {
  const products = get(productsAtom);
  return products.length === 0;
});

export const fetchProductsAtom = atom(null, async (_get, set) => {
  try {
    set(isLoadingProductsAtom, true);
    const products = await subscribeProducts();
    set(productsAtom, products);
  } catch (error) {
    console.error("Falha ao buscar produtos:", error);
  } finally {
    set(isLoadingProductsAtom, false);
  }
});
