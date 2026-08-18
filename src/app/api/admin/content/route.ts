import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import {
  getLocalizedSiteContent,
  saveLocalizedSiteContent,
} from "@/lib/cms/store";
import type { LocalizedSiteContent, SiteContent } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

function isLocalizedBody(body: unknown): body is LocalizedSiteContent {
  return (
    !!body &&
    typeof body === "object" &&
    "ar" in body &&
    "en" in body
  );
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await getLocalizedSiteContent();
  return NextResponse.json(content);
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (isLocalizedBody(body)) {
    await saveLocalizedSiteContent({ ar: body.ar, en: body.en });
    return NextResponse.json({ ok: true });
  }
  // Legacy: single-locale payload updates Arabic only
  const current = await getLocalizedSiteContent();
  await saveLocalizedSiteContent({
    ...current,
    ar: body as SiteContent,
  });
  return NextResponse.json({ ok: true });
}
