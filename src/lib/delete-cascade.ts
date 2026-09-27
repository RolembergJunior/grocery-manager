import type { ListItem, Product } from "@/app/type";

export type ProductRef = Pick<Product, "id" | "name">;

export function normalizeItemId(itemId: unknown): string | null {
  if (typeof itemId === "string") return itemId.trim() ? itemId : null;

  if (Array.isArray(itemId)) {
    const first = itemId.find(
      (value) => typeof value === "string" && value.trim() !== "",
    );
    return typeof first === "string" ? first : null;
  }

  return null;
}

export function selectListItemIdsToDelete({
  deletedProductIds,
  listItems,
}: {
  deletedProductIds: string[];
  listItems: ListItem[];
}): string[] {
  const deleted = new Set(deletedProductIds);

  return listItems
    .filter((item) => {
      const productId = normalizeItemId(item.itemId);
      return productId !== null && deleted.has(productId);
    })
    .map((item) => item.id);
}

export function selectProductsWithMissingCategory<
  T extends ProductRef & { category: unknown },
>({ products, categoryIds }: { products: T[]; categoryIds: string[] }): T[] {
  const existing = new Set(categoryIds);

  return products.filter((product) => {
    const categoryId =
      typeof product.category === "string" ? product.category.trim() : "";
    return categoryId !== "" && !existing.has(categoryId);
  });
}

export function selectOrphanListItemIds({
  productIds,
  listItems,
}: {
  productIds: string[];
  listItems: ListItem[];
}): string[] {
  const existing = new Set(productIds);

  return listItems
    .filter((item) => {
      const productId = normalizeItemId(item.itemId);
      return productId !== null && !existing.has(productId);
    })
    .map((item) => item.id);
}

export function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) throw new Error("chunk size must be positive");

  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
