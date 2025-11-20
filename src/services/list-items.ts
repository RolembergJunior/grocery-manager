"use server";

import type { ListItem } from "@/app/type";
import {
  authenticatedFetchArray,
  authenticatedFetch,
  authenticatedFetchVoid,
} from "@/lib/api-helper";

export async function getListItems(
  listId?: string,
  includeRemoved?: boolean
): Promise<ListItem[]> {
  try {
    const data = await authenticatedFetchArray("/api/list-items", {
      method: "GET",
      params: listId
        ? { listId, includeRemoved: includeRemoved || false }
        : undefined,
    });

    if (!data) return [];
    const response = data as unknown as { listItems: ListItem[] };
    return Array.isArray(response.listItems) ? response.listItems : [];
  } catch (error) {
    console.error("Error fetching list items:", error);
    return [];
  }
}

export async function createListItem(
  newItem: Partial<Omit<ListItem, "id">>
): Promise<ListItem | { error: string }> {
  try {
    const data = await authenticatedFetch<{ listItem: ListItem }>(
      "/api/list-items",
      {
        method: "POST",
        body: JSON.stringify(newItem),
      }
    );
    return data.listItem;
  } catch (error) {
    return { error: "Não autenticado" };
  }
}

export async function updateListItem(
  id: string,
  updates: Partial<ListItem>
): Promise<ListItem> {
  const data = await authenticatedFetch<{ listItem: ListItem }>(
    "/api/list-items",
    {
      method: "PUT",
      body: JSON.stringify({ id, ...updates }),
    }
  );
  return data.listItem;
}

export async function deleteListItem(id: string): Promise<void> {
  await authenticatedFetchVoid("/api/list-items", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
}

export async function deleteItemsByListId(listId: string): Promise<void> {
  await authenticatedFetchVoid("/api/delete-items-by-id", {
    method: "DELETE",
    body: JSON.stringify({ id: listId }),
  });
}

export async function batchCreateItems(
  listItems: Partial<Omit<ListItem, "id">>[]
): Promise<void> {
  await authenticatedFetchVoid("/api/create-many-items", {
    method: "POST",
    body: JSON.stringify({ listItems }),
  });
}

export async function batchUpdateItems(
  listItems: Partial<Omit<ListItem, "id" | "userId" | "createdAt">>[],
  isCompleting = false
): Promise<void> {
  await authenticatedFetchVoid("/api/update-many-items", {
    method: "PUT",
    body: JSON.stringify({ listItems, isCompleting }),
  });
}
