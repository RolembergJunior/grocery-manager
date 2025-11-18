"use server";

import type { ListItem, Product } from "@/app/type";
import { auth } from "@/auth";

/**
 * Helper to build sync inventory URL with optional listId
 */
function buildSyncUrl(userId: string, listId?: string): string {
  const url = new URL(`${process.env.NEXTAUTH_URL}/api/sync-inventory-list`);
  url.searchParams.set("userId", userId);
  if (listId) {
    url.searchParams.set("listId", listId);
  }
  return url.toString();
}

/**
 * Sincroniza a lista de estoque com os produtos do inventário
 * Clona produtos que precisam ser comprados (statusCompra === 1) como ListItems
 * @param products - Array de produtos para sincronizar
 * @param listId - ID da lista específica (opcional). Se não fornecido, sincroniza lista geral
 */
export async function syncInventoryListAPI(
  products: Product[],
  listId?: string
): Promise<ListItem[]> {
  const session = await auth();

  if (!session?.user) return [];

  const url = buildSyncUrl(session.user.id as string, listId);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ products }),
  });

  if (!res.ok) return [];

  const data = (await res.json()) as { listItems: ListItem[] };
  return Array.isArray(data.listItems) ? data.listItems : [];
}

/**
 * @deprecated Use syncInventoryListAPI instead
 * Kept for backward compatibility
 */
export async function syncInventoryList(
  products: Product[]
): Promise<ListItem[]> {
  return syncInventoryListAPI(products);
}

/**
 * Atualiza os produtos do inventário baseado nos ListItems da lista de estoque
 * Sincroniza mudanças de volta para o inventário
 */
export async function updateInventoryFromListAPI(
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
