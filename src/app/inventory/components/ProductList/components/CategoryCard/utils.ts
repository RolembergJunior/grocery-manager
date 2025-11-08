import { Product } from "@/app/type";

export function getItemStatus(item: Product): string {
  if (item.currentQuantity === 0) {
    return "needs-shopping";
  }
  if (item.currentQuantity > 0 && item.currentQuantity < item.neededQuantity) {
    return "almost-empty";
  }

  return "in-stock";
}

export function getStatusText(status: string): string {
  switch (status) {
    case "needs-shopping":
      return "Precisa comprar";
    case "almost-empty":
      return "Quase sem estoque";
    default:
      return "Em estoque";
  }
}

export function formatCategoryTitle(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function formatItemCountText(
  totalItems: number,
  itemsToBuy: number
): string {
  const baseText = `${totalItems} item(ns)`;
  return itemsToBuy > 0 ? `${baseText} • ${itemsToBuy} para comprar` : baseText;
}
