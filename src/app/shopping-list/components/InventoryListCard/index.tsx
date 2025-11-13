"use client";

import { Package, ChevronDown, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { productsAtom, categoriesAtom } from "@/lib/atoms";
import { useMemo, useState } from "react";
import RenderWhen from "@/components/RenderWhen";
import InventoryItemCard from "../InventoryItemCard";

export default function InventoryListCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const products = useAtomValue(productsAtom);
  const categories = useAtomValue(categoriesAtom);

  const itemsNeedingShopping = useMemo(() => {
    return products.filter((item) => item.statusCompra === 1);
  }, [products]);

  function handleNavigateToInventoryList() {
    router.push(`/shopping-list/list?type=inventory-based`);
  }

  function handleToggleExpand() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <button
        onClick={handleToggleExpand}
        className="w-full bg-gradient-to-br from-[var(--color-category-orange)] to-[var(--color-category-pink)] p-6 flex items-center justify-between transition-all cursor-pointer hover:opacity-90"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <Package className="w-6 h-6 text-white" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-left">
              <h3 className="text-white text-lg font-semibold">
                Lista do Estoque
              </h3>
              <p className="text-white/80 text-sm mt-0.5">
                Gerada automaticamente
              </p>
            </div>

            <div className="inline-flex self-start bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium text-sm">
              {itemsNeedingShopping.length}{" "}
              {itemsNeedingShopping.length === 1 ? "item" : "itens"}
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNavigateToInventoryList();
          }}
          className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
          title="Iniciar lista do estoque"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded
            ? "max-h-[10000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <RenderWhen
          isTrue={itemsNeedingShopping.length > 0}
          elseElement={
            <div className="p-8 text-center text-[var(--color-text-gray)]">
              <p className="text-base">Nenhum item precisa ser reposto</p>
              <p className="text-sm mt-2 opacity-75">
                Seu inventário está completo!
              </p>
            </div>
          }
        >
          <div className="p-4 space-y-2">
            {itemsNeedingShopping.map((item) => (
              <InventoryItemCard key={item.id} item={item} />
            ))}
          </div>
        </RenderWhen>
      </div>
    </div>
  );
}
