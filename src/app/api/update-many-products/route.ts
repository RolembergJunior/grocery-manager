import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/app/type";
import { batchUpdateProducts } from "@/lib/helpers/products-helpers";

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || !("products" in body)) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { products } = body as { products: Product[] };

    if (!products.length) {
      return NextResponse.json(
        { error: "It's necessary to send a product list" },
        { status: 400 }
      );
    }

    await batchUpdateProducts(products);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
