"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Item } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";
import Modal from "@/components/Modal";
import SelectComponent from "@/components/Select";
import {
  categoryOptions,
  getCategoryName,
  getUnitName,
  unitOptions,
} from "@/app/utils";
interface AddItemProps {
  onAddItem: (item: Omit<Item, "id">) => void;
}

export default function AddItemButton({ onAddItem }: AddItemProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    currentQuantity: 0,
    neededQuantity: 1,
    unit: "unidade",
    observation: "",
  });

  function handleAddItem() {
    if (!newItem.name.trim() || !newItem.category) {
      alert("Nome e categoria são obrigatórios!");
      return;
    }

    const itemToAdd: Omit<Item, "id"> = {
      name: newItem.name.trim(),
      category: newItem.category,
      currentQuantity: newItem.currentQuantity,
      neededQuantity: newItem.neededQuantity,
      unit: newItem.unit,
      observation: newItem.observation.trim() || undefined,
    };

    onAddItem(itemToAdd);

    setNewItem({
      name: "",
      category: "",
      currentQuantity: 0,
      neededQuantity: 1,
      unit: "unidade",
      observation: "",
    });
    setShowAddForm(false);
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
      >
        <Plus className="w-5 h-5" />
        Adicionar novo item
      </button>

      <RenderWhen isTrue={showAddForm}>
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Adicionar novo item"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Nome do Item *
              </label>
              <input
                type="text"
                placeholder="Ex: Arroz, Leite, Sabonete..."
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Categoria *
              </label>
              <SelectComponent
                defaultValue={getCategoryName(newItem.category)}
                onChange={(value: string[]) =>
                  setNewItem({ ...newItem, category: value[0] })
                }
                options={categoryOptions}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Qtd. Atual
                </label>
                <input
                  type="number"
                  min="0"
                  value={newItem.currentQuantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      currentQuantity: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm font-medium mb-2">
                  Qtd. Necessária
                </label>
                <input
                  type="number"
                  min="1"
                  value={newItem.neededQuantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      neededQuantity: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Unidade
              </label>
              <SelectComponent
                defaultValue={getUnitName(newItem.unit)}
                onChange={(value: string[]) =>
                  setNewItem({ ...newItem, unit: value[0] })
                }
                options={unitOptions}
              />
            </div>

            <div>
              <label className="block text-slate-700 text-sm font-medium mb-2">
                Observação (opcional)
              </label>
              <textarea
                placeholder="Ex: Marca específica, tamanho, etc..."
                value={newItem.observation}
                onChange={(e) =>
                  setNewItem({ ...newItem, observation: e.target.value })
                }
                rows={2}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white p-3 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Adicionar item
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-slate-300 hover:bg-slate-400 text-slate-700 p-3 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      </RenderWhen>
    </div>
  );
}
