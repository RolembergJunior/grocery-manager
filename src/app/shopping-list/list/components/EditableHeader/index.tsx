"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { updateList } from "@/services/lists";
import { toast } from "sonner";
import RenderWhen from "@/components/RenderWhen";
import { schema } from "./schema";
import z from "zod";
import FieldForm from "@/components/FieldForm";

interface EditableHeaderProps {
  listId: string;
  initialName: string;
  initialDescription: string;
}

type FormErrors = {
  name?: string;
  description?: string;
  _form?: string;
};

export default function EditableHeader({
  listId,
  initialName,
  initialDescription,
}: EditableHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [isEditingDescription]);

  function validateForm(): boolean {
    try {
      schema.parse({ name, description });
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

  // async function handleSaveName() {
  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsSaving(true);
  //   const loadingToast = toast.loading("Salvando...");

  //   try {
  //     await updateList(listId, { name: name.trim() });
  //     toast.success("Nome atualizado com sucesso!", { id: loadingToast });
  //     setIsEditingName(false);
  //   } catch (error) {
  //     toast.error("Erro ao atualizar o nome", { id: loadingToast });
  //     setName(initialName);
  //     setIsEditingName(false);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // }

  async function handleSaveDescription() {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Salvando...");

    try {
      await updateList(listId, { description: description.trim() });
      toast.success("Descrição atualizada com sucesso!", { id: loadingToast });
      setIsEditingDescription(false);
    } catch (error) {
      toast.error("Erro ao atualizar a descrição", { id: loadingToast });
      setDescription(initialDescription);
      setIsEditingDescription(false);
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelName() {
    setName(initialName);
    setIsEditingName(false);
    setErrors({});
  }

  function handleCancelDescription() {
    setDescription(initialDescription);
    setIsEditingDescription(false);
    setErrors({});
  }

  return (
    <div className="mb-4">
      <div className="group relative">
        <RenderWhen
          isTrue={isEditingName}
          elseElement={
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-text-dark uppercase tracking-wide">
                {name}
              </h1>
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
                title="Editar nome"
              >
                <Pencil size={16} className="text-black" />
              </button>
            </div>
          }
        >
          <div className="flex items-center gap-2">
            <FieldForm
              type="text"
              value={name}
              onChange={(value) => setName(value as string)}
              error={errors.name}
              required
              placeholder="Nome da lista"
              disabled={isSaving}
              maxLength={100}
            />
            <button
              // onClick={handleSaveName}
              disabled={isSaving}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              title="Salvar (Enter)"
            >
              <Check size={20} />
            </button>
            <button
              onClick={handleCancelName}
              disabled={isSaving}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              title="Cancelar (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </RenderWhen>
      </div>

      {/* <div className="group relative mt-2">
        <RenderWhen
          isTrue={isEditingDescription}
          elseElement={
            <div className="flex items-start gap-2">
              <p className="text-sm text-text-gray flex-1">
                {description || (
                  <span className="italic text-gray-400">
                    Clique para adicionar uma descrição
                  </span>
                )}
              </p>
              <button
                onClick={() => setIsEditingDescription(true)}
                className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0"
                title="Editar descrição"
              >
                <Pencil size={14} className="text-gray-500" />
              </button>
            </div>
          }
        >
          <div className="flex flex-col gap-2">
            <FieldForm
              label="Descrição"
              type="textarea"
              value={description}
              onChange={(value) => setDescription(value as string)}
              error={errors.description}
              disabled={isSaving}
              className="w-full text-sm text-text-gray bg-white border-2 border-blue rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue/50 disabled:opacity-50 resize-none"
              rows={3}
              maxLength={200}
              placeholder="Adicione uma descrição (opcional)"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {description.length}/200 caracteres (Ctrl+Enter para salvar)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveDescription}
                  disabled={isSaving}
                  className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  Salvar
                </button>
                <button
                  onClick={handleCancelDescription}
                  disabled={isSaving}
                  className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </RenderWhen>

        <RenderWhen isTrue={!description && !isEditingDescription}>
          <button
            onClick={() => setIsEditingDescription(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-sm text-blue hover:text-blue/80 flex items-center gap-1 mt-1"
          >
            <Pencil size={14} />
            <span>Adicionar descrição</span>
          </button>
        </RenderWhen>
      </div> */}
    </div>
  );
}
