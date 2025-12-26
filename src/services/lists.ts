"use server";

import type { List } from "@/app/type";
import {
  authenticatedFetchArray,
  authenticatedFetch,
  authenticatedFetchVoid,
} from "@/lib/api-helper";

export async function getLists(): Promise<List[]> {
  try {
    const data = await authenticatedFetchArray("/api/lists", {
      method: "GET",
    });

    if (!data) return [];

    const response = data as unknown as { lists: List[] };
    return Array.isArray(response.lists) ? response.lists : [];
  } catch (error) {
    console.error("Error fetching lists:", error);
    return [];
  }
}

export async function createList(
  name: string,
  description: string,
  itemId?: string[]
): Promise<List> {
  const data = await authenticatedFetch<{ list: List }>("/api/lists", {
    method: "POST",
    body: JSON.stringify({ name, description, itemId }),
  });
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
): Promise<List> {
  const data = await authenticatedFetch<{ list: List }>("/api/lists", {
    method: "PUT",
    body: JSON.stringify({ id, ...updates }),
  });
  return data.list;
}

export async function deleteList(id: string): Promise<void> {
  await authenticatedFetchVoid("/api/lists", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

export async function generateShareToken(
  listId: string
): Promise<{ shareToken: string }> {
  const data = await authenticatedFetch<{ shareToken: string }>(
    "/api/lists/share/generate",
    {
      method: "POST",
      body: JSON.stringify({ listId }),
    }
  );
  return data;
}
