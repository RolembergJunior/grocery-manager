"use server";

import type { Product } from "@/app/type";
import { authenticatedFetchVoid, authenticatedFetch } from "@/lib/api-helper";
import { syncInventoryListAPI } from "./inventory-list";

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

export async function updateOrCreate(item: Product): Promise<Product> {
  const updatedProduct = await authenticatedFetch<Product>(
    "/api/update-or-create",
    {
      method: "PUT",
      body: JSON.stringify(item),
    }
  );

  await syncInventoryListAPI([updatedProduct], "inventory-list");

  return updatedProduct;
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
