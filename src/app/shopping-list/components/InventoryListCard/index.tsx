"use client";

import { Package, ShoppingCart, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAtomValue } from "jotai";
import { productsAtom, categoriesAtom } from "@/lib/atoms";
import { useMemo, useState } from "react";
import RenderWhen from "@/components/RenderWhen";

export default function InventoryListCard() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const products = useAtomValue(productsAtom);
  const categories = useAtomValue(categoriesAtom);

  const itemsNeedingShopping = useMemo(() => {
    return products.filter((item) => item.statusCompra === 1);
  }, [products]);

  function handleNavigateToInventoryList() {
    router.push(`/shopping-list/list?type=inventory-based`);
  }

  function getCategoryName(categoryId: string) {
    return categories.find((category) => category.id === categoryId)?.name;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-[var(--color-category-orange)] to-[var(--color-category-pink)] w-full p-4 flex items-center justify-between transition-all cursor-pointer hover:opacity-90"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            className={`w-5 h-5 text-white transition-transform duration-300 ${
              isOpen ? "rotate-0" : "-rotate-90"
            }`}
          />

          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <Package className="w-5 h-5 text-white" />
          </div>

          <div className="text-left">
            <h3 className="text-white text-lg font-semibold">
              Lista do Estoque
            </h3>
            <p className="text-white/80 text-sm mt-0.5">
              Gerada automaticamente
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-medium text-sm">
            {itemsNeedingShopping.length}{" "}
            {itemsNeedingShopping.length === 1 ? "item" : "itens"}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateToInventoryList();
            }}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-200 active:scale-95"
            title="Iniciar lista do estoque"
          >
            <ShoppingCart className="w-5 h-5" />
          </div>
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
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-[var(--color-text-dark)]">
                    {item.name}
                  </h4>
                  <p className="text-sm text-[var(--color-text-gray)]">
                    {getCategoryName(item.category)} • {item.unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-text-dark)]">
                    Precisa: {item.neededQuantity} {item.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </RenderWhen>
      </div>
    </div>
  );
}
