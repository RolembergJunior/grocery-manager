import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "./firebaseAdmin";

const SESSION_COOKIE = "firebase-session";

export async function getUidFromSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded.uid;
  } catch {
    return null;
  }
}

export async function requireSessionUid(): Promise<string> {
  const uid = await getUidFromSession();
  if (!uid) throw new Error("Não autorizado");
  return uid;
}

/**
 * Resolves the caller's UID from either a Firebase ID token (mobile, which has
 * no cookies) or the session cookie (web). Never trust a uid from the body.
 */
export async function requireUidFromRequest(request: Request): Promise<string> {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const idToken = authHeader.slice("Bearer ".length).trim();
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      return decoded.uid;
    } catch {
      throw new Error("Não autorizado");
    }
  }

  return requireSessionUid();
}
