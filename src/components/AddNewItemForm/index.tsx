"use client";

import { Item, Products } from "@/app/type";
import { ChangeEvent, useState } from "react";
import { FormData } from "./type";
import Select from "@/components/Select";
import { toast } from "sonner";
import { saveProducts } from "@/services/products";
import { productsAtom } from "@/lib/atoms";
import { useAtom } from "jotai";

const categoryOptions = [
  { value: "fridge", label: "Fridge" },
  { value: "cupboard", label: "Cupboard" },
  { value: "freezer", label: "Freezer" },
  { value: "pantry", label: "Pantry" },
  { value: "produce", label: "Produce" },
  { value: "dairy", label: "Dairy" },
  { value: "meat", label: "Meat" },
  { value: "cleaning", label: "Cleaning" },
  { value: "personal-hygiene", label: "Personal Hygiene" },
  { value: "other", label: "Other" },
];

const unitOptions = [
  { value: "pcs", label: "Unidade" },
  { value: "kg", label: "Kilogramas" },
  { value: "g", label: "Gramas" },
  { value: "l", label: "Litros" },
  { value: "ml", label: "Mililitros" },
  { value: "lbs", label: "Pounds" },
  { value: "oz", label: "Ounces" },
  { value: "cups", label: "Copos" },
  { value: "spoons", label: "Spoons" },
];

export default function AddNewItemForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    currentQuantity: 0,
    neededQuantity: 0,
    unit: "",
  });

  const [products, setProducts] = useAtom(productsAtom);

  function handleAddItem() {
    if (!formData.name.trim() || !formData.category.trim()) {
      toast.error("Por favor, preencha os campos!");
      return;
    }

    const category = formData.category.toLowerCase();
    const newProducts: Products = Array.isArray(products) ? [...products] : [];

    const existingIndex = newProducts.findIndex(
      (item: Item) =>
        item.name.toLowerCase() === formData.name.toLowerCase() &&
        item.category.toLowerCase() === category
    );

    if (existingIndex > -1) {
      newProducts[existingIndex] = {
        ...newProducts[existingIndex],
        currentQuantity: formData.currentQuantity || 0,
        neededQuantity: formData.neededQuantity || 0,
        unit: formData.unit,
      };
      toast.success("Item atualizado com sucesso!");
    } else {
      newProducts.push({
        id: Date.now(),
        name: formData.name,
        currentQuantity: formData.currentQuantity || 0,
        neededQuantity: formData.neededQuantity || 0,
        unit: formData.unit,
        category,
      });
      toast.success("Item criado com sucesso!");
    }

    saveData(newProducts);

    setFormData({
      name: "",
      category: "",
      currentQuantity: 0,
      neededQuantity: 0,
      unit: "",
    });
  }

  async function saveData(newProducts: Products): Promise<void> {
    toast.promise(saveProducts(newProducts), {
      loading: "Salvando produto...",
      success: () => {
        setProducts(newProducts);
        return "Produto salvo com sucesso!!";
      },
      error:
        "Houve um erro ao tentar salvar os dados. Tente novamente mais tarde.",
    });
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl mx-auto mb-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">+</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Adicionar Produto</h3>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Nome do item
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md"
              required
              placeholder="Digite o nome do produto"
            />
          </div>
          <Select
            label="Categoria"
            defaultValue={formData.category}
            onChange={(value: string) => {
              setFormData({ ...formData, category: value });
            }}
            options={categoryOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Quantidade atual
            </label>
            <input
              type="number"
              min="0"
              value={formData.currentQuantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  currentQuantity: parseInt(e.target.value),
                })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-800 shadow-sm hover:shadow-md"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Precisa comprar
            </label>
            <input
              type="number"
              min="0"
              value={formData.neededQuantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({
                  ...formData,
                  neededQuantity: parseInt(e.target.value),
                })
              }
              className="w-full p-4 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-800 shadow-sm hover:shadow-md"
              required
            />
          </div>
          <Select
            label="Unidade"
            defaultValue={formData.unit}
            onChange={(value: string) =>
              setFormData({ ...formData, unit: value })
            }
            options={unitOptions}
          />
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleAddItem}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span>
            Adicionar Produto
          </button>
        </div>
      </div>
    </div>
  );
}
