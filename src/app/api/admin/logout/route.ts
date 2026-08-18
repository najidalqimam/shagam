import { NextResponse } from "next/server";
import { COOKIE, adminCookieOptions } from "@/lib/cms/auth";
import { laravelJson } from "@/lib/cms/laravel";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await laravelJson("/admin/logout", { method: "POST", admin: true });
  } catch {
    // Cookie is cleared either way.
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { ...adminCookieOptions(), maxAge: 0 });
  return res;
}
