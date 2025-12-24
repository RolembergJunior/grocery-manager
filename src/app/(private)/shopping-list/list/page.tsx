"use client";

import { useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { listsAtom, categoriesAtom } from "@/lib/atoms";
import NotebookList from "./components/NotebookList";
import ProgressList from "./components/ProgressList";
import RenderWhen from "@/components/RenderWhen";
import AlertDialog from "@/components/AlertDialog";
import { useList } from "@/hooks/use-list";
import { completeList } from "@/services/list-manager";
import { INVENTORY_LIST_ID } from "../components/InventoryListCard";
import Controls from "./components/Controls";
import { ListItem } from "@/app/type";

export default function ShoppingListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listId = searchParams.get("id");
  const typeList = searchParams.get("type");

  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

  const lists = useAtomValue(listsAtom);
  const categories = useAtomValue(categoriesAtom);

  const { items } = useList(listId!);

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
              : true
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

  function handleCompleteList() {
    if (checkedCount < totalCount) {
      setIsOpenAlert(true);

      return;
    }

    onConfirm();
  }

  async function onConfirm() {
    toast.promise(completeList(listId!), {
      loading: "Finalizando a lista...",
      success: () => {
        router.push("/shopping-list");
        return "Lista finalizada com sucesso!";
      },
      error: "Erro ao tentar finalizar lista. Tente novamente mais tarde!",
    });
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
      <div className="min-h-screen bg-cream py-8 px-4 pb-20">
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
            items={currentItems}
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

          <RenderWhen isTrue={totalCount > 0}>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCompleteList}
                disabled={!checkedCount}
                className="flex items-center gap-2 px-8 py-4 bg-[var(--color-blue)] text-white rounded-xl hover:opacity-90 font-semibold transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>Finalizar Lista</span>
              </button>
            </div>
          </RenderWhen>
        </div>
      </div>

      <AlertDialog
        isOpen={isOpenAlert}
        onClose={() => setIsOpenAlert(false)}
        title={`Existe(m) ${totalCount - checkedCount} item(ns) não marcado(s)`}
        description="Deseja finalizar a lista mesmo assim?"
        variant="warning"
        actions={[
          {
            label: "SIM",
            onClick: onConfirm,
            autoClose: true,
            variant: "default",
          },
          {
            label: "NÃO",
            onClick: () => null,
            autoClose: true,
            variant: "danger",
          },
        ]}
      />
    </>
  );
}
