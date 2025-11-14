import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { hardDeleteListItemsById } from "@/lib/firestore-helpers";

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

    const payload = body as {
      id: string;
    };

    if (!payload.id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });
    }

    await hardDeleteListItemsById(payload.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting list items:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
