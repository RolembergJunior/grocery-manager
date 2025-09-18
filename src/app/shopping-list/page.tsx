"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeft, Edit2, Check, X } from "lucide-react";
import Filters from "./components/Filters";
import AddItem from "./components/AddItem";
import RenderWhen from "@/components/RenderWhen";
import MarkCompletedButton from "./components/MarkCompletedButton";
import List from "./components/List";
import ListTypeSelection from "./components/ListTypeSelection";
import CongratulationsModal from "./components/CongratulationsModal";
import { useAtom, useSetAtom } from "jotai";
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

  // Add state for standalone list name
  const [standaloneListName, setStandaloneListName] = useState("Lista Avulsa");
  const [isEditingListName, setIsEditingListName] = useState(false);
  const [tempListName, setTempListName] = useState("");

  const [products, setProducts] = useAtom(productsAtom);

  const fetchProducts = useSetAtom(fetchProductsAtom);

  const currentItems = useMemo(() => {
    if (selectedListType === "standalone") {
      return standaloneItems;
    } else if (selectedListType === "inventory-based") {
      return products.filter(
        (item) => item.currentQuantity < item.neededQuantity
      );
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
    setIsEditingListName(false);
  }

  function handleListCompleted() {
    if (selectedListType === "standalone") {
      setStandaloneItems([]);
      setStandaloneListName("Lista Avulsa");
      setIsEditingListName(false);

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

  function handleStartEditingListName() {
    setTempListName(standaloneListName);
    setIsEditingListName(true);
  }

  function handleSaveListName() {
    if (tempListName.trim()) {
      setStandaloneListName(tempListName.trim());
    }
    setIsEditingListName(false);
  }

  function handleCancelEditingListName() {
    setTempListName("");
    setIsEditingListName(false);
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
      <div className="w-full px-4 pt-7">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToSelection}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <RenderWhen
            isTrue={selectedListType === "standalone"}
            elseElement={
              <h1 className="text-xl font-semibold text-gray-900 w-full">
                {listTitle}
              </h1>
            }
          >
            <div className="flex items-center gap-2 flex-1">
              <RenderWhen
                isTrue={isEditingListName}
                elseElement={
                  <div className="flex items-center gap-2 flex-1 group">
                    <h1 className="text-xl font-semibold text-gray-900 flex-1 min-w-0">
                      {listTitle}
                    </h1>
                    <button
                      onClick={handleStartEditingListName}
                      className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded transition-all"
                      title="Editar nome da lista"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                }
              >
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={tempListName}
                    onChange={(e) => setTempListName(e.target.value)}
                    className="text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none flex-1 min-w-0"
                    placeholder="Nome da lista"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveListName}
                    className="p-1 hover:bg-green-100 rounded transition-colors"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    onClick={handleCancelEditingListName}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </RenderWhen>
            </div>
          </RenderWhen>
        </div>
      </div>

      <div className="p-4">
        <Filters
          searchTerm={searchFilter}
          selectedCategory={categoryFilter}
          onChangeSearch={setSearchFilter}
          onChangeCategory={setCategoryFilter}
          onChangeStatus={setStatusFilter}
          products={currentItems}
        />

        <RenderWhen isTrue={selectedListType === "standalone"}>
          <AddItem onAddItem={handleAddItem} />
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
