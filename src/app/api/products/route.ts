import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import type { Product } from "@/app/type";
import {
  getProductsByUserId,
  softDeleteProduct,
} from "@/lib/firestore-helpers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    const products = await getProductsByUserId(userId, false);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

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
    if (!body || typeof body !== "object" || !("products" in body)) {
      return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
    }

    const { products } = body as { products: Product[] };

    const batch = adminDb.batch();

    for (const item of products) {
      const productData: Omit<Product, "id"> = {
        name: item.name,
        currentQuantity: item.currentQuantity,
        neededQuantity: item.neededQuantity,
        unit: item.unit,
        category: item.category,
        statusCompra: item.statusCompra,
        observation: item.observation || "",
        isRemoved: item.isRemoved || 0,
        userId: userId,
        reccurency: item.reccurency,
        createdAt: item.createdAt,
        updatedAt: new Date(),
      };

      if (item.id) {
        const docRef = adminDb.collection("products").doc(item.id);
        batch.update(docRef, productData);
      } else {
        const docRef = adminDb.collection("products").doc();
        batch.set(docRef, { ...productData, id: docRef.id });
      }
    }

    await batch.commit();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating products:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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
    if (!body || typeof body !== "object" || !("id" in body)) {
      return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
    }

    const { id } = body as { id: string };

    await softDeleteProduct(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
