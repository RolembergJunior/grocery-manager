import "server-only";
import { NextRequest, NextResponse } from "next/server";
import type { Category } from "@/app/type";
import {
  getCategoriesByUserId,
  createCategory,
  updateCategory,
  softDeleteCategory,
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

    const categories = await getCategoriesByUserId(userId, false);
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
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

    const { name, colorId } = body as { name: string; colorId: number };

    if (!name || colorId === undefined) {
      return NextResponse.json(
        { error: "name e colorId são obrigatórios" },
        { status: 400 }
      );
    }

    const categoryData: Omit<Category, "id"> = {
      name,
      colorId,
      isRemoved: false,
      userId,
    };

    const category = await createCategory(categoryData);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
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

    const { id, name, colorId } = body as {
      id: string;
      name?: string;
      colorId?: number;
    };

    const updateData: Partial<Omit<Category, "id" | "userId">> = {};
    if (name !== undefined) updateData.name = name;
    if (colorId !== undefined) updateData.colorId = colorId;

    await updateCategory(id, updateData);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating category:", error);
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
    await softDeleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
