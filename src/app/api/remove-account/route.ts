import { NextRequest, NextResponse } from "next/server";
import { getUidFromBearer, SESSION_COOKIE } from "@/lib/auth-server";
import { deleteAccount } from "@/lib/helpers/account-helpers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const auth = await getUidFromBearer(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { existed } = await deleteAccount(auth.uid);
    if (!existed) {
      return NextResponse.json({ error: "account_not_found" }, { status: 404 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  } catch (error: any) {
    console.error("Error removing account:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
