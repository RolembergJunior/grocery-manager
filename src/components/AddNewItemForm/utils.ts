import { Product } from "@/app/type";
import { FormData } from "./type";

export function validateIfExists(products: Product[], formData: FormData) {
  const isExists = products.some(
    (item: Product) => item.name.toLowerCase() === formData.name.toLowerCase()
  );

  return isExists;
}
