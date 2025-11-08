import "server-only";
import { NextRequest, NextResponse } from "next/server";
import type { ListItem } from "@/app/type";
import {
  getListItemsByListId,
  getListItemsByUserId,
  createListItem,
  updateListItem,
  softDeleteListItem,
} from "@/lib/firestore-helpers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const listId = searchParams.get("listId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    let listItems: ListItem[];

    if (listId) {
      listItems = await getListItemsByListId(listId, false);
    } else {
      listItems = await getListItemsByUserId(userId, false);
    }

    return NextResponse.json({ listItems });
  } catch (error) {
    console.error("Error fetching list items:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const { listId, itemId, neededQuantity, checked } = body as {
      listId: string;
      itemId: string[];
      neededQuantity: number;
      checked?: boolean;
    };

    if (!listId || !itemId || neededQuantity === undefined) {
      return NextResponse.json(
        { error: "listId, itemId e neededQuantity são obrigatórios" },
        { status: 400 }
      );
    }

    const listItemData: Omit<ListItem, "id"> = {
      listId,
      itemId,
      neededQuantity,
      checked: checked || false,
      isRemoved: false,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const listItem = await createListItem(listItemData);
    return NextResponse.json({ listItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating list item:", error);
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
    if (!body || typeof body !== "object" || !("id" in body)) {
      return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
    }

    const { id, itemId, neededQuantity, checked } = body as {
      id: string;
      itemId?: string[];
      neededQuantity?: number;
      checked?: boolean;
    };

    const updateData: Partial<
      Omit<ListItem, "id" | "userId" | "createdAt" | "updatedAt">
    > = {};
    if (itemId !== undefined) updateData.itemId = itemId;
    if (neededQuantity !== undefined)
      updateData.neededQuantity = neededQuantity;
    if (checked !== undefined) updateData.checked = checked;

    await updateListItem(id, updateData);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating list item:", error);
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
    await softDeleteListItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting list item:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
