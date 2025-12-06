import { atomFamily } from "jotai/utils";
import { atom, type PrimitiveAtom } from "jotai";
import type { ListItem } from "@/app/type";
import { getListItems } from "@/services/list-items";

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
