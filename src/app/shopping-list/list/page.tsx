"use client";

import { useState, useMemo } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Product } from "@/app/type";
import {
  productsAtom,
  fetchProductsAtom,
  searchFilterAtom,
  categoryFilterAtom,
  statusFilterAtom,
} from "@/lib/atoms";
import {
  matchesCategoryFilter,
  matchesSearchFilter,
  matchesStatusFilter,
} from "./utils";
import EditableHeader from "./components/EditableHeader";
import NotebookList from "./components/NotebookList";

export default function ShoppingListPage() {
  // State
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);
  const [standaloneListName, setStandaloneListName] = useState("Nova lista");

  // URL params
  const searchParams = useSearchParams();
  const selectedListType = searchParams.get("type");

  // Atoms
  const [products, setProducts] = useAtom(productsAtom);
  const [searchFilter, setSearchFilter] = useAtom(searchFilterAtom);
  const [categoryFilter, setCategoryFilter] = useAtom(categoryFilterAtom);
  const [statusFilter] = useAtom(statusFilterAtom);
  const fetchProducts = useSetAtom(fetchProductsAtom);

  const currentItems = useMemo(() => {
    if (selectedListType !== "inventory-based") return [];

    const now = Date.now();
    const msPerDay = 24 * 60 * 60 * 1000;

    return products.filter((item) => {
      const updatedAtDate = new Date(item.updatedAt).getTime();
      const daysSinceUpdate = (now - updatedAtDate) / msPerDay;
      return (
        item.statusCompra === 1 || daysSinceUpdate >= (item.reccurency || 0)
      );
    });
  }, [products, selectedListType]);

  const filteredItems = useMemo(() => {
    return currentItems.filter(
      (item) =>
        matchesSearchFilter(item, searchFilter) &&
        matchesCategoryFilter(item, categoryFilter) &&
        matchesStatusFilter(item, statusFilter)
    );
  }, [currentItems, searchFilter, categoryFilter, statusFilter]);

  const { completedCount, totalCount, progressPercentage } = useMemo(() => {
    const completed = filteredItems.filter(
      (item) => item.statusCompra || item.isRemoved
    ).length;
    const total = filteredItems.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    return {
      completedCount: completed,
      totalCount: total,
      progressPercentage: Number(percentage.toFixed(2)),
    };
  }, [filteredItems]);

  function handleAddItem(newItem: Omit<Product, "id">) {
    const itemWithId: Product = {
      ...newItem,
      id: Date.now(),
      completed: false,
      boughtQuantity: 0,
    };
    setProducts((prev) => [...prev, itemWithId]);
  }

  function handleBackToSelection() {
    setSearchFilter("");
    setCategoryFilter("");
    setShowCongratulationsModal(false);
    setStandaloneListName("Nova lista");
  }

  function handleListCompleted() {
    toast.promise(fetchProducts(), {
      loading: "Finalizando lista...",
      success: () => {
        setShowCongratulationsModal(true);
        return "Lista finalizada e inventário atualizado com sucesso!";
      },
      error: "Houve um erro ao finalizar a lista. Tente novamente mais tarde.",
    });
  }

  const listTitle =
    selectedListType === "inventory-based"
      ? "Lista de itens em estoque"
      : standaloneListName;

  const shouldShowCompleteButton =
    filteredItems.length > 0 && totalCount > 0 && !showCongratulationsModal;

  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] py-8 px-4">
      <EditableHeader
        listId={""}
        initialName={listTitle}
        initialDescription={""}
      />

      {/* <Controls products={listItems} /> */}

      <NotebookList items={filteredItems} />
    </div>
  );
}
