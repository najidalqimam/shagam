"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  COOKIE,
  createAdminToken,
  verifyAdminPassword,
} from "@/lib/cms/auth";

export type LoginState = { error: string };

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminPassword(password)) {
    return { error: "كلمة المرور غير صحيحة" };
  }

  const jar = await cookies();
  jar.set(COOKIE, createAdminToken(), cookieOptions());
  redirect("/admin");
}
