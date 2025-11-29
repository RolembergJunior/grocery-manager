import { z } from "zod";

export const addItemFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  neededQuantity: z
    .number("Quantidade necessária é obrigatória")
    .min(1, "Quantidade necessária deve ser maior que zero"),
  unit: z.string().min(1, "Unidade é obrigatória"),
  observation: z.string().optional(),
});

export type AddItemFormData = z.infer<typeof addItemFormSchema>;
