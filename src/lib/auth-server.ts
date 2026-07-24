import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "./firebaseAdmin";

export const SESSION_COOKIE = "firebase-session";

export async function getUidFromBearer(
  req: Request,
): Promise<{ uid: string; email?: string } | null> {
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(
      authorization.slice("Bearer ".length),
    );
    return { uid: decoded.uid, email: decoded.email };
  } catch {
    return null;
  }
}

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
