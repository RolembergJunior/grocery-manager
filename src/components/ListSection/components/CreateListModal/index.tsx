"use client";

import { ListPlus } from "lucide-react";
import Modal from "../../../Modal";
import { useEffect, useState } from "react";
import RenderWhen from "../../../RenderWhen";
import { toast } from "sonner";
import { useAtom } from "jotai";
import { listsAtom } from "@/lib/atoms";
import FieldForm from "../../../FieldForm";
import { createList } from "@/services/lists";
import { List } from "@/app/type";
import { schema } from "./schema";
import z from "zod";

interface CreateListModalProps {
  isModalOpen: boolean;
  listToEdit: List | null;
  onCloseModal: () => void;
}

interface FormErrors {
  name?: string;
  description?: string;
}

export default function CreateListModal({
  isModalOpen,
  listToEdit,
  onCloseModal,
}: CreateListModalProps) {
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [lists, setLists] = useAtom(listsAtom);

  useEffect(() => {
    if (listToEdit) {
      setListName(listToEdit.name);
      setListDescription(listToEdit.description);
    }
  }, [listToEdit]);

  function handleCloseModal() {
    setListName("");
    setListDescription("");
    setErrors({});
    onCloseModal();
  }

  function validateForm(): boolean {
    try {
      schema.parse({ name: listName, description: listDescription });
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

  function handleCreateList(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const listExists = lists.some(
      (list) => list.name.toLowerCase() === listName.toLowerCase()
    );

    if (listExists) {
      toast.error("Não é possível criar a lista pois ela já existe!");
      return;
    }

    toast.promise(createList(listName, listDescription), {
      loading: "Criando lista...",
      success: (res) => {
        if ("error" in res) {
          throw new Error(res.error);
        }
        setLists([...lists, res]);
        handleCloseModal();
        return "Lista criada com sucesso!";
      },
      error: "Erro ao criar lista. Tente novamente.",
    });
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title="Criar Nova Lista"
      iconTitle={<ListPlus className="w-6 h-6 text-blue-600" />}
      height="xl"
    >
      <form onSubmit={handleCreateList} className="space-y-3">
        <FieldForm
          type="text"
          label="Nome da Lista"
          value={listName}
          onChange={(value) => setListName(value as string)}
          error={errors.name}
          required
          placeholder="Digite o nome da lista"
          maxLength={20}
        />

        <FieldForm
          type="textarea"
          label="Descrição (opcional)"
          value={listDescription}
          onChange={(value) => setListDescription(value as string)}
          error={errors.description}
          placeholder="Digite uma descrição para a lista"
          maxLength={200}
          rows={3}
        />

        <RenderWhen isTrue={!!listName}>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-600 mb-2">Prévia:</p>
            <div className="bg-[var(--color-list-card)] rounded-2xl p-4 flex flex-col justify-center items-center min-h-24 shadow-md">
              <p className="text-blue font-medium border-b border-blue pb-1">
                {listName || "Nome da Lista"}
              </p>
              <RenderWhen isTrue={!!listDescription}>
                <p className="text-xs text-gray-500 mt-2 text-center line-clamp-2">
                  {listDescription}
                </p>
              </RenderWhen>
            </div>
          </div>
        </RenderWhen>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 p-3 bg-blue text-white rounded-xl hover:bg-blue/70 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Criar Lista
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
    </Modal>
  );
}
