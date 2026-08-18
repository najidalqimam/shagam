import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  COOKIE,
  createAdminToken,
  verifyAdminPassword,
} from "@/lib/cms/auth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: string };
  if (!verifyAdminPassword(String(body.password ?? ""))) {
    return NextResponse.json(
      { ok: false, error: "كلمة المرور غير صحيحة" },
      { status: 401 },
    );
  }

  const token = createAdminToken();
  const options = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  };
  const jar = await cookies();
  jar.set(COOKIE, token, options);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, options);
  return res;
}
