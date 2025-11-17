import { atom } from "jotai";
import type { Category } from "@/app/type";
import { getCategories } from "@/services/categories";

export const categoriesAtom = atom<Category[]>([]);
export const isLoadingCategoriesAtom = atom(false);

export const fetchCategoriesAtom = atom(null, async (_get, set) => {
  set(isLoadingCategoriesAtom, true);

  try {
    const categories = await getCategories();
    set(categoriesAtom, categories);
  } catch (error) {
    console.error("Falha ao buscar categorias:", error);
  } finally {
    set(isLoadingCategoriesAtom, false);
  }
});
