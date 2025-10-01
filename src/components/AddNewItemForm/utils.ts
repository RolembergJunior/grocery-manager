import { Item } from "@/app/type";
import { FormData } from "./type";

export function validateIfExists(products: Item[], formData: FormData) {
  const isExists = products.some(
    (item: Item) =>
      item.name.toLowerCase() === formData.name.toLowerCase() &&
      item.category.toLowerCase() === formData.category.toLowerCase()
  );

  return isExists;
}
