"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ListCard from "../ListCard";
import AddItemModal from "../AddItemModal";
import { List } from "@/app/type";
import { useAtomValue } from "jotai";
import { listsAtom } from "@/lib/atoms";
import CreateListModal from "@/components/ListSection/components/CreateListModal";

export default function UserListsSection() {
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);

  const lists = useAtomValue(listsAtom);

  function handleAddItemToList(list: List) {
    setSelectedList(list);
    setIsAddItemModalOpen(true);
  }

  function handleCloseAddItemModal() {
    setIsAddItemModalOpen(false);
    setSelectedList(null);
  }

  if (lists.length === 0) {
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
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[var(--color-text-gray)] text-sm font-semibold uppercase tracking-wide">
          MINHAS LISTAS PERSONALIZADAS
        </h2>

        <button
          onClick={() => setIsCreateListModalOpen(true)}
          className="p-2 bg-blue rounded-full hover:bg-blue/80 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
          title="Criar nova lista"
        >
          <Plus color="white" size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {lists.map((list) => (
          <ListCard
            key={list.id}
            list={list}
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
        isModalOpen={isCreateListModalOpen}
        listToEdit={null}
        onCloseModal={() => setIsCreateListModalOpen(false)}
      />
    </>
  );
}
