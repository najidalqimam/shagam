import { NextResponse } from "next/server";
import { getDroneCatalog } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getDroneCatalog();
  return NextResponse.json(catalog);
}
