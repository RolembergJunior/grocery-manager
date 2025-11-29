"use client";

import { useAtomValue } from "jotai";
import { palletColors } from "@/app/utils";
import { categoriesAtom } from "@/lib/atoms/categories";
import { useRouter } from "next/navigation";

export default function CategorySection() {
  const categories = useAtomValue(categoriesAtom);

  const router = useRouter();

  function redirectToInventoryPage(categoryId: string) {
    router.push(`inventory?filter=true&category=${categoryId}`);
  }

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Categorias
      </h3>
      <div className="relative mb-6">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-4 scroll-smooth">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => redirectToInventoryPage(category.id)}
              className={`${
                palletColors[category.colorId as keyof typeof palletColors]
                  .bgClass
              } rounded-3xl aspect-square flex items-center justify-center p-2 w-[6rem] h-[6rem] shadow-md hover:scale-105 transition-transform active:scale-95`}
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
    </>
  );
}
