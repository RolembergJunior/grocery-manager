import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { ListItem } from "@/app/type";
import { batchUpdateItems } from "@/lib/helpers/list-items-helpers";

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
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { listItems, isCompleting } = body as {
      listItems?: ListItem[];
      isCompleting?: boolean;
    };

    // Suporte para formato antigo (array direto) e novo (objeto com listItems)
    const items = listItems || (Array.isArray(body) ? body : []);

    if (!items.length) {
      return NextResponse.json(
        { error: "It's necessary to send a list item list" },
        { status: 400 }
      );
    }

    // Se estiver finalizando, resetar checked e atualizar updatedAt
    if (isCompleting) {
      const now = new Date().toISOString();
      const resetItems = items.map((item) => ({
        ...item,
        checked: false,
        updatedAt: now,
      }));
      await batchUpdateItems(resetItems);
    } else {
      await batchUpdateItems(items);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating list items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
