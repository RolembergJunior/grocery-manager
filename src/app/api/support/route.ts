import { NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebaseAdmin";
import { COLLECTIONS } from "@/lib/helpers/constants";
import { getUidFromBearer } from "@/lib/auth-server";

const SUPPORT_EMAIL = "listaai.contato@gmail.com";

const TYPE_VALUES = ["bug", "doubt", "suggestion"] as const;
type SupportType = (typeof TYPE_VALUES)[number];

interface SupportBody {
  uid?: string;
  email?: string;
  name?: string;
  type?: string;
  screen?: string;
  message?: string;
  platform?: string;
  os?: string;
  appVersion?: string;
}

const TYPE_META: Record<SupportType, { label: string; color: string }> = {
  bug: { label: "Bug", color: "#EF4444" },
  doubt: { label: "Dúvida", color: "#3B82F6" },
  suggestion: { label: "Sugestão", color: "#22C55E" },
};

// User-supplied strings are embedded in the HTML email — escape to avoid injection.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface SupportEmailData {
  type: SupportType;
  screen: string;
  platform: string;
  os: string;
  appVersion: string;
  name: string;
  email: string;
  uid: string;
  message: string;
}

function buildSupportEmailHtml(data: SupportEmailData): string {
  const meta = TYPE_META[data.type];
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;color:#6B7280;font-size:13px;width:120px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:600;">${value}</td>
    </tr>`;

  return `
  <div style="background-color:#F3F4F6;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <div style="background-color:#6B9BD1;padding:20px 24px;">
        <div style="color:#FFFFFF;font-size:12px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;opacity:0.85;">ListaAí · Suporte</div>
        <div style="margin-top:8px;display:inline-block;">
          <span style="display:inline-block;background-color:${meta.color};color:#FFFFFF;font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;">${meta.label}</span>
          <span style="color:#FFFFFF;font-size:16px;font-weight:600;margin-left:8px;">${escapeHtml(data.screen)}</span>
        </div>
      </div>
      <div style="padding:24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${row("Plataforma", `${escapeHtml(data.platform)} / ${escapeHtml(data.os)}`)}
          ${row("Versão", escapeHtml(data.appVersion || "—"))}
          ${row("Nome", escapeHtml(data.name || "—"))}
          ${row("Email", escapeHtml(data.email || "—"))}
        </table>
        <div style="margin-top:20px;padding:16px;background-color:#F9FAFB;border-left:4px solid #6B9BD1;border-radius:8px;">
          <div style="color:#6B7280;font-size:12px;font-weight:600;text-transform:uppercase;margin-bottom:8px;">Mensagem</div>
          <div style="color:#111827;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
        </div>
        <div style="margin-top:20px;color:#9CA3AF;font-size:11px;">UID: ${escapeHtml(data.uid)}</div>
      </div>
    </div>
  </div>`;
}

export async function POST(request: Request) {
  try {
    const authResult = await getUidFromBearer(request);
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as SupportBody;
    const {
      email: bodyEmail = "",
      name = "",
      type,
      screen,
      message,
      platform = "",
      os = "",
      appVersion = "",
    } = body;

    const uid = authResult.uid;
    const email = authResult.email ?? bodyEmail;

    if (!type || !TYPE_VALUES.includes(type as SupportType)) {
      return NextResponse.json({ error: "invalid type" }, { status: 400 });
    }
    if (!screen) {
      return NextResponse.json({ error: "screen is required" }, { status: 400 });
    }
    const trimmed = (message ?? "").trim();
    if (trimmed.length < 10) {
      return NextResponse.json(
        { error: "message must be at least 10 characters" },
        { status: 400 },
      );
    }
    if (trimmed.length > 1000) {
      return NextResponse.json(
        { error: "message must be at most 1000 characters" },
        { status: 400 },
      );
    }

    await adminDb.collection(COLLECTIONS.SUPPORT_TICKETS).add({
      uid,
      email,
      name,
      type,
      screen,
      message: trimmed,
      platform,
      os,
      appVersion,
      status: "open",
      createdAt: new Date().toISOString(),
    });

    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (apiKey) {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: SUPPORT_EMAIL,
          subject: `[${TYPE_META[type as SupportType].label}] ${screen} — ${platform}/${os}`,
          text: [
            `Tipo: ${type}`,
            `Tela: ${screen}`,
            `Plataforma: ${platform} / ${os}`,
            `Versão do app: ${appVersion}`,
            `Nome: ${name}`,
            `Email: ${email}`,
            `UID: ${uid}`,
            ``,
            `Mensagem:`,
            trimmed,
          ].join("\n"),
          html: buildSupportEmailHtml({
            type: type as SupportType,
            screen: screen as string,
            platform,
            os,
            appVersion,
            name,
            email,
            uid,
            message: trimmed,
          }),
        });
      } else {
        console.warn("RESEND_API_KEY not set; skipping support email.");
      }
    } catch (emailError) {
      console.error("Error sending support email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error handling support request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
