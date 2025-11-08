"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { categoriesAtom } from "@/lib/atoms";
import { palletColors } from "@/app/utils";
import CreateCategoryModal from "./components/CreateCategoryModal";
import { Category } from "@/app/type";

interface ModalParams {
  isModalOpen: boolean;
  categoryToEdit: Category | null;
}

export default function CategorySection() {
  const [paramsModal, setParamsModal] = useState<ModalParams>({
    isModalOpen: false,
    categoryToEdit: null,
  });

  const categories = useAtomValue(categoriesAtom);

  function handleCloseModal() {
    setParamsModal({
      isModalOpen: false,
      categoryToEdit: null,
    });
  }

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Categorias
      </h3>
      <div className="relative mb-6">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-4 scroll-smooth">
          <button
            onClick={() =>
              setParamsModal({ ...paramsModal, isModalOpen: true })
            }
            className="border-2 border-dashed border-blue text-blue/40 rounded-3xl p-2 w-[7rem] aspect-square flex items-center justify-center shadow-sm hover:shadow-md hover:border-bluetext-blue/60 hover:bg-bluetext-blue/5 transition-all active:scale-95 group"
          >
            <span className="text-blue text-lg font-medium text-center group-hover:scale-105 transition-transform">
              + Criar categoria
            </span>
          </button>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`${
                palletColors[category.colorId as keyof typeof palletColors]
                  .bgClass
              } rounded-3xl aspect-square flex items-center justify-center p-2 w-[6rem] h-[6rem] shadow-md hover:scale-105 transition-transform active:scale-95`}
              onClick={() =>
                setParamsModal({
                  ...paramsModal,
                  isModalOpen: true,
                  categoryToEdit: category,
                })
              }
            >
              <span
                className={`${
                  palletColors[category.colorId as keyof typeof palletColors]
                    .textClass
                } text-lg font-medium text-center`}
              >
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <CreateCategoryModal {...paramsModal} onCloseModal={handleCloseModal} />
    </>
  );
}
