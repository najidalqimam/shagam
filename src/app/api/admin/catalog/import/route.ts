import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getDroneCatalog, saveDroneCatalog } from "@/lib/cms/store";
import {
  mergeDroneCatalogs,
  parseDroneCatalogFromBuffer,
} from "@/lib/droneCatalogImport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const modeRaw = String(form.get("mode") ?? "");
  const mode = modeRaw === "append" ? "append" : modeRaw === "replace" ? "replace" : null;
  const file = form.get("file");

  if (!mode) {
    return NextResponse.json(
      { error: "mode must be append or replace" },
      { status: 400 },
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file required" }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
    return NextResponse.json(
      { error: "ارفع ملف Excel بصيغة .xlsx أو .xls" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sourceLabel = `upload:${file.name}`;
  const { catalog: parsed, report } = parseDroneCatalogFromBuffer(
    buffer,
    sourceLabel,
  );

  const existing = await getDroneCatalog();
  let next = parsed;
  let manufacturersAdded = parsed.manufacturers.length;
  let modelsAdded = parsed.manufacturers.reduce(
    (n, m) => n + m.models.length,
    0,
  );

  if (mode === "append") {
    const merged = mergeDroneCatalogs(existing, parsed);
    next = merged.catalog;
    manufacturersAdded = merged.manufacturersAdded;
    modelsAdded = merged.modelsAdded;
  }

  await saveDroneCatalog(next);

  return NextResponse.json({
    ok: true,
    mode,
    catalog: {
      version: next.version,
      generatedAt: next.generatedAt,
      source: next.source,
      manufacturersCount: next.manufacturers.length,
      modelsCount: next.manufacturers.reduce((n, m) => n + m.models.length, 0),
      manufacturers: next.manufacturers,
    },
    report: {
      ...report,
      mode,
      manufacturersAdded,
      modelsAdded,
    },
  });
}
