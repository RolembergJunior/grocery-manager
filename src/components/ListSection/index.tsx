"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { listsAtom } from "@/lib/atoms";
import { List } from "@/app/type";
import CreateListModal from "./components/CreateListModal";
import Link from "next/link";
import { toast } from "sonner";

interface ModalParams {
  isModalOpen: boolean;
  listToEdit: List | null;
}

export default function ListSection() {
  const [paramsModal, setParamsModal] = useState<ModalParams>({
    isModalOpen: false,
    listToEdit: null,
  });

  const lists = useAtomValue(listsAtom);

  function handleCloseCreateListModal() {
    setParamsModal({
      isModalOpen: false,
      listToEdit: null,
    });
  }

  function handleOpenCreateListModal() {
    if (lists.length === 5) {
      return toast.error("Limite de listas atingido");
    }

    setParamsModal({
      isModalOpen: true,
      listToEdit: null,
    });
  }

  function handleOpenEditListModal(list: List) {
    setParamsModal({
      isModalOpen: true,
      listToEdit: list,
    });
  }

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Listas
      </h3>
      <div className="relative mb-6">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-4 scroll-smooth">
          <button
            onClick={handleOpenCreateListModal}
            className="border-2 border-dashed border-blue text-blue/40 rounded-2xl p-4 w-[140px] h-24 flex items-center justify-center shadow-sm hover:shadow-md hover:border-blue hover:text-blue/60 hover:bg-blue/5 transition-all active:scale-95 group flex-shrink-0 snap-start"
          >
            <span className="text-blue text-base font-medium text-center group-hover:scale-105 transition-transform">
              + Nova lista
            </span>
          </button>

          {lists.map((list, index) => (
            <div
              key={index}
              className="bg-[var(--color-list-card)] rounded-2xl p-4 flex flex-col justify-center items-center h-24 w-[140px] flex-shrink-0 shadow-sm hover:shadow-lg hover:bg-blue/5 transition-all duration-300 snap-start cursor-pointer active:scale-95 group"
              onClick={() => handleOpenEditListModal(list)}
            >
              <p className="text-blue font-semibold text-center relative pb-1.5 group-hover:scale-105 transition-transform duration-300">
                {list.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue rounded-full group-hover:h-1 transition-all duration-300"></span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <CreateListModal
        {...paramsModal}
        onCloseModal={handleCloseCreateListModal}
      />
    </>
  );
}
