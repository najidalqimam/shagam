import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getDashboardStats } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}
