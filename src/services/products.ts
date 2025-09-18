"use server";

import type { Item, Products } from "@/app/type";
import { auth } from "@/auth";

const API_BASE = "/api/products";

export async function subscribeProducts({
  signal,
}: {
  signal: AbortSignal;
}): Promise<Products> {
  const session = await auth();

  if (!session?.user) return [];

  const res = await fetch(
    `http://localhost:3000/${API_BASE}?userId=${session.user.id as string}`,
    {
      method: "GET",
      credentials: "include",
      signal,
    }
  );

  if (!res.ok) return [];

  const data = (await res.json()) as { products: Item[] };
  const products = Array.isArray(data.products) ? data.products : [];
  return products as Products;
}

export async function saveProducts(
  products: Products
): Promise<void | { error: string }> {
  const session = await auth();

  if (!session?.user) return;

  const res = await fetch(
    `http://localhost:3000/${API_BASE}?userId=${session.user.id as string}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ products }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to save: ${res.status}`);
  }
}

export async function updateOrCreate(
  item: Item
): Promise<void | { error: string } | Item> {
  const session = await auth();

  if (!session?.user) return;

  const res = await fetch(
    `http://localhost:3000/api/update-or-create?userId=${
      session.user.id as string
    }`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(item),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to save: ${res.status}`);
  }

  const data = (await res.json()) as { item: Item };
  return data.item;
}
