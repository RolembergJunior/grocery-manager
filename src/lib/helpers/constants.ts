import "server-only";

export const COLLECTIONS = {
  PROFILES: "users",
  PRODUCTS: "products",
  CATEGORIES: "categories",
  LISTS: "lists",
  LIST_ITEMS: "list_items",
} as const;

export function withTimestamps<T extends object>(data: T, isUpdate = false) {
  const now = new Date().toISOString();
  if (isUpdate) {
    return { ...data, updatedAt: now };
  }
  return { ...data, createdAt: now, updatedAt: now };
}
