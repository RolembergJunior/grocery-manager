import "server-only";
import { NextRequest, NextResponse } from "next/server";
import type { List } from "@/app/type";
import {
  getListsByUserId,
  createList,
  updateList,
  softDeleteList,
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

    const lists = await getListsByUserId(userId, false);
    return NextResponse.json({ lists });
  } catch (error) {
    console.error("Error fetching lists:", error);
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

    const { name, description, resetAt, itemId } = body as {
      name: string;
      description: string;
      resetAt?: string;
      itemId?: string[];
    };

    if (!name) {
      return NextResponse.json(
        { error: "name é obrigatório" },
        { status: 400 }
      );
    }

    const listData: Omit<List, "id"> = {
      name,
      description: description || "",
      resetAt: resetAt ? new Date(resetAt) : new Date(),
      isRemoved: false,
      userId,
      itemId: itemId || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const list = await createList(listData);
    return NextResponse.json({ list }, { status: 201 });
  } catch (error) {
    console.error("Error creating list:", error);
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

    const { id, name, description, resetAt, itemId } = body as {
      id: string;
      name?: string;
      description?: string;
      resetAt?: string;
      itemId?: string[];
    };

    const updateData: Partial<
      Omit<List, "id" | "userId" | "createdAt" | "updatedAt">
    > = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (resetAt !== undefined) updateData.resetAt = new Date(resetAt);
    if (itemId !== undefined) updateData.itemId = itemId;

    await updateList(id, updateData);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating list:", error);
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
    await softDeleteList(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting list:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
