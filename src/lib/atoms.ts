import { atom } from "jotai";
import type {
  ShoppingListType,
  Category,
  List,
  ListItem,
  Product,
} from "@/app/type";
import { subscribeProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import { getLists } from "@/services/lists";
import { getListItems } from "@/services/list-items";

export const productsAtom = atom<Product[]>([]);

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

export const standaloneItemsAtom = atom<Product[]>([]);

export const selectedListTypeAtom = atom<ShoppingListType | null>(null);

export const toggleItemCompletedAtom = atom(null, (get, set, id: string) => {
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
  (get, set, { id, quantity }: { id: string; quantity: number }) => {
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

export const removeItemAtom = atom(null, (get, set, id: string) => {
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

// ============================================
// CATEGORIES ATOMS
// ============================================

export const categoriesAtom = atom<Category[]>([]);

export const fetchCategoriesAtom = atom(null, async (_get, set) => {
  const abortController = new AbortController();

  try {
    const categories = await getCategories();
    set(categoriesAtom, categories);
  } catch (error) {
    console.error("Falha ao buscar categorias:", error);
  }

  return () => abortController.abort();
});

export const isLoadingCategoriesAtom = atom(false);

// ============================================
// LISTS ATOMS
// ============================================

export const listsAtom = atom<List[]>([]);

export const fetchListsAtom = atom(null, async (_get, set) => {
  try {
    const lists = await getLists();
    set(listsAtom, lists);
  } catch (error) {
    console.error("Falha ao buscar listas:", error);
  }
});

export const isLoadingListsAtom = atom(false);

export const selectedListAtom = atom<List | null>(null);

// ============================================
// LIST_ITEMS ATOMS
// ============================================

export const listItemsAtom = atom<ListItem[]>([]);

export const fetchListItemsAtom = atom(
  null,
  async (_get, set, listId?: string) => {
    try {
      const listItems = await getListItems(listId);
      set(listItemsAtom, listItems);
    } catch (error) {
      console.error("Falha ao buscar itens da lista:", error);
    }
  }
);

export const isLoadingListItemsAtom = atom(false);

export const toggleListItemCheckedAtom = atom(null, (get, set, id: string) => {
  const listItems = get(listItemsAtom);
  const updatedItems = listItems.map((item) =>
    item.id === id ? { ...item, checked: !item.checked } : item
  );
  set(listItemsAtom, updatedItems);
});

export const removeListItemAtom = atom(null, (get, set, id: string) => {
  const listItems = get(listItemsAtom);
  const updatedItems = listItems.map((item) =>
    item.id === id ? { ...item, isRemoved: true } : item
  );
  set(listItemsAtom, updatedItems);
});
