import { z } from "zod";
import { addItemFormSchema } from "./schema";

export interface FormData {
  name: string;
  category: string | null;
  currentQuantity: number | null;
  neededQuantity: number | null;
  unit: string;
  statusCompra: number | null;
}

export type AddItemFormData = z.infer<typeof addItemFormSchema>;

export interface FormErrors {
  name?: string;
  category?: string;
  currentQuantity?: string;
  neededQuantity?: string;
  unit?: string;
  statusCompra?: string;
  _form?: string; // General form error
}
