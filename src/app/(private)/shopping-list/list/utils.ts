import { Product } from "@/app/type";

export function matchesSearchFilter(
  item: Product,
  searchTerm: string
): boolean {
  return item.name.toLowerCase().includes(searchTerm.toLowerCase());
}

export function matchesCategoryFilter(
  item: Product,
  categoryFilter: string
): boolean {
  return categoryFilter === "Todos" || item.category.includes(categoryFilter);
}

export function matchesStatusFilter(
  item: Product,
  statusFilter: string
): boolean {
  switch (statusFilter) {
    case "comprados":
      return !!item.statusCompra;
    case "pendentes":
      return !item.statusCompra && !item.isRemoved;
    case "removidos":
      return !!item.isRemoved;
    default:
      return true;
  }
}
