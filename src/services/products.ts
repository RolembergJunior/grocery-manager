"use server";

import type { Product } from "@/app/type";
import {
  authenticatedFetchArray,
  authenticatedFetchVoid,
  authenticatedFetch,
} from "@/lib/api-helper";

export async function subscribeProducts(): Promise<Product[]> {
  try {
    const data = await authenticatedFetch<{ products: Product[] }>(
      "/api/products",
      {
        method: "GET",
      }
    );

    if (!data) return [];

    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  await authenticatedFetchVoid("/api/products", {
    method: "PUT",
    body: JSON.stringify({ products }),
  });
}

export async function updateOrCreate(item: Product): Promise<Product> {
  return authenticatedFetch<Product>("/api/update-or-create", {
    method: "PUT",
    body: JSON.stringify(item),
  });
}

export async function deleteItem(id: string): Promise<{ ok: true }> {
  await authenticatedFetchVoid("/api/products", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  return { ok: true };
}

export async function updateStatus({
  id,
  statusCompra,
}: {
  id: string;
  statusCompra: number;
}): Promise<{ ok: true }> {
  await authenticatedFetchVoid("/api/update-status-compra", {
    method: "PUT",
    body: JSON.stringify({ id, statusCompra }),
  });
  return { ok: true };
}

export async function updateMany(products: Product[]): Promise<{ ok: true }> {
  await authenticatedFetchVoid("/api/update-many-products", {
    method: "PUT",
    body: JSON.stringify({ products }),
  });
  return { ok: true };
}

export async function syncronizeInventory(): Promise<{ ok: true }> {
  await authenticatedFetchVoid("/api/sync-inventory-list", {
    method: "PUT",
    body: JSON.stringify({}),
  });
  return { ok: true };
}
