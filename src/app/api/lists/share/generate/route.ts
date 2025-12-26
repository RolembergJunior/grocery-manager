import { NextRequest, NextResponse } from "next/server";
import { generateShareToken } from "@/lib/helpers/share-token";
import { adminDb } from "@/lib/firebaseAdmin";
import { COLLECTIONS } from "@/lib/helpers/constants";

export async function POST(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const { listId } = await req.json();

    if (!userId || !listId) {
      return NextResponse.json(
        { error: "userId e listId são obrigatórios" },
        { status: 400 }
      );
    }

    const token = generateShareToken(userId, listId);

    const query = adminDb
      .collection(COLLECTIONS.LISTS)
      .where("userId", "==", userId)
      .where("id", "==", listId);

    const snapshot = await query.get();

    snapshot.docs[0].ref.update({ shareToken: token });

    return NextResponse.json({ shareToken: token });
  } catch (error) {
    console.error("Error generating share token:", error);
    return NextResponse.json(
      { error: "Erro ao gerar token de compartilhamento" },
      { status: 500 }
    );
  }
}
