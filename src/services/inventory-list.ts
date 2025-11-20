"use server";

import { STATUSPRODUCT, type ListItem, type Product } from "@/app/type";
import { batchCreateItems, batchUpdateItems, getListItems } from "./list-items";

export async function syncInventoryListAPI(
  products: Product[],
  listId: string
): Promise<ListItem[]> {
  const listItems = await getListItems(listId, true);

  if (listId === "inventory-list") {
    const listItemsToCreate: Partial<Omit<ListItem, "id">>[] = [];
    const listItemsToUpdate: Partial<
      Omit<ListItem, "id" | "userId" | "createdAt">
    >[] = [];

    products.forEach((product) => {
      const existItem = listItems.find((i) => i.itemId === product.id);
      if (
        existItem &&
        product.statusCompra === STATUSPRODUCT.NEED_SHOPPING &&
        existItem.isRemoved
      ) {
        listItemsToUpdate.push({
          ...existItem,
          name: product.name,
          category: product.category,
          unit: product.unit,
          isRemoved: false,
          updatedAt: new Date().toISOString(),
        });
      } else if (
        existItem &&
        product.statusCompra !== STATUSPRODUCT.NEED_SHOPPING &&
        !existItem.isRemoved
      ) {
        listItemsToUpdate.push({
          ...existItem,
          name: product.name,
          category: product.category,
          unit: product.unit,
          isRemoved: true,
          updatedAt: new Date().toISOString(),
        });
      } else if (!existItem) {
        listItemsToCreate.push({
          name: product.name,
          itemId: product.id,
          listId: listId,
          fromList: "inventory",
          category: product.category,
          unit: product.unit,
          neededQuantity: product.neededQuantity || 0,
          boughtQuantity: 0,
          checked: false,
          isRemoved: product.statusCompra !== STATUSPRODUCT.NEED_SHOPPING,
          userId: product.userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    if (listItemsToUpdate.length) await batchUpdateItems(listItemsToUpdate);
    if (listItemsToCreate.length) await batchCreateItems(listItemsToCreate);
  }

  return await getListItems(listId);
}
