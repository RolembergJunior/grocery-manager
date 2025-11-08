import { z } from "zod/v4";

export const schema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z
    .string()
    .max(200, "A descrição deve ter no máximo 200 caracteres"),
});
