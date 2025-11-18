import { getProduct, updateProduct } from "@/lib/helpers/products-helpers";
import {
  createListItem,
  getListItemsByItemId,
  updateListItem,
} from "@/lib/helpers/list-items-helpers";
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

  const refferedListItem = await getListItemsByItemId(payload.id);

  await updateProduct(payload.id, {
    statusCompra: payload.statusCompra,
  });

  if (refferedListItem.length) {
    await updateListItem(refferedListItem[0].id, {
      isRemoved: payload.statusCompra === 1 ? false : true,
    });
  } else if (payload.statusCompra === 1) {
    const product = await getProduct(payload.id);

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    await createListItem({
      name: product.name,
      listId: INVENTORY_LIST_ID,
      itemId: payload.id,
      category: product.category,
      neededQuantity: product.neededQuantity || 0,
      boughtQuantity: 0,
      unit: product.unit,
      observation: product?.observation || "",
      checked: false,
      isRemoved: false,
      fromList: "inventory",
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return NextResponse.json({ status: 200 });
}
