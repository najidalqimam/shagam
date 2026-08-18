import { createHash } from "crypto";
import * as XLSX from "xlsx";
import type { StoredDroneCatalog } from "@/lib/cms/store";

export type CatalogImportReport = {
  sourceFile: string;
  sheetName: string;
  rowsRead: number;
  invalidRows: number;
  duplicatesSkipped: number;
  uniqueManufacturers: number;
  uniqueModels: number;
  mode: "append" | "replace";
  manufacturersAdded?: number;
  modelsAdded?: number;
};

function cleanDisplayName(value: unknown): string {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeName(value: string): string {
  return cleanDisplayName(value).toLowerCase().normalize("NFKC");
}

function stableId(prefix: string, ...parts: string[]): string {
  const hash = createHash("sha1")
    .update(parts.join("|"))
    .digest("hex")
    .slice(0, 12);
  return `${prefix}_${hash}`;
}

/** Parse Excel buffer: col B = manufacturer, col C = model (row 1 = header). */
export function parseDroneCatalogFromBuffer(
  buffer: Buffer,
  sourceLabel: string,
): { catalog: StoredDroneCatalog; report: Omit<CatalogImportReport, "mode"> } {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheetName = wb.SheetNames[0] ?? "";
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, {
    header: 1,
    defval: "",
  });

  const manufacturers = new Map<
    string,
    {
      id: string;
      name: string;
      models: Map<string, { id: string; name: string }>;
    }
  >();

  let rowsRead = 0;
  let invalidRows = 0;
  let duplicatesSkipped = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const manufacturerName = cleanDisplayName(row[1]);
    const modelName = cleanDisplayName(row[2]);

    if (!manufacturerName && !modelName) continue;
    rowsRead += 1;

    if (!manufacturerName || !modelName) {
      invalidRows += 1;
      continue;
    }

    const mfrNorm = normalizeName(manufacturerName);
    let mfr = manufacturers.get(mfrNorm);
    if (!mfr) {
      mfr = {
        id: stableId("mfr", mfrNorm),
        name: manufacturerName,
        models: new Map(),
      };
      manufacturers.set(mfrNorm, mfr);
    }

    const modelNorm = normalizeName(modelName);
    if (mfr.models.has(modelNorm)) {
      duplicatesSkipped += 1;
      continue;
    }
    mfr.models.set(modelNorm, {
      id: stableId("mdl", mfrNorm, modelNorm),
      name: modelName,
    });
  }

  const catalog: StoredDroneCatalog = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: sourceLabel,
    manufacturers: [...manufacturers.values()]
      .sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
      )
      .map((mfr) => ({
        id: mfr.id,
        name: mfr.name,
        models: [...mfr.models.values()].sort((a, b) =>
          a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
        ),
      })),
  };

  return {
    catalog,
    report: {
      sourceFile: sourceLabel,
      sheetName,
      rowsRead,
      invalidRows,
      duplicatesSkipped,
      uniqueManufacturers: catalog.manufacturers.length,
      uniqueModels: catalog.manufacturers.reduce(
        (n, m) => n + m.models.length,
        0,
      ),
    },
  };
}

/** Merge incoming into existing (append). Returns merged catalog + counts. */
export function mergeDroneCatalogs(
  existing: StoredDroneCatalog,
  incoming: StoredDroneCatalog,
): {
  catalog: StoredDroneCatalog;
  manufacturersAdded: number;
  modelsAdded: number;
} {
  const byNorm = new Map<
    string,
    {
      id: string;
      name: string;
      models: Map<string, { id: string; name: string }>;
    }
  >();

  for (const mfr of existing.manufacturers) {
    const models = new Map<string, { id: string; name: string }>();
    for (const model of mfr.models) {
      models.set(normalizeName(model.name), model);
    }
    byNorm.set(normalizeName(mfr.name), {
      id: mfr.id,
      name: mfr.name,
      models,
    });
  }

  let manufacturersAdded = 0;
  let modelsAdded = 0;

  for (const mfr of incoming.manufacturers) {
    const mfrNorm = normalizeName(mfr.name);
    let target = byNorm.get(mfrNorm);
    if (!target) {
      target = {
        id: mfr.id,
        name: mfr.name,
        models: new Map(),
      };
      byNorm.set(mfrNorm, target);
      manufacturersAdded += 1;
    }
    for (const model of mfr.models) {
      const modelNorm = normalizeName(model.name);
      if (target.models.has(modelNorm)) continue;
      target.models.set(modelNorm, model);
      modelsAdded += 1;
    }
  }

  const catalog: StoredDroneCatalog = {
    version: existing.version || 1,
    generatedAt: new Date().toISOString(),
    source: incoming.source || existing.source || "admin",
    manufacturers: [...byNorm.values()]
      .sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
      )
      .map((mfr) => ({
        id: mfr.id,
        name: mfr.name,
        models: [...mfr.models.values()].sort((a, b) =>
          a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
        ),
      })),
  };

  return { catalog, manufacturersAdded, modelsAdded };
}
