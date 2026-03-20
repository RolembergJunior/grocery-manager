"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { listsAtom } from "@/lib/atoms";
import { useRouter } from "next/navigation";
import { Share2 } from "lucide-react";
import { List } from "@/app/type";
import ShareListModal from "./components/ShareListModal";
import RenderWhen from "../RenderWhen";
import { INVENTORY_LIST_ID } from "@/lib/constants/lists";

export default function ListSection() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);

  const lists = useAtomValue(listsAtom);

  const router = useRouter();

  function redirectToListPage(listId: string) {
    router.push(`shopping-list/list?id=${listId}`);
  }

  function handleShareClick(e: React.MouseEvent, list: List) {
    e.stopPropagation();
    setSelectedList(list);
    setShareModalOpen(true);
  }

  function handleCloseShareModal() {
    setShareModalOpen(false);
    setSelectedList(null);
  }

  const sortedList = lists.sort((a, b) => {
    if (a.id === INVENTORY_LIST_ID) return -1;
    if (b.id === INVENTORY_LIST_ID) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      <h3 className="text-[var(--color-text-gray)] text-lg font-medium mb-3">
        Minhas Listas
      </h3>
      <div className="relative mb-6">
        <RenderWhen
          isTrue={!!lists.length}
          elseElement={
            <div className="flex items-center justify-center py-8 px-4">
              <p className="text-[var(--color-text-gray)]/60 text-sm text-center">
                Nenhuma lista criada. Crie listas de compras para organizar suas
                necessidades.
              </p>
            </div>
          }
        >
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 px-4 scroll-smooth">
            {/* <div className="relative rounded-2xl flex flex-col h-28 w-[150px] flex-shrink-0 shadow-sm hover:shadow-lg transition-all duration-300 snap-start overflow-hidden group bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
              <div
                className="flex-1 flex flex-col justify-center items-center p-4 cursor-pointer hover:bg-category-orange/10 active:scale-95 transition-all"
                onClick={() => redirectToListPage(INVENTORY_LIST_ID)}
              >
                <p className="text-slate-800 font-semibold text-center relative pb-1.5 group-hover:scale-105 group-hover:text-category-orange/60 transition-all duration-300 line-clamp-2">
                  Estoque
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-category-orange/40 rounded-full group-hover:h-1 transition-all duration-300"></span>
                </p>
              </div>

              <button
                onClick={(e) => handleShareClick(e, estoqueList)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium transition-all duration-200 cursor-pointer bg-category-orange hover:bg-category-orange/80 text-white`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartilhar</span>
              </button>
            </div> */}

            {sortedList.map((list, index) => (
              <div
                key={index}
                className={`relative rounded-2xl flex flex-col h-28 w-[150px] flex-shrink-0 shadow-sm hover:shadow-lg transition-all duration-300 snap-start overflow-hidden group ${
                  list.id === INVENTORY_LIST_ID
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100"
                    : "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                }`}
              >
                <div
                  className={`flex-1 flex flex-col justify-center items-center p-4 cursor-pointer active:scale-95 transition-all ${
                    list.id === INVENTORY_LIST_ID
                      ? "hover:bg-category-orange/10"
                      : "hover:bg-blue/20"
                  }`}
                  onClick={() => redirectToListPage(list.id)}
                >
                  <p
                    className={`text-slate-800 font-semibold text-center relative pb-1.5 group-hover:scale-105 transition-all duration-300 line-clamp-2 ${
                      list.id === INVENTORY_LIST_ID
                        ? "group-hover:text-category-orange/60"
                        : "group-hover:text-blue-600"
                    }`}
                  >
                    {list.name}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full group-hover:h-1 transition-all duration-300 ${
                        list.id === INVENTORY_LIST_ID
                          ? "bg-category-orange/40"
                          : "bg-blue/40"
                      }`}
                    ></span>
                  </p>
                </div>

                <button
                  onClick={(e) => handleShareClick(e, list)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium transition-all duration-200 cursor-pointer text-white ${
                    list.id === INVENTORY_LIST_ID
                      ? "bg-category-orange hover:bg-category-orange/80"
                      : "bg-blue hover:bg-blue/60"
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartilhar</span>
                </button>
              </div>
            ))}
          </div>
        </RenderWhen>
      </div>

      <ShareListModal
        isOpen={shareModalOpen}
        onClose={handleCloseShareModal}
        list={selectedList}
      />
    </>
  );
}
