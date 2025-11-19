import { z } from "zod/v4";

export const schema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  color: z.number("Selecione uma cor"),
});
