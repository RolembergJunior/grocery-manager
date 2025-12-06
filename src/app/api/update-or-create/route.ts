import { Product } from "@/app/type";
import { NextRequest, NextResponse } from "next/server";
import {
  createProduct,
  getProduct,
  updateProduct,
} from "@/lib/helpers/products-helpers";

export async function PUT(req: NextRequest) {
  try {
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

    const payload = body as Product;

    const now = new Date().toISOString();

    if (payload.id) {
      const refferecedProduct = await getProduct(payload.id);

      const updatedProduct: Product = {
        ...refferecedProduct,
        ...payload,
        updatedAt: now,
      };

      await updateProduct(payload.id, updatedProduct);

      return NextResponse.json(updatedProduct, { status: 200 });
    } else {
      const newProductData: Omit<Product, "id"> = {
        ...payload,
        userId: userId,
        isRemoved: 0,
        reccurency: null,
        createdAt: now,
        updatedAt: now,
      };

      const createdProduct = await createProduct(newProductData);

      return NextResponse.json(createdProduct, { status: 200 });
    }
  } catch (err) {
    console.error("Erro no PUT /update-or-create:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
