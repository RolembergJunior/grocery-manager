"use server";

import type { ListItem } from "@/app/type";
import { auth } from "@/auth";

export async function getListItems(listId?: string): Promise<ListItem[]> {
  const session = await auth();

  if (!session?.user) return [];

  const url = listId
    ? `${process.env.NEXTAUTH_URL}/api/list-items?userId=${
        session.user.id as string
      }&listId=${listId}`
    : `${process.env.NEXTAUTH_URL}/api/list-items?userId=${
        session.user.id as string
      }`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) return [];

  const data = (await res.json()) as { listItems: ListItem[] };
  return Array.isArray(data.listItems) ? data.listItems : [];
}

interface CreateListItemProps {
  listId: string;
  itemId: string | null;
  name: string;
  category: string;
  unit: string;
  neededQuantity: number;
  boughtQuantity?: number;
  observation?: string | null;
  checked: boolean;
  isRemoved: boolean;
  fromList: "inventory" | "created";
}

export async function createListItem(
  newItem: CreateListItemProps
): Promise<ListItem | { error: string }> {
  const session = await auth();

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/list-items?userId=${
      session.user.id as string
    }`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(newItem),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to create list item: ${res.status}`);
  }

  const data = (await res.json()) as { listItem: ListItem };
  return data.listItem;
}

export async function updateListItem(
  id: string,
  updates: Partial<ListItem>
): Promise<ListItem | { error: string }> {
  const session = await auth();

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/list-items?userId=${
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
    throw new Error(`Failed to update list item: ${res.status}`);
  }

  const data = (await res.json()) as { listItem: ListItem };
  return data.listItem;
}

export async function deleteListItem(
  id: string
): Promise<void | { error: string }> {
  const session = await auth();

  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/list-items?userId=${
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
    throw new Error(`Failed to delete list item: ${res.status}`);
  }
}

export async function deleteItemsByListId(listId: string): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    return;
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/delete-items-by-id?userId=${
      session.user.id as string
    }`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: listId }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to delete list items: ${res.status}`);
  }
}

export async function updateMany(
  listItems: ListItem[],
  isCompleting = false
): Promise<void | { error: string } | { ok: true }> {
  const session = await auth();

  if (!session?.user) return;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/update-many-items?userId=${
      session.user.id as string
    }`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ listItems, isCompleting }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update list items: ${res.status}`);
  }

  return { ok: true };
}

// Alias for updateMany to match the plan's naming convention
export const batchUpdateItems = updateMany;
