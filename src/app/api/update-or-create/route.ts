import { Item } from "@/app/type";
import { adminDb } from "@/lib/firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

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

    const payload = body as Item;
    const ref = adminDb.collection("users").doc(userId);

    const snapshot = await ref.get();
    const data = snapshot.data() || {};
    const products = (data.products || []) as Item[];

    const index = products.findIndex((p) => p.id === payload.id);
    if (index >= 0) {
      products[index] = { ...products[index], ...payload };
    } else {
      products.push(payload);
    }

    await ref.update({ products });

    return NextResponse.json({ ...products[index] }, { status: 200 });
  } catch (err) {
    console.error("Erro no PUT /products:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
