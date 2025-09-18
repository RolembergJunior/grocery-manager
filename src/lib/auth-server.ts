import "server-only";
import { auth } from "@/auth";

function extractUserId(session: any): string | null {
  return (session?.user as any)?.id || session?.user?.email || null;
}

export async function requireSessionUserId(
  expectedUserId: string
): Promise<string> {
  const session = await auth();
  const sessionUserId = extractUserId(session);
  if (!session || !sessionUserId || sessionUserId !== expectedUserId) {
    throw new Error("Não autorizado");
  }
  return sessionUserId;
}
