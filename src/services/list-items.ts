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
  itemId: string[];
  name: string;
  category: string;
  unit: string;
  neededQuantity: number;
  checked: boolean;
  isRemoved: boolean;
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
  updates: {
    itemId?: string[];
    neededQuantity?: number;
    checked?: boolean;
  }
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
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, ...updates }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update list item: ${res.status}`);
  }
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
