import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE, adminCookieOptions } from "@/lib/cms/auth";
import { LaravelApiError, laravelJson } from "@/lib/cms/laravel";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    password?: string;
    email?: string;
  };

  try {
    const data = await laravelJson<{ ok: boolean; token: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({
        password: String(body.password ?? ""),
        email: body.email,
      }),
    });

    const options = adminCookieOptions();
    const jar = await cookies();
    jar.set(COOKIE, data.token, options);

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, data.token, options);
    return res;
  } catch (error) {
    if (error instanceof LaravelApiError && error.status === 401) {
      return NextResponse.json(
        { ok: false, error: "كلمة المرور غير صحيحة" },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "تعذر الاتصال بالخادم" },
      { status: 502 },
    );
  }
}
