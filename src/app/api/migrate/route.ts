import { NextRequest, NextResponse } from "next/server";
import { migrateAllUsers } from "@/lib/migration-helper";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await migrateAllUsers(session.user.id);

    return NextResponse.json({
      success: result.success,
      migratedCount: result.migratedCount,
      errors: result.errors,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
