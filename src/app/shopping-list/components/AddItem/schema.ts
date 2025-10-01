import { z } from "zod";

export const addItemFormSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    category: z.string().min(1, "Categoria é obrigatória"),
    currentQuantity: z
      .number("Quantidade atual é obrigatória")
      .min(0, "Quantidade atual deve ser maior ou igual a zero"),
    neededQuantity: z
      .number("Quantidade necessária é obrigatória")
      .min(1, "Quantidade necessária deve ser maior que zero"),
    unit: z.string().min(1, "Unidade é obrigatória"),
    observation: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.neededQuantity <= data.currentQuantity) {
      ctx.addIssue({
        code: "custom",
        path: ["neededQuantity"],
        message: "Quantidade necessária precisa ser maior que a atual",
      });
    }
  });

export type AddItemFormData = z.infer<typeof addItemFormSchema>;
