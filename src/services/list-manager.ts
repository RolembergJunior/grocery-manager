import {
  createListItem,
  updateListItem,
  batchUpdateItems,
  deleteListItem,
  getListItems,
} from "@/services/list-items";
import { syncInventoryListAPI } from "@/services/inventory-list";
import { listItemsByIdAtom, productsAtom } from "@/lib/atoms";
import type { Product, ListItem } from "@/app/type";
import { getDefaultStore } from "jotai";
import { updateMany } from "./products";

const store = getDefaultStore();

export async function loadList(listId: string): Promise<void> {
  const updatedItems = await getListItems(listId);

  const atom = listItemsByIdAtom(listId);
  store.set(atom, updatedItems);
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
  const reset = items.map((i: ListItem) => {
    if (i.checked) {
      return {
        ...i,
        checked: false,
        isRemoved: !!i.itemId && !!i.checked,
        updatedAt: new Date().toISOString(),
      };
    }

    return i;
  });

  await batchUpdateItems(reset);
  store.set(atom, reset);

  const products = store.get(productsAtom);
  const updatedProductsListToSetAtom = products.map((p: Product) => {
    const isProductChecked = items.some(
      (i: ListItem) => i.itemId === p.id && i.checked
    );
    if (!isProductChecked) return p;

    return {
      ...p,
      statusCompra: 3,
      updatedAt: new Date().toISOString(),
    };
  });

  const updateProductsToSave = items
    .filter((p: ListItem) => p.checked && p.itemId)
    .map((p: ListItem) => {
      return {
        id: p.itemId,
        statusCompra: 3,
        updatedAt: new Date().toISOString(),
      };
    });

  await updateMany(updateProductsToSave);

  store.set(productsAtom, updatedProductsListToSetAtom);
}
