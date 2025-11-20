import { updateProduct } from "@/lib/helpers/products-helpers";
import { NextResponse } from "next/server";

export const INVENTORY_LIST_ID = "inventory-list";

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json(
      { error: "userId é obrigatório" },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }

  const payload = body as { id: string; statusCompra: number };

  if (!payload.id || !payload.statusCompra) {
    return NextResponse.json(
      { error: "id e statusCompra são obrigatórios" },
      { status: 400 }
    );
  }

  await updateProduct(payload.id, {
    statusCompra: payload.statusCompra,
  });

  return NextResponse.json({ status: 200 });
}
