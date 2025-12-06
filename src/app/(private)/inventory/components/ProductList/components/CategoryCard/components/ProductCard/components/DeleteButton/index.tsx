"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAtomValue, useSetAtom, useStore } from "jotai";
import { toast } from "sonner";
import Modal from "@/components/Modal";
import { listItemsAtom, listItemsByIdAtom, productsAtom } from "@/lib/atoms";
import { deleteItem } from "@/services/products";
import { ListItem } from "@/app/type";

interface DeleteButtonProps {
  itemId: string;
}

export default function DeleteButton({ itemId }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const setProducts = useSetAtom(productsAtom);
  const listItems = useAtomValue(listItemsAtom);

  const store = useStore();

  function updateListItems() {
    const separatedArrayByListId = listItems.reduce((acc, item) => {
      if (item.itemId !== itemId) {
        if (!acc[item.listId]) {
          acc[item.listId] = [];
        }
        acc[item.listId].push(item);
      }
      return acc;
    }, {} as Record<string, ListItem[]>);

    Object.entries(separatedArrayByListId).forEach(([listId, items]) => {
      store.set(listItemsByIdAtom(listId), items);
    });
  }

  async function handleConfirmDelete() {
    setIsDeleting(true);

    toast.promise(deleteItem(itemId.toString()), {
      loading: "Excluindo...",
      success: () => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== itemId)
        );

        updateListItems();
        return "Item excluído com sucesso!";
      },
      error: (error) => {
        console.error("Houve um erro ao tentar realizar a requisição", error);
        return "Erro ao excluir o item. Tente novamente.";
      },
    });

    setIsOpen(false);
    setIsDeleting(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 p-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        title="Excluir item"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Deseja excluir o item?"
        className="overflow-visible"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Ao realizar essa ação o item será excluído do seu inventário.
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setIsOpen(false)}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeleting ? "Excluindo..." : "Confirmar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
