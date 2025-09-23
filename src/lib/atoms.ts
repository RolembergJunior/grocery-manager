import { atom } from "jotai";
import type { Products, Item, ShoppingListType } from "@/app/type";
import { subscribeProducts } from "@/services/products";

export const productsAtom = atom<Products>([]);

export const isProductsEmptyAtom = atom((get) => {
  const products = get(productsAtom);
  return products.length === 0;
});

export const fetchProductsAtom = atom(null, async (_get, set) => {
  const abortController = new AbortController();

  try {
    const products = await subscribeProducts({
      signal: abortController.signal,
    });
    set(productsAtom, products);
  } catch (error) {
    console.error("Falha ao buscar produtos:", error);
  }

  return () => abortController.abort();
});

export const isLoadingProductsAtom = atom(false);

export const standaloneItemsAtom = atom<Item[]>([]);

export const selectedListTypeAtom = atom<ShoppingListType | null>(null);
