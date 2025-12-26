import { NextRequest, NextResponse } from "next/server";
import { decryptShareToken } from "@/lib/helpers/share-token";
import { adminDb } from "@/lib/firebaseAdmin";
import { COLLECTIONS, withTimestamps } from "@/lib/helpers/constants";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const payload = decryptShareToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: 401 }
      );
    }

    const { userId, listId } = payload;
    const { itemId, checked } = await req.json();

    if (!itemId || typeof checked !== "boolean") {
      return NextResponse.json(
        { error: "itemId e checked são obrigatórios" },
        { status: 400 }
      );
    }

    const itemQuery = adminDb
      .collection(COLLECTIONS.LIST_ITEMS)
      .where("userId", "==", userId)
      .where("listId", "==", listId)
      .where("id", "==", itemId);

    const itemSnapshot = await itemQuery.get();

    if (itemSnapshot.empty) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 }
      );
    }

    const updateData = withTimestamps({ checked }, true);
    await itemSnapshot.docs[0].ref.update(updateData);

    return NextResponse.json({ success: true, checked });
  } catch (error) {
    console.error("Error toggling item:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar item" },
      { status: 500 }
    );
  }
}
