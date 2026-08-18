import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import {
  getDroneCatalog,
  saveDroneCatalog,
  type StoredDroneCatalog,
} from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const catalog = await getDroneCatalog();
  return NextResponse.json({
    version: catalog.version,
    generatedAt: catalog.generatedAt,
    source: catalog.source,
    manufacturersCount: catalog.manufacturers.length,
    modelsCount: catalog.manufacturers.reduce(
      (n, m) => n + m.models.length,
      0,
    ),
    manufacturers: catalog.manufacturers,
  });
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as StoredDroneCatalog;
  if (!body || !Array.isArray(body.manufacturers)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await saveDroneCatalog(body);
  return NextResponse.json({ ok: true });
}
