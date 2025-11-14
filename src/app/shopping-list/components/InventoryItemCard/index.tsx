"use client";

import { Product } from "@/app/type";
import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";
import { toast } from "sonner";
import { updateOrCreate } from "@/services/products";
import { useSetAtom } from "jotai";
import { productsAtom } from "@/lib/atoms";

interface InventoryItemCardProps {
  item: Product;
}

export default function InventoryItemCard({ item }: InventoryItemCardProps) {
  const [newItem, setNewItem] = useState(item);
  const [isExpanded, setIsExpanded] = useState(false);
  const setProducts = useSetAtom(productsAtom);

  const hasChanges = useMemo(() => {
    return (
      newItem.neededQuantity !== item.neededQuantity ||
      newItem.observation !== item.observation
    );
  }, [newItem, item]);

  function handleChangeItemProp(field: keyof Product, value: string | number) {
    setNewItem({ ...newItem, [field]: value });
  }

  function handleCancel() {
    setNewItem(item);
  }

  function handleSave() {
    toast.promise(updateOrCreate(newItem), {
      loading: "Salvando...",
      success: () => {
        setProducts((prevState) => {
          const mapState = new Map(prevState.map((item) => [item.id, item]));
          mapState.set(newItem.id, newItem);
          return Array.from(mapState.values());
        });
        return "Alterações salvas com sucesso!";
      },
      error: "Erro ao salvar as alterações",
    });
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 flex-1 text-left"
        >
          <RenderWhen
            isTrue={isExpanded}
            elseElement={<ChevronDown className="w-5 h-5 text-gray-500" />}
          >
            <ChevronUp className="w-5 h-5 text-gray-500" />
          </RenderWhen>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {item.name}
            </h3>
            <span className="text-sm text-gray-500">
              Precisa: {item.neededQuantity} {item.unit}
            </span>
          </div>
        </button>
      </div>

      <RenderWhen isTrue={isExpanded}>
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade necessária
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newItem.neededQuantity || 0}
                  onChange={(e) =>
                    handleChangeItemProp(
                      "neededQuantity",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.1"
                />
                <span className="text-sm text-gray-600 font-medium px-3 py-2 bg-gray-100 rounded-lg">
                  {item.unit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observação
              </label>
              <textarea
                value={newItem.observation || ""}
                onChange={(e) =>
                  handleChangeItemProp("observation", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Adicione uma observação (opcional)"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-3">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-1 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-medium transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            >
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </RenderWhen>
    </div>
  );
}
