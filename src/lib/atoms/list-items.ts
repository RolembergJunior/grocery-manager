import { atomFamily } from "jotai/utils";
import { atom, type PrimitiveAtom } from "jotai";
import type { ListItem } from "@/app/type";
import { getListItems } from "@/services/list-items";
import { INVENTORY_LIST_ID } from "@/lib/constants/lists";
import { listsAtom } from "./lists";

export const listItemsByIdAtom = atomFamily(
  (listId: string): PrimitiveAtom<ListItem[]> => atom<ListItem[]>([])
);

export const listItemsAtom = atom<ListItem[]>([]);

export const isLoadingListItemsAtom = atom(false);

export const fetchListItemsAtom = atom(
  null,
  async (_get, set, listId?: string) => {
    set(isLoadingListItemsAtom, true);

    try {
      const listItems = await getListItems(listId);

      const listitemsMap: Record<string, ListItem[]> = {};

      listItems.forEach((listItem) => {
        if (listItem.listId in listitemsMap) {
          listitemsMap[listItem.listId].push(listItem);
        } else {
          listitemsMap[listItem.listId] = [listItem];
        }
      });

      set(listItemsAtom, listItems);

      Object.entries(listitemsMap).forEach(([listId, listItems]) => {
        set(listItemsByIdAtom(listId), listItems);
      });
    } catch (error) {
      console.error("Falha ao buscar itens da lista:", error);
    } finally {
      set(isLoadingListItemsAtom, false);
    }
  }
);

export const removeListItemsAtom = atom(null, (get, set, ids: string[]) => {
  if (ids.length === 0) return;
  const deleted = new Set(ids);

  const all = get(listItemsAtom);
  set(
    listItemsAtom,
    all.filter((item) => !deleted.has(item.id))
  );

  const listIds = new Set([
    INVENTORY_LIST_ID,
    ...get(listsAtom).map((list) => list.id),
    ...all.map((item) => item.listId),
  ]);
  listIds.forEach((listId) => {
    const items = get(listItemsByIdAtom(listId));
    if (items.some((item) => deleted.has(item.id))) {
      set(
        listItemsByIdAtom(listId),
        items.filter((item) => !deleted.has(item.id))
      );
    }
  });
});
