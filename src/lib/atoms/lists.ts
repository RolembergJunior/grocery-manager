import { atom } from "jotai";
import type { List } from "@/app/type";
import { getLists } from "@/services/lists";
import { INVENTORY_LIST_ID } from "@/lib/constants/lists";

export const listsAtom = atom<List[]>([]);

export const selectedListAtom = atom<List | null>(null);

export const isLoadingListsAtom = atom(false);

export const fetchListsAtom = atom(null, async (_get, set) => {
  set(isLoadingListsAtom, true);
  try {
    const lists = await getLists();

    const normalizedList: List[] = [
      ...lists,
      {
        id: INVENTORY_LIST_ID,
        name: "Estoque",
        userId: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: "Lista automática de itens em estoque",
        resetAt: "",
        isRemoved: false,
        itemId: [],
      },
    ];
    set(listsAtom, normalizedList);
  } catch (error) {
    console.error("Falha ao buscar listas:", error);
  } finally {
    set(isLoadingListsAtom, false);
  }
});
