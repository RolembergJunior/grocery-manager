"use client";

import { Suspense, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { listsAtom, categoriesAtom } from "@/lib/atoms";
import NotebookList from "./components/NotebookList";
import ProgressList from "./components/ProgressList";
import RenderWhen from "@/components/RenderWhen";
import AlertDialog from "@/components/AlertDialog";
import { useList } from "@/hooks/use-list";
import { useCompleteList } from "@/hooks/use-complete-list";
import { INVENTORY_LIST_ID } from "@/lib/constants/lists";
import Controls from "./components/Controls";
import { ListItem } from "@/app/type";

export default function ShoppingListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listId = searchParams.get("id");
  const typeList = searchParams.get("type");

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

  const lists = useAtomValue(listsAtom);
  const categories = useAtomValue(categoriesAtom);

  const { items } = useList(listId!);
  const { confirmAndComplete, confirmDialog } = useCompleteList(listId ?? "");

  const listItems = items.filter((i) => !i.isRemoved);
  const listCheckedCount = listItems.filter((i) => i.checked).length;
  const listTotalCount = listItems.length;

  const currentList = useMemo(() => {
    if (listId === INVENTORY_LIST_ID) {
      return {
        id: "1",
        name: "Lista do Estoque",
        description: "Lista gerada automaticamente com base no estoque",
      };
    }
    if (typeList === "quick-list") {
      return {
        id: "2",
        name: "Lista Rápida",
        description: "Lista gerada automaticamente com base no estoque",
      };
    }

    return lists.find((list) => list.id === listId);
  }, [lists, listId, typeList]);

  const currentItems = useMemo(() => {
    if (!listId || typeList === "quick-list") return [];

    let filtered = items.filter((item) => !item.isRemoved);

    return filtered.filter((item) => {
      const matchesSearch = searchTerm
        ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const matchesSelectFilter = Object.entries(filters).length
        ? Object.entries(filters).every(([key, value]) =>
            value.length
              ? value.includes(item[key as keyof ListItem] as string)
              : true,
          )
        : true;

      return matchesSearch && matchesSelectFilter;
    });
  }, [items, listId, typeList, searchTerm, JSON.stringify(filters)]);

  const { checkedCount, totalCount, progressPercentage } = useMemo(() => {
    const checked = currentItems.filter((item) => item.checked).length;
    const total = currentItems.length;
    const percentage = total > 0 ? (checked / total) * 100 : 0;

    return {
      checkedCount: checked,
      totalCount: total,
      progressPercentage: Number(percentage.toFixed(2)),
    };
  }, [currentItems]);

  function handleBackToLists() {
    router.push("/shopping-list");
  }

  function handleFilterChange(filterKey: string, value: string[]) {
    setFilters({ ...filters, [filterKey]: value });
  }

  if (!currentList) {
    return (
      <div className="min-h-screen bg-[var(--color-page-bg)] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-text-dark)] mb-4">
              Lista não encontrada
            </h2>
            <p className="text-[var(--color-text-gray)] mb-6">
              A lista que você está procurando não existe ou foi removida.
            </p>
            <button
              onClick={handleBackToLists}
              className="px-6 py-3 bg-[var(--color-blue)] text-white rounded-lg hover:opacity-90 font-medium transition-all duration-200"
            >
              Voltar para listas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-cream py-8 px-4 pb-44">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToLists}
            className="flex items-center gap-2 text-[var(--color-text-gray)] hover:text-[var(--color-text-dark)] mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar para listas</span>
          </button>

          <h1 className="font-bold text-text-dark uppercase tracking-wide">
            {currentList.name}
          </h1>

          <Controls
            items={items}
            categories={categories}
            searchTerm={searchTerm}
            selectedCategories={filters?.category || []}
            selectedChecked={filters?.checked || []}
            selectedFromList={filters?.fromList || []}
            onChangeFilter={handleFilterChange}
            onChangeSearchTerm={setSearchTerm}
          />

          <ProgressList
            checkedCount={checkedCount}
            totalCount={totalCount}
            progressPercentage={progressPercentage}
          />

          <NotebookList categories={categories} items={currentItems} />

        </div>
      </div>

      <RenderWhen isTrue={listTotalCount > 0}>
        <div className="fixed bottom-[68px] md:bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() =>
                confirmAndComplete(() => router.push("/shopping-list"))
              }
              disabled={!listCheckedCount}
              className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all ${
                listCheckedCount
                  ? "bg-[var(--color-blue)] hover:opacity-90 shadow-sm"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>Finalizar Lista</span>
            </button>
          </div>
        </div>
      </RenderWhen>

      <AlertDialog {...confirmDialog} />
    </>
  );
}
