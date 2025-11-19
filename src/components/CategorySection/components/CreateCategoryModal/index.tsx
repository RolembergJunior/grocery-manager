"use client";

import { Palette, Trash2 } from "lucide-react";
import Modal from "../../../Modal";
import { palletColors } from "@/app/utils";
import { useEffect, useState } from "react";
import RenderWhen from "../../../RenderWhen";
import { schema } from "./schema";
import z from "zod";
import { toast } from "sonner";
import { validateIfExists } from "./utils";
import { useAtom } from "jotai";
import { categoriesAtom } from "@/lib/atoms/categories";
import FieldForm from "../../../FieldForm";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/services/categories";
import { Category } from "@/app/type";
import AlertDialog from "@/components/AlertDialog";

interface CreateCategoryModalProps {
  isModalOpen: boolean;
  categoryToEdit: Category | null;
  onCloseModal: () => void;
}

interface FormErrors {
  name?: string;
  color?: string;
}

export default function CreateCategoryModal({
  isModalOpen,
  categoryToEdit,
  onCloseModal,
}: CreateCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showToast, setShowToast] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [categories, setCategories] = useAtom(categoriesAtom);

  useEffect(() => {
    if (categoryToEdit && isModalOpen) {
      setCategoryName(categoryToEdit?.name || "");
      setSelectedColorId(categoryToEdit?.colorId || null);
    }
  }, [JSON.stringify(categoryToEdit), isModalOpen]);

  function handleCloseModal() {
    setCategoryName("");
    setSelectedColorId(null);
    setErrors({});
    onCloseModal();
  }

  function validateForm(): boolean {
    try {
      schema.parse({ name: categoryName, color: selectedColorId });
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
      }

      return false;
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (categoryToEdit) {
      update();
      return;
    }

    create();
  }

  function create() {
    if (validateIfExists(categories, { name: categoryName })) {
      toast.error(
        "Não é possível criar a categoria pois a categoria já existe!"
      );
      return;
    }

    toast.promise(createCategory(categoryName, selectedColorId as number), {
      loading: "Criando categoria...",
      success: (res: Category) => {
        setCategories([...categories, res]);

        handleCloseModal();
        return "Categoria criada com sucesso!";
      },
      error: "Erro ao criar categoria. Tente novamente.",
    });
  }

  function update() {
    toast.promise(
      updateCategory(categoryToEdit!.id, {
        name: categoryName,
        colorId: Number(selectedColorId),
      }),
      {
        loading: "Atualizando categoria...",
        success: () => {
          setCategories((prev) =>
            prev.map((category) =>
              category.id === categoryToEdit!.id
                ? {
                    ...category,
                    name: categoryName,
                    colorId: Number(selectedColorId),
                  }
                : category
            )
          );

          handleCloseModal();
          return "Categoria atualizada com sucesso!";
        },
        error: "Erro ao atualizar categoria. Tente novamente.",
      }
    );
  }

  function handleDeleteList() {
    if (!categoryToEdit) return;
    setIsDeleteAlertOpen(true);
  }

  function confirmDeleteCategory() {
    if (!categoryToEdit) return;

    toast.promise(deleteCategory(categoryToEdit.id), {
      loading: "Excluindo categoria...",
      success: () => {
        setCategories((prev) =>
          prev.filter((category) => category.id !== categoryToEdit.id)
        );

        handleCloseModal();
        return "Categoria excluída com sucesso!";
      },
      error: "Erro ao excluir categoria. Tente novamente.",
    });
  }

  const colorOptions = Object.entries(palletColors).map(([id, colors]) => ({
    value: id,
    label: (
      <div className="flex items-center gap-2">
        <div
          className={`w-6 h-6 rounded-full border-2 border-gray-200 ${colors.bgClass}`}
        />
        <span>{colors.backgroundColor}</span>
      </div>
    ),
  }));

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title="Criar Nova Categoria"
      iconTitle={<Palette className="w-6 h-6 text-blue" />}
      rightHeaderContent={
        <RenderWhen isTrue={!!categoryToEdit}>
          <button
            type="button"
            onClick={handleDeleteList}
            className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </RenderWhen>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <FieldForm
          type="text"
          label="Nome da Categoria"
          value={categoryName}
          onChange={(value) => setCategoryName(value as string)}
          error={errors.name}
          required
          placeholder="Digite o nome da categoria"
          maxLength={15}
        />

        <FieldForm
          type="select"
          label="Cor da Categoria"
          value={
            selectedColorId?.toString() ||
            categoryToEdit?.colorId?.toString() ||
            ""
          }
          onChange={(value) => {
            setSelectedColorId(Number(value));
          }}
          error={errors.color}
          required
          placeholder="Selecione uma cor"
          options={colorOptions}
        />

        <RenderWhen isTrue={!!selectedColorId}>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-600 mb-2">Prévia:</p>
            <div
              className={`rounded-2xl p-4 flex items-center justify-center h-20 shadow-md ${
                palletColors[selectedColorId as keyof typeof palletColors]
                  ?.bgClass
              }`}
            >
              <span className="text-white text-lg font-medium">
                {categoryName || "Nome da Categoria"}
              </span>
            </div>
          </div>
        </RenderWhen>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 p-3 bg-blue text-white rounded-xl hover:bg-blue/70 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {categoryToEdit ? "Atualizar Categoria" : "Criar Categoria"}
          </button>

          <button
            type="button"
            onClick={handleCloseModal}
            className="flex-1 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>

      <AlertDialog
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        title="Excluir categoria?"
        description={`Tem certeza que deseja excluir a categoria "${categoryToEdit?.name}"? Esta ação não pode ser desfeita.`}
        variant="danger"
        actions={[
          {
            label: "Cancelar",
            onClick: () => null,
            autoClose: true,
            variant: "secondary",
          },
          {
            label: "Excluir",
            onClick: confirmDeleteCategory,
            autoClose: true,
            variant: "danger",
          },
        ]}
      />
    </Modal>
  );
}
