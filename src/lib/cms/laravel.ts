import { cookies } from "next/headers";

export const COOKIE = "shagam_admin";

export function laravelApiUrl() {
  return (process.env.LARAVEL_API_URL || "http://127.0.0.1:8000/api").replace(
    /\/$/,
    "",
  );
}

export class LaravelApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`Laravel API ${status}: ${body.slice(0, 240)}`);
    this.name = "LaravelApiError";
  }
}

export async function getAdminToken() {
  const jar = await cookies();
  return jar.get(COOKIE)?.value ?? "";
}

export async function laravelFetch(
  path: string,
  init: RequestInit & { admin?: boolean } = {},
): Promise<Response> {
  const { admin, ...rest } = init;
  const url = `${laravelApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(rest.headers);
  headers.set("Accept", "application/json");
  if (admin) {
    const token = await getAdminToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  if (
    rest.body &&
    !(rest.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, { ...rest, headers, cache: "no-store" });
}

export async function laravelJson<T>(
  path: string,
  init: RequestInit & { admin?: boolean } = {},
): Promise<T> {
  const res = await laravelFetch(path, init);
  const text = await res.text();
  if (!res.ok) {
    throw new LaravelApiError(res.status, text);
  }
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}
