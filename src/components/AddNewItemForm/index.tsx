"use client";

import { Item, Products } from "@/app/type";
import { ChangeEvent, useState } from "react";
import { FormData } from "./type";
import Select from "@/components/Select";
import { toast } from "sonner";
import { saveProducts } from "@/services/products";
import { productsAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import {
  buyStatusOptions,
  categoryOptions,
  getCategoryName,
  unitOptions,
} from "@/app/utils";

export default function AddNewItemForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    currentQuantity: 0,
    neededQuantity: 0,
    unit: "",
    statusCompra: null,
  });

  const [products, setProducts] = useAtom(productsAtom);

  function handleAddItem() {
    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.statusCompra
    ) {
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
        statusCompra: formData.statusCompra as number,
      };
    } else {
      newProducts.push({
        id: Date.now(),
        name: formData.name,
        currentQuantity: formData.currentQuantity || 0,
        neededQuantity: formData.neededQuantity || 0,
        unit: formData.unit,
        category,
        statusCompra: formData.statusCompra as number,
      });
    }

    saveData(newProducts);

    setFormData({
      name: "",
      category: "",
      currentQuantity: 0,
      neededQuantity: 0,
      unit: "",
      statusCompra: null,
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
    <div className="bg-white rounded-2xl w-full">
      <div className="space-y-2">
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
            className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md"
            required
            placeholder="Digite o nome do produto"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Categoria
          </label>
          <Select
            defaultValue={getCategoryName(formData.category)}
            onChange={(value: string[]) => {
              setFormData({ ...formData, category: value[0] });
            }}
            options={categoryOptions}
          />
        </div>

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
            className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-800 shadow-sm hover:shadow-md"
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
            className="w-full p-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-800 shadow-sm hover:shadow-md"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            Unidade
          </label>
          <Select
            defaultValue={formData.unit}
            onChange={(value: string[]) =>
              setFormData({ ...formData, unit: value[0] })
            }
            options={unitOptions}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Status da compra
          </label>
          <Select
            defaultValue={formData.statusCompra?.toString()}
            onChange={(value: string[]) =>
              setFormData({ ...formData, statusCompra: parseInt(value[0]) })
            }
            options={buyStatusOptions}
          />
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleAddItem}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span>
            Adicionar Produto
          </button>
        </div>
      </div>
    </div>
  );
}
