import { cookies } from "next/headers";

import { COOKIE, laravelJson } from "./laravel";

const WEEK_SECONDS = 7 * 24 * 60 * 60;

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: WEEK_SECONDS,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  try {
    const data = await laravelJson<{ authenticated?: boolean }>("/admin/session", {
      admin: true,
    });
    return data.authenticated === true;
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    throw new Error("UNAUTHORIZED");
  }
}

export { COOKIE };
