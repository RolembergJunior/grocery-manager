"use client";

import { Category, Product } from "@/app/type";
import { useState } from "react";
import { FormData, FormErrors } from "./type";
import { addItemFormSchema } from "./schema";
import { toast } from "sonner";
import { updateOrCreate } from "@/services/products";
import { productsAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { buyStatusOptions, unitOptions } from "@/app/utils";
import { AlertCircle } from "lucide-react";
import { z } from "zod";
import { validateIfExists } from "./utils";
import FieldForm from "../FieldForm";
import { Button } from "../ui/button";
import RenderWhen from "../RenderWhen";

export default function AddNewItemForm({ category }: { category: Category }) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: category.id,
    currentQuantity: null,
    neededQuantity: null,
    unit: unitOptions[0].value,
    statusCompra: 1,
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

    saveData();

    setFormData({
      name: "",
      category: category.id,
      currentQuantity: null,
      neededQuantity: null,
      unit: unitOptions[0].value,
      statusCompra: 1,
    });
    setErrors({});
  }

  async function saveData(): Promise<void> {
    toast.promise(updateOrCreate(formData), {
      loading: "Salvando produto...",
      success: (item: Product) => {
        const newProducts: Product[] = [...products];

        newProducts.push(item);

        setProducts(newProducts);

        return "Item salvo com sucesso!!";
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
        <RenderWhen isTrue={!!errors._form}>
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{errors._form}</span>
          </div>
        </RenderWhen>

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
          label="Unidade"
          value={formData.unit}
          onChange={(value) => handleChangeInput("unit", value)}
          options={unitOptions}
          error={errors.unit}
          required
        />

        <FieldForm
          type="select"
          label="Status da compra"
          value={formData.statusCompra?.toString() || ""}
          onChange={(value) =>
            handleChangeInput("statusCompra", parseInt(value as string))
          }
          options={buyStatusOptions}
          error={errors.statusCompra}
          required
        />

        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <Button
            type="button"
            onClick={handleAddItem}
            variant="default"
            size="lg"
            className="w-full text-lg"
          >
            Adicionar Produto
          </Button>
        </div>
      </div>
    </div>
  );
}
