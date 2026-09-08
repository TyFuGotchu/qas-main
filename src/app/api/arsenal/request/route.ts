import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import { SUPPORT_EMAIL } from "@/lib/support";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const raw = body as Record<string, unknown>;
  const firm = typeof raw.firm === "string" ? raw.firm.trim() : "";
  const contact = typeof raw.contact === "string" ? raw.contact.trim() : "";
  if (!firm || !contact) {
    return NextResponse.json({ error: "Firm and contact are required" }, { status: 400 });
  }

  const lines = [
    `Firm: ${firm}`,
    `Site: ${typeof raw.site === "string" ? raw.site : ""}`,
    `Contact: ${contact}`,
    `Platforms: ${typeof raw.platforms === "string" ? raw.platforms : ""}`,
    `Rules URL: ${typeof raw.rulesUrl === "string" ? raw.rulesUrl : ""}`,
    `Modules: ${typeof raw.modules === "string" ? raw.modules : ""}`,
    `Volume: ${typeof raw.volume === "string" ? raw.volume : ""}`,
  ].join("\n");

  await sendEmail({
    to: SUPPORT_EMAIL,
    subject: `Arsenal request — ${firm}`,
    html: `<pre>${lines.replace(/</g, "&lt;")}</pre>`,
    text: lines,
  });

  return NextResponse.json({ ok: true });
}
