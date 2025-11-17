import { atom } from "jotai";
import type { List } from "@/app/type";
import { getLists } from "@/services/lists";

export const listsAtom = atom<List[]>([]);

export const selectedListAtom = atom<List | null>(null);

export const isLoadingListsAtom = atom(false);

export const fetchListsAtom = atom(null, async (_get, set) => {
  set(isLoadingListsAtom, true);
  try {
    const lists = await getLists();

    set(listsAtom, lists);
    set(isLoadingListsAtom, false);
  } catch (error) {
    console.error("Falha ao buscar listas:", error);
    set(isLoadingListsAtom, false);
  } finally {
    set(isLoadingListsAtom, false);
  }
});
