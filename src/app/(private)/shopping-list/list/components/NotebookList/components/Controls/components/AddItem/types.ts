import { z } from "zod";
import { addItemFormSchema } from "./schema";

export interface FormData {
  name: string;
  category: string;
  currentQuantity: number | null;
  neededQuantity: number | null;
  unit: string;
  observation: string;
}

export type AddItemFormData = z.infer<typeof addItemFormSchema>;

export interface FormErrors {
  name?: string;
  category?: string;
  currentQuantity?: string;
  neededQuantity?: string;
  unit?: string;
  observation?: string;
  _form?: string;
}
