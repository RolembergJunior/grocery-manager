import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { ListItem } from "@/app/type";
import { batchCreateItems } from "@/lib/helpers/list-items-helpers";

export async function POST(req: NextRequest) {
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

    const { listItems } = body as {
      listItems: ListItem[];
    };

    if (!listItems.length) {
      return NextResponse.json(
        { error: "It's necessary to send a list item list" },
        { status: 400 }
      );
    }

    await batchCreateItems(listItems);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error creating list items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
