"use client";

import React, { useMemo, useState } from "react";
import Filters from "./components/Filters";
import RenderWhen from "@/components/RenderWhen";
import MarkCompletedButton from "./components/MarkCompletedButton";
import List from "./components/List";
import ListTypeSelection from "./components/ListTypeSelection";
import CongratulationsModal from "./components/CongratulationsModal";
import ShoppingListHeader from "./components/ShoppingListHeader";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  productsAtom,
  standaloneItemsAtom,
  selectedListTypeAtom,
  fetchProductsAtom,
} from "@/lib/atoms";
import { ShoppingListType, Item } from "@/app/type";
import { toast } from "sonner";
import {
  matchesCategoryFilter,
  matchesSearchFilter,
  matchesStatusFilter,
} from "./utils";
import AddItemButton from "./components/AddItem";

export default function ShoppingListApp() {
  const [selectedListType, setSelectedListType] =
    useAtom<ShoppingListType | null>(selectedListTypeAtom);
  const [standaloneItems, setStandaloneItems] =
    useAtom<Item[]>(standaloneItemsAtom);
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCongratulationsModal, setShowCongratulationsModal] =
    useState(false);

  const [standaloneListName, setStandaloneListName] = useState("Lista Avulsa");

  const [products, setProducts] = useAtom(productsAtom);

  const fetchProducts = useSetAtom(fetchProductsAtom);

  const currentItems = useMemo(() => {
    if (selectedListType === "standalone") {
      return standaloneItems;
    } else if (selectedListType === "inventory-based") {
      return products.filter((item) => item.statusCompra === 1);
    }
    return [];
  }, [selectedListType, standaloneItems, products]);

  const filteredItems = useMemo(() => {
    return currentItems.filter((item) => {
      return (
        matchesSearchFilter(item, searchFilter) &&
        matchesCategoryFilter(item, categoryFilter) &&
        matchesStatusFilter(item, statusFilter)
      );
    });
  }, [currentItems, searchFilter, categoryFilter, statusFilter]);

  function handleCheckProduct(id: number) {
    if (selectedListType === "standalone") {
      const updatedItems = standaloneItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      });
      setStandaloneItems(updatedItems);
    } else if (selectedListType === "inventory-based") {
      const updatedProducts = products.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            completed: !product.completed,
          };
        }
        return product;
      });
      setProducts(updatedProducts);
    }
  }

  function updateBoughtQuantity(id: number, quantity: number) {
    if (selectedListType === "standalone") {
      const updatedItems = standaloneItems.map((item) =>
        item.id === id
          ? {
              ...item,
              boughtQuantity: quantity,
              completed: item.currentQuantity + quantity >= item.neededQuantity,
            }
          : item
      );
      setStandaloneItems(updatedItems);
    } else if (selectedListType === "inventory-based") {
      const updatedItems = products.map((item) =>
        item.id === id
          ? {
              ...item,
              boughtQuantity: quantity,
              completed: item.currentQuantity + quantity >= item.neededQuantity,
            }
          : item
      );
      setProducts(updatedItems);
    }
  }

  function removeItem(id: number) {
    if (selectedListType === "standalone") {
      const updatedItems = standaloneItems.filter((item) => item.id !== id);
      setStandaloneItems(updatedItems);
    } else if (selectedListType === "inventory-based") {
      const updatedItems = products.map((item) =>
        item.id === id ? { ...item, isRemoved: 1 } : item
      );

      setProducts(updatedItems);
    }
  }

  function handleAddItem(newItem: Omit<Item, "id">) {
    const id = Date.now();
    const itemWithId: Item = {
      ...newItem,
      id,
      completed: false,
      boughtQuantity: 0,
    };
    setStandaloneItems((prev) => [...prev, itemWithId]);
  }

  function handleBackToSelection() {
    setSelectedListType(null);
    setSearchFilter("");
    setCategoryFilter("");
    setShowCongratulationsModal(false);
    setStandaloneListName("Lista Avulsa");
  }

  function handleListCompleted() {
    if (selectedListType === "standalone") {
      setStandaloneItems([]);
      setStandaloneListName("Lista Avulsa");

      toast.success("Lista finalizada com sucesso!");
      setShowCongratulationsModal(true);

      return;
    }

    toast.promise(fetchProducts(), {
      loading: "Finalizando lista...",
      success: () => {
        setShowCongratulationsModal(true);
        return "Lista finalizada e inventário atualizado com sucesso!";
      },
      error: "Houve um erro ao finalizar a lista. Tente novamente mais tarde.",
    });
  }

  const completedCount = filteredItems.filter((item) => item.completed).length;
  const totalCount = filteredItems.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (!selectedListType) {
    return <ListTypeSelection onSelectListType={setSelectedListType} />;
  }

  const listTitle =
    selectedListType === "standalone"
      ? standaloneListName
      : "Lista Baseada no Estoque";

  return (
    <div className="min-h-full ">
      <ShoppingListHeader
        selectedListType={selectedListType}
        listTitle={listTitle}
        onBackToSelection={handleBackToSelection}
        onTitleChange={(newTitle) => setStandaloneListName(newTitle)}
      />

      <div className="p-4">
        <Filters
          searchTerm={searchFilter}
          selectedCategory={categoryFilter}
          onChangeSearch={setSearchFilter}
          onChangeCategory={(category) => setCategoryFilter(category as string)}
          onChangeStatus={setStatusFilter}
          products={currentItems}
        />

        <RenderWhen isTrue={selectedListType === "standalone"}>
          <AddItemButton onAddItem={handleAddItem} />
        </RenderWhen>

        <List
          products={filteredItems}
          handleCheckProduct={handleCheckProduct}
          updateBoughtQuantity={updateBoughtQuantity}
          removeItem={removeItem}
        />

        <RenderWhen
          isTrue={
            filteredItems.length > 0 &&
            totalCount > 0 &&
            !showCongratulationsModal
          }
        >
          <MarkCompletedButton
            progressPercentage={Number(progressPercentage.toFixed(2))}
            completedCount={completedCount}
            totalCount={totalCount}
            onListCompleted={handleListCompleted}
          />
        </RenderWhen>
      </div>

      <CongratulationsModal
        isOpen={showCongratulationsModal}
        onGoBack={handleBackToSelection}
      />
    </div>
  );
}
