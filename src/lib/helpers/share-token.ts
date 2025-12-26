import "server-only";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getSecretKey(): Buffer {
  const secret = process.env.SHARE_TOKEN_SECRET;
  if (!secret || secret.length !== 64) {
    throw new Error(
      "SHARE_TOKEN_SECRET must be a 64-character hex string (32 bytes)"
    );
  }
  return Buffer.from(secret, "hex");
}

export interface ShareTokenPayload {
  userId: string;
  listId: string;
  createdAt: number;
}

export function generateShareToken(userId: string, listId: string): string {
  const payload: ShareTokenPayload = {
    userId,
    listId,
    createdAt: Date.now(),
  };

  const iv = crypto.randomBytes(16);
  const key = getSecretKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(JSON.stringify(payload), "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  const token = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, "base64"),
  ]).toString("base64url");

  return token;
}

export function decryptShareToken(token: string): ShareTokenPayload | null {
  try {
    const data = Buffer.from(token, "base64url");

    if (data.length < 33) {
      return null;
    }

    const iv = data.subarray(0, 16);
    const authTag = data.subarray(16, 32);
    const encrypted = data.subarray(32);

    const key = getSecretKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(
      encrypted.toString("base64"),
      "base64",
      "utf8"
    );
    decrypted += decipher.final("utf8");

    return JSON.parse(decrypted) as ShareTokenPayload;
  } catch {
    return null;
  }
}
