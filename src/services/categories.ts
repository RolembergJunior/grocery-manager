"use server";

import type { Category } from "@/app/type";
import {
  authenticatedFetchArray,
  authenticatedFetch,
  authenticatedFetchVoid,
} from "@/lib/api-helper";

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await authenticatedFetchArray("/api/categories", {
      method: "GET",
    });

    if (!data) return [];
    const response = data as unknown as { categories: Category[] };
    return Array.isArray(response.categories) ? response.categories : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createCategory(
  name: string,
  colorId: number
): Promise<Category> {
  const data = await authenticatedFetch<{ category: Category }>(
    "/api/categories",
    {
      method: "POST",
      body: JSON.stringify({ name, colorId }),
    }
  );
  return data.category;
}

export async function updateCategory(
  id: string,
  updates: { name?: string; colorId?: number }
): Promise<void> {
  await authenticatedFetchVoid("/api/categories", {
    method: "PUT",
    body: JSON.stringify({ id, ...updates }),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await authenticatedFetchVoid("/api/categories", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}
