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
  const products = await subscribeProducts({ signal: abortController.signal });

  set(productsAtom, products);
});

export const standaloneItemsAtom = atom<Item[]>([]);

export const selectedListTypeAtom = atom<ShoppingListType | null>(null);
