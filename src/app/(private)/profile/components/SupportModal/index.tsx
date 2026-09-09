"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import { LifeBuoy } from "lucide-react";
import { useAtom } from "jotai";
import { toast } from "sonner";
import { useFirebaseAuth } from "@/components/AuthProvider";
import { profileAtom } from "@/lib/atoms/profile";
import { getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import FieldForm from "@/components/FieldForm";
import type { OptionsType } from "@/app/type";
import {
  SCREEN_OPTIONS,
  TYPE_OPTIONS,
  supportSchema,
  type SupportForm,
} from "./schema";

const SCREEN_SELECT_OPTIONS: OptionsType[] = SCREEN_OPTIONS.map((option) => ({
  value: option,
  label: option,
}));

const TYPE_SELECT_OPTIONS: OptionsType[] = TYPE_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}));

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APP_VERSION = "0.1.0";

export default function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const { user } = useFirebaseAuth();
  const [profile] = useAtom(profileAtom);
  const [type, setType] = useState<SupportForm["type"]>("bug");
  const [screen, setScreen] = useState<string>(SCREEN_OPTIONS[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  function resetForm() {
    setType("bug");
    setScreen(SCREEN_OPTIONS[0]);
    setMessage("");
    setErrors({});
  }

  async function handleSubmit() {
    const parsed = supportSchema.safeParse({ type, screen, message });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setIsSending(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Você precisa estar logado.");
      }
      const idToken = await getIdToken(currentUser);

      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          uid: user?.uid ?? "",
          email: profile?.email ?? user?.email ?? "",
          name: profile?.name ?? user?.displayName ?? "",
          ...parsed.data,
          platform: "web",
          os: "web",
          appVersion: APP_VERSION,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao enviar");
      }
      toast.success("Mensagem enviada! Obrigado pelo contato.");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error sending support message:", error);
      toast.error("Não foi possível enviar. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajuda e suporte"
      iconTitle={<LifeBuoy className="w-5 h-5 text-blue-500" />}
      size="md"
    >
      <div className="flex flex-col gap-4">
        <FieldForm
          type="select"
          label="Tipo"
          value={type}
          onChange={(value) => setType(value as SupportForm["type"])}
          options={TYPE_SELECT_OPTIONS}
        />

        <FieldForm
          type="select"
          label="Tela"
          value={screen}
          onChange={(value) => setScreen(value as string)}
          options={SCREEN_SELECT_OPTIONS}
          error={errors.screen}
        />

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Descrição
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            rows={5}
            placeholder="Descreva o problema ou dúvida..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none"
          />
          <div className="flex justify-between">
            <span className="text-red-500 text-sm">{errors.message ?? ""}</span>
            <span className="text-xs text-gray-400">{message.length}/1000</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSending}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition-all"
        >
          {isSending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </Modal>
  );
}
