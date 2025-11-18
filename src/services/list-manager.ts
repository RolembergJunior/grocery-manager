import {
  getListItems,
  createListItem,
  updateListItem,
  batchUpdateItems,
  deleteListItem,
} from "@/services/list-items";
import {
  syncInventoryListAPI,
  updateInventoryFromListAPI,
} from "@/services/inventory-list";
import { listItemsByIdAtom, productsAtom } from "@/lib/atoms";
import type { Product, ListItem } from "@/app/type";
import { getDefaultStore } from "jotai";

const store = getDefaultStore();

export async function loadList(listId: string): Promise<void> {
  const items = await getListItems(listId);
  const atom = listItemsByIdAtom(listId);

  store.set(atom, items);
}

export async function addItemFromInventory(
  listId: string,
  product: Product
): Promise<void> {
  const item = await createListItem({
    listId,
    name: product.name,
    category: product.category,
    unit: product.unit,
    neededQuantity: 0,
    boughtQuantity: 0,
    itemId: product.id,
    checked: false,
    isRemoved: false,
    fromList: "inventory",
  });

  if ("error" in item) {
    throw new Error(item.error);
  }

  const atom = listItemsByIdAtom(listId);
  store.set(atom, (prev: ListItem[]) => [...prev, item]);
}

export async function addItemManual(
  listId: string,
  data: Partial<ListItem>
): Promise<void> {
  const item = await createListItem({
    listId,
    name: data.name || "",
    category: data.category || "",
    unit: data.unit || "",
    neededQuantity: data.neededQuantity || 0,
    boughtQuantity: data.boughtQuantity || 0,
    observation: data.observation || null,
    itemId: null,
    checked: false,
    isRemoved: false,
    fromList: "created",
  });

  if ("error" in item) {
    throw new Error(item.error);
  }

  const atom = listItemsByIdAtom(listId);
  store.set(atom, (prev: ListItem[]) => [...prev, item]);
}

export async function updateItem(
  listId: string,
  id: string,
  data: Partial<ListItem>
): Promise<void> {
  const updated = await updateListItem(id, data);

  const atom = listItemsByIdAtom(listId);
  store.set(atom, (prev: ListItem[]) =>
    prev.map((item: ListItem) => (item.id === id ? updated : item))
  );
}

export async function deleteItem(listId: string, id: string): Promise<void> {
  await deleteListItem(id);

  const atom = listItemsByIdAtom(listId);
  store.set(atom, (prev: ListItem[]) =>
    prev.filter((item: ListItem) => item.id !== id)
  );
}

export async function syncWithInventory(
  listId: string,
  products: Product[]
): Promise<void> {
  const items = await syncInventoryListAPI(products, listId);
  const atom = listItemsByIdAtom(listId);
  store.set(atom, items);
}

export async function completeList(listId: string): Promise<void> {
  const atom = listItemsByIdAtom(listId);
  const items = store.get(atom) as ListItem[];
  const reset = items.map((i: ListItem) => ({
    ...i,
    checked: false,
    updatedAt: new Date().toISOString(),
  }));

  await batchUpdateItems(reset);
  store.set(atom, reset);

  await updateInventoryFromListAPI(items);

  const products = store.get(productsAtom);
  const updatedProducts = products.map((p: Product) => {
    const li = items.find((i: ListItem) => i.itemId === p.id && i.checked);
    if (!li) return p;

    return {
      ...p,
      statusCompra: 2,
    };
  });

  store.set(productsAtom, updatedProducts);
}
