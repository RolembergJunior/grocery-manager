"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import ListCard from "../ListCard";
import AddItemModal from "../AddItemModal";
import { List } from "@/app/type";
import { useAtomValue } from "jotai";
import { listItemsAtom, listsAtom } from "@/lib/atoms";

export default function UserListsSection() {
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

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
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[var(--color-text-gray)] text-sm font-semibold uppercase tracking-wide">
          MINHAS LISTAS PERSONALIZADAS
        </h2>
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
    </>
  );
}
