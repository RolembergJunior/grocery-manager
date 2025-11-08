"use server";

import type { Category } from "@/app/type";
import { auth } from "@/auth";

export async function getCategories(): Promise<Category[]> {
  const session = await auth();

  if (!session?.user) return [];

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/categories?userId=${
      session.user.id as string
    }`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) return [];

  const data = (await res.json()) as { categories: Category[] };
  return Array.isArray(data.categories) ? data.categories : [];
}

export async function createCategory(
  name: string,
  colorId: number
): Promise<Category | { error: string }> {
  const session = await auth();

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/categories?userId=${
      session.user.id as string
    }`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, colorId }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to create category: ${res.status}`);
  }

  const data = (await res.json()) as { category: Category };
  return data.category;
}

export async function updateCategory(
  id: string,
  updates: { name?: string; colorId?: number }
): Promise<void | { error: string }> {
  const session = await auth();

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/categories?userId=${
      session.user.id as string
    }`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, ...updates }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update category: ${res.status}`);
  }
}

export async function deleteCategory(
  id: string
): Promise<void | { error: string }> {
  const session = await auth();

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/categories?userId=${
      session.user.id as string
    }`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete category: ${res.status}`);
  }
}
