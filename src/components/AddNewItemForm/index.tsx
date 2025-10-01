"use client";

import { Item, Products } from "@/app/type";
import { useState } from "react";
import { FormData, FormErrors } from "./type";
import { addItemFormSchema } from "./schema";
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
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { validateIfExists } from "./utils";
import FieldForm from "../FieldForm";

export default function AddNewItemForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    currentQuantity: null,
    neededQuantity: null,
    unit: "",
    statusCompra: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [products, setProducts] = useAtom(productsAtom);

  function validateForm(): boolean {
    try {
      addItemFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((err) => {
          const path = err.path[0] as keyof FormErrors;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ _form: "Erro ao validar o formulário" });
      }
      return false;
    }
  }

  function handleAddItem() {
    if (!validateForm()) {
      return;
    }

    if (validateIfExists(products, formData)) {
      toast.error("Não é possível criar o item pois o produto já existe!");
      return;
    }

    const newProducts: Products = Array.isArray(products) ? [...products] : [];

    newProducts.push({
      id: Date.now(),
      name: formData.name,
      currentQuantity: formData.currentQuantity || 0,
      neededQuantity: formData.neededQuantity || 0,
      unit: formData.unit,
      category: formData.category.toLowerCase(),
      statusCompra: formData.statusCompra as number,
    });

    saveData(newProducts);

    setFormData({
      name: "",
      category: "",
      currentQuantity: null,
      neededQuantity: null,
      unit: "",
      statusCompra: null,
    });
    setErrors({});
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

  function handleChangeInput(keyName: string, value: string | number | null) {
    setFormData({
      ...formData,
      [keyName]: value,
    });
    if (errors[keyName as keyof FormErrors]) {
      setErrors({ ...errors, [keyName]: undefined });
    }
  }

  return (
    <div className="bg-white rounded-2xl w-full">
      <div className="space-y-2">
        {errors._form && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{errors._form}</span>
          </div>
        )}
        <FieldForm
          type="text"
          label="Nome do item"
          value={formData.name}
          onChange={(value) => handleChangeInput("name", value)}
          error={errors.name}
          required
          placeholder="Digite o nome do produto"
          maxLength={20}
        />

        <FieldForm
          type="select"
          label="Categoria"
          value={getCategoryName(formData.category)}
          onChange={(value) => handleChangeInput("category", value)}
          options={categoryOptions}
          error={errors.category}
        />

        <FieldForm
          type="number"
          label="Quantidade atual"
          value={formData.currentQuantity}
          onChange={(value) => handleChangeInput("currentQuantity", value)}
          error={errors.currentQuantity}
          required
          min={0}
        />

        <FieldForm
          type="number"
          label="Precisa comprar"
          value={formData.neededQuantity}
          onChange={(value) => handleChangeInput("neededQuantity", value)}
          error={errors.neededQuantity}
          required
          min={0}
        />

        <FieldForm
          type="select"
          label="Unidade"
          value={formData.unit}
          onChange={(value) => handleChangeInput("unit", value)}
          options={unitOptions}
          error={errors.unit}
        />

        <FieldForm
          type="select"
          label="Status da compra"
          value={
            buyStatusOptions.find(
              (option) => option.value === formData.statusCompra
            )?.label || null
          }
          onChange={(value) =>
            handleChangeInput("statusCompra", parseInt(value as string))
          }
          options={buyStatusOptions}
          error={errors.statusCompra}
        />

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
