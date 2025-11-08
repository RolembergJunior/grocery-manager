"use client";

import FieldForm from "@/components/FieldForm";
import Modal from "@/components/Modal";
import RenderWhen from "@/components/RenderWhen";
import { Camera, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { schema } from "./schema";
import z from "zod";

interface AccountModalProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
  session: any;
  updateSession: any;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export default function AccountModal({
  isModalOpen,
  onCloseModal,
  session,
  updateSession,
}: AccountModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    profileImage: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: session.user.phone || "",
        email: session.user.email || "",
        profileImage: session.user.image || null,
      });
    }
  }, [session]);

  function handleCloseModal() {
    setErrors({});
    onCloseModal();
  }

  function validateForm(): boolean {
    try {
      schema.parse(formData);
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
        setErrors({ name: "Erro ao validar o formulário" });
      }
      return false;
    }
  }

  function handleChangeInput(
    value: string | number | null,
    field: keyof FormErrors
  ) {
    setFormData({
      ...formData,
      [field]: value,
    });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Imagem deve ter no máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profileImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    toast.promise(
      updateSession({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          email: formData.email,
          image: formData.profileImage,
        },
      }),
      {
        loading: "Salvando dados...",
        success: "Dados atualizados com sucesso!",
        error: "Erro ao salvar dados. Tente novamente.",
      }
    );
  }

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title="Dados da conta"
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-blue-400">
              <RenderWhen
                isTrue={!!formData.profileImage}
                elseElement={<User className="w-16 h-16 text-gray-400" />}
              >
                <img
                  src={formData.profileImage!}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </RenderWhen>
            </div>
            <label
              htmlFor="profile-image"
              className="absolute bottom-2 right-2 w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors"
            >
              <Camera className="w-5 h-5 text-gray-600" />
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <FieldForm
          type="text"
          label="Nome"
          value={formData.name}
          onChange={(value) => handleChangeInput(value, "name")}
          error={errors.name}
          required
          placeholder="Nome"
          maxLength={100}
        />

        <FieldForm
          type="text"
          label="Celular"
          value={formData.phone}
          onChange={(value) => handleChangeInput(value, "phone")}
          error={errors.phone}
          placeholder="Celular"
          maxLength={15}
        />

        <FieldForm
          type="text"
          label="Email"
          value={formData.email}
          onChange={(value) => handleChangeInput(value, "email")}
          error={errors.email}
          placeholder="Email"
          maxLength={100}
        />

        <div className="pt-4">
          <button
            type="submit"
            className="w-full p-3 bg-blue text-white rounded-full hover:bg-blue/70 transition-colors duration-200 font-medium shadow-md"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
