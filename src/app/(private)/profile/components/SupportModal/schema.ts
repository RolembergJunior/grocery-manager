import { z } from "zod/v4";

export const SCREEN_OPTIONS = [
  "Início (listas)",
  "Detalhe da lista",
  "Estoque",
  "Perfil/Conta",
  "Assinatura",
  "Login",
  "Outra",
] as const;

export const TYPE_OPTIONS = [
  { value: "bug", label: "Bug" },
  { value: "doubt", label: "Dúvida" },
  { value: "suggestion", label: "Sugestão" },
] as const;

export const supportSchema = z.object({
  type: z.enum(["bug", "doubt", "suggestion"]),
  screen: z.string().min(1, "Selecione uma tela"),
  message: z
    .string()
    .trim()
    .min(10, "Descreva com pelo menos 10 caracteres")
    .max(1000, "Máximo de 1000 caracteres"),
});

export type SupportForm = z.infer<typeof supportSchema>;
