import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import {
  getLocalizedSettings,
  saveLocalizedSettings,
} from "@/lib/cms/store";
import type { LocalizedSiteSettings, SiteSettings } from "@/lib/cms/types";

function isLocalizedBody(body: unknown): body is LocalizedSiteSettings {
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
  return NextResponse.json(await getLocalizedSettings());
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (isLocalizedBody(body)) {
    await saveLocalizedSettings({ ar: body.ar, en: body.en });
    return NextResponse.json({ ok: true });
  }
  const current = await getLocalizedSettings();
  await saveLocalizedSettings({
    ...current,
    ar: body as SiteSettings,
  });
  return NextResponse.json({ ok: true });
}
