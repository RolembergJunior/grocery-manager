"use client";

import { List, ListItem } from "@/app/type";
import { useState } from "react";
import { ChevronDown, Plus, ShoppingCart } from "lucide-react";
import ListItemCard from "../ListItemCard";
import RenderWhen from "@/components/RenderWhen";
import { useRouter } from "next/navigation";

interface ListCardProps {
  list: List;
  items: ListItem[];
  onAddItem?: () => void;
}

export default function ListCard({ list, items, onAddItem }: ListCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const checkedCount = items.filter((item) => item.checked).length;
  const totalCount = items.length;

  function handleNavigateToList() {
    router.push(`/shopping-list/list?id=${list.id}`);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[var(--color-blue)] w-full p-4 flex items-center justify-between transition-all cursor-pointer hover:opacity-90"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-5 h-5 text-white transition-transform duration-300 ${
              isOpen ? "rotate-0" : "-rotate-90"
            }`}
          />

          <div className="text-left">
            <h3 className="text-white text-lg font-semibold">{list.name}</h3>
            {/* <RenderWhen isTrue={!!list.description}>
              <p className="text-white/80 text-sm mt-0.5">{list.description}</p>
            </RenderWhen> */}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium text-sm">
            {checkedCount}/{totalCount}
          </div>

          <RenderWhen isTrue={!!onAddItem}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddItem?.();
              }}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
              title="Adicionar item à lista"
            >
              <Plus className="w-4 h-4" />
            </button>
          </RenderWhen>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateToList();
            }}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
            title="Iniciar lista"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[10000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <RenderWhen
          isTrue={items && items.length > 0}
          elseElement={
            <div className="p-8 text-center text-[var(--color-text-gray)]">
              <p className="text-base">Nenhum item nesta lista</p>
              <p className="text-sm mt-2 opacity-75">
                Adicione itens do inventário
              </p>
            </div>
          }
        >
          <div className="divide-y divide-gray-100">
            {items.map((item: ListItem) => (
              <ListItemCard key={item.id} item={item} listId={list.id} />
            ))}
          </div>
        </RenderWhen>
      </div>
    </div>
  );
}
