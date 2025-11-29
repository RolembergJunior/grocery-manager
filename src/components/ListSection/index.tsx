"use client";

import { useAtomValue } from "jotai";
import { listsAtom } from "@/lib/atoms";
import { useRouter } from "next/navigation";

export default function ListSection() {
  const lists = useAtomValue(listsAtom);

  const router = useRouter();

  function redirectToListPage(listId: string) {
    router.push(`shopping-list/list?id=${listId}`);
  }

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Listas
      </h3>
      <div className="relative mb-6">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-4 scroll-smooth">
          {lists.map((list, index) => (
            <div
              key={index}
              className="bg-[var(--color-list-card)] rounded-2xl p-4 flex flex-col justify-center items-center h-24 w-[140px] flex-shrink-0 shadow-sm hover:shadow-lg hover:bg-blue/5 transition-all duration-300 snap-start cursor-pointer active:scale-95 group"
              onClick={() => redirectToListPage(list.id)}
            >
              <p className="text-blue font-semibold text-center relative pb-1.5 group-hover:scale-105 transition-transform duration-300">
                {list.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue rounded-full group-hover:h-1 transition-all duration-300"></span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
