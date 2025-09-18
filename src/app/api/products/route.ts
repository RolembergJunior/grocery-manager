import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import type { Item, Products } from "@/app/type";
import { requireSessionUserId } from "@/lib/auth-server";

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

    // try {
    //   await requireSessionUserId(userId);
    // } catch {
    //   return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    // }

    const ref = adminDb.collection("users").doc(userId);
    const snap = await ref.get();
    const data = snap.data() as { products?: Item[] } | undefined;

    return NextResponse.json({ products: data?.products ?? [] });
  } catch {
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

    const { products } = body as { products: Products };
    const ref = adminDb.collection("users").doc(userId);
    await ref.set({ products }, { merge: true });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
