"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Product, ListItem } from "@/app/type";
import RenderWhen from "@/components/RenderWhen";
import Modal from "@/components/Modal";
import { categoryOptions, getUnitName, unitOptions } from "@/app/utils";
import FieldForm from "@/components/FieldForm";
import { FormErrors } from "./types";
import { addItemFormSchema } from "./schema";
import z from "zod";
interface AddItemProps {
  onAddItem: (item: Omit<Product, "id">) => void;
}

export default function AddItemButton({ onAddItem }: AddItemProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    currentQuantity: null,
    neededQuantity: 1,
    unit: "",
    observation: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function handleChangeInput(keyName: string, value: string | number | null) {
    setFormData({
      ...formData,
      [keyName]: value,
    });
    if (errors[keyName as keyof FormErrors]) {
      setErrors({ ...errors, [keyName]: undefined });
    }
  }

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

    const itemToAdd: ListItem = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      category: formData.category,
      neededQuantity: formData.neededQuantity || 0,
      unit: formData.unit,
      observation: formData.observation?.trim() || null,
      listId: "",
      itemId: [""],
      checked: false,
      isRemoved: false,
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAddItem(itemToAdd);

    setFormData({} as typeof formData);
    setShowAddForm(false);
  }

  return (
    <div>
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-white hover:bg-blue/70 text-blue border-blue border p-2  rounded-lg  font-bold transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>

      <RenderWhen isTrue={showAddForm}>
        <Modal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          title="Adicionar novo item"
        >
          <div className="space-y-4">
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
              value={formData.category}
              onChange={(value) => handleChangeInput("category", value)}
              options={categoryOptions}
              error={errors.category}
            />

            <FieldForm
              type="number"
              label="Qtd. Necessária"
              value={formData.neededQuantity}
              onChange={(value) => handleChangeInput("neededQuantity", value)}
              error={errors.neededQuantity}
              required
              min={1}
            />

            <FieldForm
              type="select"
              label="Unidade"
              value={getUnitName(formData.unit)}
              onChange={(value) => handleChangeInput("unit", value)}
              options={unitOptions}
              error={errors.unit}
            />

            <FieldForm
              type="textarea"
              label="Observação"
              value={formData.observation || ""}
              onChange={(value) => handleChangeInput("observation", value)}
              placeholder="Ex: Marca específica, tamanho, etc..."
              maxLength={500}
              rows={2}
            />

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
