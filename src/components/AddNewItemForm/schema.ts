import { z } from "zod";

export const addItemFormSchema = z.object({
  name: z
    .string()
    .min(1, "O nome do item é obrigatório")
    .max(20, "O nome deve ter no máximo 20 caracteres")
    .trim(),
  // currentQuantity: z
  //   .number("A quantidade atual é obrigatória")
  //   .min(0, "A quantidade não pode ser negativa")
  //   .max(100, "A quantidade não pode ser maior que 100"),
  // neededQuantity: z
  //   .number("A quantidade necessária é obrigatória")
  //   .min(0, "A quantidade não pode ser negativa")
  //   .max(100, "A quantidade não pode ser maior que 100"),
  unit: z.string().nonempty("A unidade é obrigatória"),
  statusCompra: z.number("O status da compra é obrigatório"),
  recurrency: z.number().optional(),
});

export type AddItemFormData = z.infer<typeof addItemFormSchema>;
