import { NextRequest, NextResponse } from "next/server";
import { getUidFromBearer } from "@/lib/auth-server";
import { accountExists } from "@/lib/helpers/account-helpers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const auth = await getUidFromBearer(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exists = await accountExists(auth.uid);
    if (!exists) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({ exists: true, email: auth.email });
  } catch (error: any) {
    console.error("Error verifying account:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
