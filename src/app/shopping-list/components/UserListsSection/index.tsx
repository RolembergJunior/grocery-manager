"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import ListCard from "../ListCard";
import AddItemModal from "../AddItemModal";
import { List } from "@/app/type";
import { useAtomValue } from "jotai";
import { listItemsAtom, listsAtom } from "@/lib/atoms";
import { toast } from "sonner";
import CreateListModal from "@/components/ListSection/components/CreateListModal";

interface ModalParams {
  isModalOpen: boolean;
  listToEdit: List | null;
}

export default function UserListsSection() {
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [paramsListModal, setParamsListModal] = useState<ModalParams>({
    isModalOpen: false,
    listToEdit: null,
  });

  const lists = useAtomValue(listsAtom);
  const listItems = useAtomValue(listItemsAtom);

  const listsWithItems = useMemo(() => {
    return lists.map((list) => ({
      list,
      items: listItems.filter(
        (item) => item.listId === list.id && !item.isRemoved
      ),
    }));
  }, [lists, listItems]);

  function handleAddItemToList(list: List) {
    setSelectedList(list);
    setIsAddItemModalOpen(true);
  }

  function handleCloseAddItemModal() {
    setIsAddItemModalOpen(false);
    setSelectedList(null);
  }

  function handleCloseCreateListModal() {
    setParamsListModal({
      isModalOpen: false,
      listToEdit: null,
    });
  }

  function handleOpenCreateListModal() {
    if (listsWithItems.length === 5) {
      return toast.error("Limite de listas atingido");
    }

    setParamsListModal({
      isModalOpen: true,
      listToEdit: null,
    });
  }

  if (listsWithItems.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[var(--color-list-card)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-[var(--color-blue)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text-dark)] mb-2">
            Nenhuma lista personalizada
          </h3>
          <p className="text-[var(--color-text-gray)] text-sm">
            Crie sua primeira lista na página inicial
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-[var(--color-text-gray)] text-sm font-medium">
          Minhas Listas Personalizadas
        </h2>
        <button
          onClick={handleOpenCreateListModal}
          className="px-3 py-1.5 bg-[var(--color-blue)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all duration-200 active:scale-95 shadow-sm"
          title="Criar nova lista"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {listsWithItems.map(({ list, items }) => (
          <ListCard
            key={list.id}
            list={list}
            items={items}
            onAddItem={() => handleAddItemToList(list)}
          />
        ))}
      </div>

      {selectedList && (
        <AddItemModal
          isOpen={isAddItemModalOpen}
          onClose={handleCloseAddItemModal}
          listId={selectedList.id}
        />
      )}

      <CreateListModal
        {...paramsListModal}
        onCloseModal={handleCloseCreateListModal}
      />
    </>
  );
}
