import { Category } from "@/app/type";
import { unitOptions } from "@/app/utils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategoryName(categories: Category[], categoryId: string) {
  return (
    categories.find((category) => category.id === categoryId)?.name ||
    categoryId
  );
}
