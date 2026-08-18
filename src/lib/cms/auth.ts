import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "shagam_admin";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function password() {
  return process.env.ADMIN_PASSWORD || "shagam-admin";
}

function secret() {
  return process.env.ADMIN_SECRET || password();
}

export function verifyAdminPassword(input: string) {
  return input === password();
}

export function createAdminToken() {
  const exp = Date.now() + WEEK_MS;
  const payload = `admin:${exp}`;
  const sig = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("hex");
  if (expected.length !== sig.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) {
    return false;
  }
  const exp = Number(payload.split(":")[1]);
  return Number.isFinite(exp) && exp > Date.now();
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE)?.value);
}

export async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    throw new Error("UNAUTHORIZED");
  }
}

export { COOKIE };
