"use server";

import type { List } from "@/app/type";
import { auth } from "@/auth";

export async function getLists(): Promise<List[]> {
  const session = await auth();

  if (!session?.user) return [];

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/lists?userId=${session.user.id as string}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) return [];

  const data = (await res.json()) as { lists: List[] };
  return Array.isArray(data.lists) ? data.lists : [];
}

export async function createList(
  name: string,
  description: string,
  itemId?: string[]
): Promise<List | { error: string }> {
  const session = await auth();

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/lists?userId=${session.user.id as string}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, description, itemId }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to create list: ${res.status}`);
  }

  const data = (await res.json()) as { list: List };
  return data.list;
}

export async function updateList(
  id: string,
  updates: {
    name?: string;
    description?: string;
    resetAt?: string;
    itemId?: string[];
  }
): Promise<void | { error: string }> {
  const session = await auth();

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/lists?userId=${session.user.id as string}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, ...updates }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update list: ${res.status}`);
  }
}

export async function deleteList(
  id: string
): Promise<void | { error: string }> {
  const session = await auth();

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/lists?userId=${session.user.id as string}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete list: ${res.status}`);
  }
}
