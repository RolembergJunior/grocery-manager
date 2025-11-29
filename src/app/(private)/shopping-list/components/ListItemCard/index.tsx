"use client";

import { ListItem, Product } from "@/app/type";
import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import RenderWhen from "@/components/RenderWhen";

interface ListItemCardProps {
  item: ListItem;
  hasDeleteButton?: boolean;
  onSave: (item: ListItem) => void;
  onDelete: (id: string) => void;
}

export default function ListItemCard({
  item,
  hasDeleteButton = false,
  onSave,
  onDelete,
}: ListItemCardProps) {
  const [newItem, setNewItem] = useState(item);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasChanges = useMemo(() => {
    return (
      newItem.neededQuantity !== item.neededQuantity ||
      newItem.observation !== item.observation
    );
  }, [newItem, item]);

  function handleChangeItemProp(field: keyof ListItem, value: string | number) {
    setNewItem({ ...newItem, [field]: value });
  }

  function handleCancel() {
    setNewItem(item);
  }

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1">
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
              <h3
                className={`text-base font-semibold text-gray-900 truncate ${
                  newItem.checked ? "line-through text-gray-400" : ""
                }`}
              >
                {item.name}
              </h3>
              <span className="text-sm text-gray-500">
                Precisa: {item.neededQuantity} {item.unit}
              </span>
            </div>
          </button>
        </div>

        <RenderWhen isTrue={hasDeleteButton}>
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
            title="Remover item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </RenderWhen>
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
                  value={newItem.neededQuantity}
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
              onClick={() => onSave(newItem)}
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
