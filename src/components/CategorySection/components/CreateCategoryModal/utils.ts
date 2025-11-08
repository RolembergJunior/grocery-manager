import { Category } from "@/app/type";

export function validateIfExists(
  categories: Category[],
  formData: { name: string }
): boolean {
  return categories.some(
    (category) => category.name.toLowerCase() === formData.name.toLowerCase()
  );
}
