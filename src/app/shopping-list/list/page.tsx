"use client";

import { useState, useMemo, useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  listsAtom,
  listItemsAtom,
  fetchListsAtom,
  fetchListItemsAtom,
} from "@/lib/atoms";
import EditableHeader from "./components/EditableHeader";
import NotebookList from "./components/NotebookList";

export default function ShoppingListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listId = searchParams.get("id");

  const lists = useAtomValue(listsAtom);
  const listItems = useAtomValue(listItemsAtom);
  const fetchLists = useSetAtom(fetchListsAtom);
  const fetchListItems = useSetAtom(fetchListItemsAtom);

  useEffect(() => {
    fetchLists();
    if (listId) {
      fetchListItems(listId);
    }
  }, [fetchLists, fetchListItems, listId]);

  const currentList = useMemo(() => {
    return lists.find((list) => list.id === listId);
  }, [lists, listId]);

  const currentItems = useMemo(() => {
    if (!listId) return [];
    return listItems.filter((item) => item.listId === listId && !item.isRemoved);
  }, [listItems, listId]);

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

  function handleCompleteList() {
    if (checkedCount < totalCount) {
      toast.error("Marque todos os itens antes de finalizar a lista");
      return;
    }

    toast.success("Lista finalizada com sucesso!");
    router.push("/shopping-list");
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
    <div className="min-h-screen bg-[var(--color-page-bg)] py-8 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBackToLists}
          className="flex items-center gap-2 text-[var(--color-text-gray)] hover:text-[var(--color-text-dark)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar para listas</span>
        </button>

        <EditableHeader
          listId={currentList.id}
          initialName={currentList.name}
          initialDescription={currentList.description || ""}
        />

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-dark)]">
                Progresso da Lista
              </h3>
              <p className="text-sm text-[var(--color-text-gray)]">
                {checkedCount} de {totalCount} itens marcados
              </p>
            </div>
            <div className="text-3xl font-bold text-[var(--color-blue)]">
              {progressPercentage.toFixed(0)}%
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-[var(--color-blue)] h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <NotebookList items={currentItems} />

        {totalCount > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleCompleteList}
              disabled={checkedCount < totalCount}
              className="flex items-center gap-2 px-8 py-4 bg-[var(--color-blue)] text-white rounded-xl hover:opacity-90 font-semibold transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>Finalizar Lista</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
