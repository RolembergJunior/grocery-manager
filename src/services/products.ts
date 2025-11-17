"use server";

import type { Product } from "@/app/type";
import { auth } from "@/auth";

export async function subscribeProducts(): Promise<Product[]> {
  const session = await auth();

  if (!session?.user) return [];

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/products?userId=${
      session.user.id as string
    }`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) return [];

  const data = (await res.json()) as { products: Product[] };
  const products = Array.isArray(data.products) ? data.products : [];
  return products;
}

export async function saveProducts(
  products: Product[]
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
  item: Product
): Promise<void | { error: string } | Product> {
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

  const data = (await res.json()) as Product;

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

export async function updateStatus({
  id,
  statusCompra,
}: {
  id: string;
  statusCompra: number;
}): Promise<void | { error: string } | { ok: true }> {
  const session = await auth();

  if (!session?.user) return;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/update-status-compra?userId=${
      session.user.id as string
    }`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, statusCompra }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update item to status: ${res.status}`);
  }

  return { ok: true };
}

export async function updateMany(
  products: Product[]
): Promise<void | { error: string } | { ok: true }> {
  const session = await auth();

  if (!session?.user) return;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/update-many-products?userId=${
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
    throw new Error(`Failed to update products: ${res.status}`);
  }

  return { ok: true };
}
