import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const ok = await isAdminAuthenticated();
  return NextResponse.json({ authenticated: ok });
}
