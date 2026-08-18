import { NextResponse } from "next/server";
import {
  getLocalizedSettings,
  getLocalizedSiteContent,
} from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const [content, settings] = await Promise.all([
    getLocalizedSiteContent(),
    getLocalizedSettings(),
  ]);
  return NextResponse.json({ content, settings });
}
