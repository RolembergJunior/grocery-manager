import { NextRequest, NextResponse } from "next/server";
import { decryptShareToken } from "@/lib/helpers/share-token";
import { adminDb } from "@/lib/firebaseAdmin";
import { COLLECTIONS } from "@/lib/helpers/constants";

export async function GET(
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

    const listQuery = adminDb
      .collection(COLLECTIONS.LISTS)
      .where("userId", "==", userId)
      .where("id", "==", listId);

    const listSnapshot = await listQuery.get();

    if (listSnapshot.empty) {
      return NextResponse.json(
        { error: "Lista não encontrada" },
        { status: 404 }
      );
    }

    const list = listSnapshot.docs[0].data();

    const itemsQuery = adminDb
      .collection(COLLECTIONS.LIST_ITEMS)
      .where("userId", "==", userId)
      .where("listId", "==", listId)
      .where("isRemoved", "==", false);

    const itemsSnapshot = await itemsQuery.get();
    const items = itemsSnapshot.docs.map((doc) => doc.data());

    const categoriesQuery = adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .where("userId", "==", userId)
      .where("isRemoved", "==", false);

    const categoriesSnapshot = await categoriesQuery.get();
    const categories = categoriesSnapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ list, items, categories });
  } catch (error) {
    console.error("Error fetching shared list:", error);
    return NextResponse.json(
      { error: "Erro ao buscar lista compartilhada" },
      { status: 500 }
    );
  }
}
