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

export const toggleItemCompletedAtom = atom(null, (get, set, id: number) => {
  const selectedListType = get(selectedListTypeAtom);
  const items =
    selectedListType === "standalone"
      ? get(standaloneItemsAtom)
      : get(productsAtom);

  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, completed: !item.completed } : item
  );

  if (selectedListType === "standalone") {
    set(standaloneItemsAtom, updatedItems);

    return;
  }

  set(productsAtom, updatedItems);
});

export const updateBoughtQuantityAtom = atom(
  null,
  (get, set, { id, quantity }: { id: number; quantity: number }) => {
    const selectedListType = get(selectedListTypeAtom);
    const items =
      selectedListType === "standalone"
        ? get(standaloneItemsAtom)
        : get(productsAtom);

    const updatedItems = items.map((item) =>
      item.id === id
        ? {
            ...item,
            boughtQuantity: quantity,
            completed: item.currentQuantity + quantity >= item.neededQuantity,
          }
        : item
    );

    if (selectedListType === "standalone") {
      set(standaloneItemsAtom, updatedItems);

      return;
    }

    set(productsAtom, updatedItems);
  }
);

export const removeItemAtom = atom(null, (get, set, id: number) => {
  const selectedListType = get(selectedListTypeAtom);
  const items =
    selectedListType === "standalone"
      ? get(standaloneItemsAtom)
      : get(productsAtom);

  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, isRemoved: 1 } : item
  );

  if (selectedListType === "standalone") {
    set(standaloneItemsAtom, updatedItems);

    return;
  }

  set(productsAtom, updatedItems);
});

export const searchFilterAtom = atom("");
export const categoryFilterAtom = atom("");
export const statusFilterAtom = atom("");

export const mainSearchAtom = atom("");
export const mainFiltersAtom = atom<{ [key: string]: string[] }>({});
