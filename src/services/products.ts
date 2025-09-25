"use server";

import type { Item, Products } from "@/app/type";
import { auth } from "@/auth";

export async function subscribeProducts({
  signal,
}: {
  signal: AbortSignal;
}): Promise<Products> {
  const session = await auth();

  if (!session?.user) return [];

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/products?userId=${
      session.user.id as string
    }`,
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
    `${process.env.NEXTAUTH_URL}/api/products?userId=${
      session.user.id as string
    }`,
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
    `${process.env.NEXTAUTH_URL}/api/update-or-create?userId=${
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

  const data = (await res.json()) as Item;

  return data;
}

export async function deleteItem(
  id: string
): Promise<void | { error: string } | { ok: true }> {
  const session = await auth();

  if (!session?.user) return;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/products?userId=${
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
    throw new Error(`Failed to delete: ${res.status}`);
  }

  return { ok: true };
}
