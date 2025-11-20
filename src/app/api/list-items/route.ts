import "server-only";
import { NextRequest, NextResponse } from "next/server";
import type { ListItem } from "@/app/type";
import {
  getListItemsByListId,
  getListItemsByUserId,
  createListItem,
  updateListItem,
  softDeleteListItem,
  getListItemById,
} from "@/lib/helpers/list-items-helpers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const listId = searchParams.get("listId");
    const includeRemoved = searchParams.get("includeRemoved") || false;

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    let listItems: ListItem[];

    listItems = await getListItemsByUserId(userId, !!includeRemoved);

    if (listId) {
      listItems = listItems.filter((item) => item.listId === listId);
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

    const payload = body as ListItem;

    if (!payload.listId) {
      return NextResponse.json(
        { error: "listId é obrigatório" },
        { status: 400 }
      );
    }

    const listItemData: Omit<ListItem, "id"> = {
      ...payload,
      isRemoved: false,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

    const payload = body as ListItem;

    const updateData: Partial<Omit<ListItem, "id" | "userId" | "createdAt">> = {
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    await updateListItem(payload.id, updateData);
    const getItem = await getListItemById(payload.id);
    return NextResponse.json({ listItem: getItem });
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
