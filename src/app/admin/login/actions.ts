"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COOKIE, adminCookieOptions } from "@/lib/cms/auth";
import { LaravelApiError, laravelJson } from "@/lib/cms/laravel";

export type LoginState = { error: string };

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  try {
    const data = await laravelJson<{ ok: boolean; token: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    const jar = await cookies();
    jar.set(COOKIE, data.token, adminCookieOptions());
  } catch (error) {
    if (error instanceof LaravelApiError && error.status === 401) {
      return { error: "كلمة المرور غير صحيحة" };
    }
    return { error: "تعذر الاتصال بخادم التحكم. شغّل Laravel على المنفذ 8000." };
  }

  redirect("/admin");
}
