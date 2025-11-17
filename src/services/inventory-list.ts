"use server";

import type { ListItem, Product } from "@/app/type";
import { auth } from "@/auth";

/**
 * Sincroniza a lista de estoque com os produtos do inventário
 * Clona produtos que precisam ser comprados (statusCompra === 1) como ListItems
 */
export async function syncInventoryList(
  products: Product[]
): Promise<ListItem[]> {
  const session = await auth();

  if (!session?.user) return [];

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/sync-inventory-list?userId=${
      session.user.id as string
    }`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ products }),
    }
  );

  if (!res.ok) return [];

  const data = (await res.json()) as { listItems: ListItem[] };
  return Array.isArray(data.listItems) ? data.listItems : [];
}

/**
 * Sincroniza uma lista específica com os produtos do inventário
 */
export async function syncInventoryListAPI(
  listId: string,
  products: Product[]
): Promise<ListItem[]> {
  const session = await auth();

  if (!session?.user) return [];

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/sync-inventory-list?userId=${
      session.user.id as string
    }&listId=${listId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ products }),
    }
  );

  if (!res.ok) return [];

  const data = (await res.json()) as { listItems: ListItem[] };
  return Array.isArray(data.listItems) ? data.listItems : [];
}

/**
 * Atualiza os produtos do inventário baseado nos ListItems da lista de estoque
 * Sincroniza mudanças de volta para o inventário
 */
export async function updateInventoryFromList(
  listItems: ListItem[]
): Promise<{ ok: boolean }> {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Não autenticado");
  }

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/update-inventory-from-list?userId=${
      session.user.id as string
    }`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ listItems }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update inventory: ${res.status}`);
  }

  return { ok: true };
}

// Alias for updateInventoryFromList to match the plan's naming convention
export const updateInventoryFromListAPI = updateInventoryFromList;
