/**
 * Import & clean the GACA-registered drone manufacturer/model spreadsheet.
 *
 * Usage:
 *   node scripts/import-drone-catalog.mjs [path/to.xlsx]
 *
 * Outputs:
 *   - laravel/database/seeders/data/drone-catalog.json
 *   - data/drone-catalog-import-report.json
 *
 * Idempotent: re-running produces the same stable IDs and does not invent
 * duplicates (JSON overwrite with deterministic structure).
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const XLSX = require("xlsx");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_XLSX = path.join(ROOT, "data", "drone-manufacturers.xlsx");
const OUT_CATALOG = path.join(
  ROOT,
  "laravel",
  "database",
  "seeders",
  "data",
  "drone-catalog.json",
);
const OUT_REPORT = path.join(ROOT, "data", "drone-catalog-import-report.json");

/** Trim + collapse internal whitespace. Keeps original casing for display. */
function cleanDisplayName(value) {
  return String(value ?? "")
    .replace(/\u00a0/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Strict normalized key for exact-duplicate merge.
 * Lowercase + collapse spaces. Keeps letters/digits and common marks.
 */
function normalizeName(value) {
  return cleanDisplayName(value)
    .toLowerCase()
    .normalize("NFKC");
}

/**
 * Loose key (alphanumeric only) — used ONLY to flag similar names for review,
 * never for automatic merge.
 */
function looseKey(value) {
  return normalizeName(value).replace(/[^a-z0-9\u0600-\u06ff]+/gi, "");
}

function stableId(prefix, ...parts) {
  const hash = crypto
    .createHash("sha1")
    .update(parts.join("|"))
    .digest("hex")
    .slice(0, 12);
  return `${prefix}_${hash}`;
}

function importCatalog(xlsxPath) {
  const wb = XLSX.readFile(xlsxPath);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  const report = {
    sourceFile: path.relative(ROOT, xlsxPath).replace(/\\/g, "/"),
    sheetName,
    rowsRead: 0,
    headerSkipped: true,
    invalidRows: [],
    confirmedDuplicatesSkipped: 0,
    uniqueManufacturers: 0,
    uniqueModels: 0,
    similarNamesForReview: [],
  };

  /** @type {Map<string, { id: string, name: string, normalizedName: string, models: Map<string, object>, sourceRows: number[] }>} */
  const manufacturers = new Map();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const excelRow = i + 1; // 1-based spreadsheet row
    const rawNum = row[0];
    const rawMfr = row[1];
    const rawModel = row[2];

    const manufacturerName = cleanDisplayName(rawMfr);
    const modelName = cleanDisplayName(rawModel);

    if (!manufacturerName && !modelName) {
      continue;
    }

    report.rowsRead += 1;

    if (!manufacturerName || !modelName) {
      report.invalidRows.push({
        excelRow,
        reason: !manufacturerName ? "missing_manufacturer" : "missing_model",
        raw: { num: rawNum, manufacturer: rawMfr, model: rawModel },
      });
      continue;
    }

    const mfrNorm = normalizeName(manufacturerName);
    let mfr = manufacturers.get(mfrNorm);
    if (!mfr) {
      mfr = {
        id: stableId("mfr", mfrNorm),
        name: manufacturerName,
        normalizedName: mfrNorm,
        models: new Map(),
        sourceRows: [],
      };
      manufacturers.set(mfrNorm, mfr);
    } else {
      // Prefer the first seen display name; track alternate casings as source rows
      mfr.sourceRows.push(excelRow);
    }

    const modelNorm = normalizeName(modelName);
    if (mfr.models.has(modelNorm)) {
      report.confirmedDuplicatesSkipped += 1;
      const existing = mfr.models.get(modelNorm);
      existing.sourceRows.push(excelRow);
      continue;
    }

    mfr.models.set(modelNorm, {
      id: stableId("mdl", mfrNorm, modelNorm),
      name: modelName,
      normalizedName: modelNorm,
      sourceRows: [excelRow],
      excelNum: rawNum,
    });
  }

  // Similar-name review (loose key collisions across different strict keys)
  const mfrByLoose = new Map();
  for (const mfr of manufacturers.values()) {
    const lk = looseKey(mfr.name);
    if (!lk) continue;
    if (!mfrByLoose.has(lk)) mfrByLoose.set(lk, []);
    mfrByLoose.get(lk).push(mfr.name);
  }
  for (const [lk, names] of mfrByLoose) {
    const unique = [...new Set(names)];
    if (unique.length > 1) {
      report.similarNamesForReview.push({
        type: "manufacturer",
        looseKey: lk,
        names: unique,
      });
    }
  }

  for (const mfr of manufacturers.values()) {
    const modelByLoose = new Map();
    for (const model of mfr.models.values()) {
      const lk = looseKey(model.name);
      if (!lk) continue;
      if (!modelByLoose.has(lk)) modelByLoose.set(lk, []);
      modelByLoose.get(lk).push(model.name);
    }
    for (const [lk, names] of modelByLoose) {
      const unique = [...new Set(names)];
      if (unique.length > 1) {
        report.similarNamesForReview.push({
          type: "model",
          manufacturer: mfr.name,
          looseKey: lk,
          names: unique,
        });
      }
    }
  }

  const catalog = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: report.sourceFile,
    manufacturers: [...manufacturers.values()]
      .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }))
      .map((mfr) => ({
        id: mfr.id,
        name: mfr.name,
        models: [...mfr.models.values()]
          .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }))
          .map((m) => ({
            id: m.id,
            name: m.name,
          })),
      })),
  };

  report.uniqueManufacturers = catalog.manufacturers.length;
  report.uniqueModels = catalog.manufacturers.reduce(
    (n, m) => n + m.models.length,
    0,
  );

  return { catalog, report };
}

function main() {
  const xlsxPath = path.resolve(process.argv[2] || DEFAULT_XLSX);
  if (!fs.existsSync(xlsxPath)) {
    console.error(`Excel file not found: ${xlsxPath}`);
    process.exit(1);
  }

  const { catalog, report } = importCatalog(xlsxPath);

  fs.mkdirSync(path.dirname(OUT_CATALOG), { recursive: true });
  fs.mkdirSync(path.dirname(OUT_REPORT), { recursive: true });
  fs.writeFileSync(OUT_CATALOG, JSON.stringify(catalog, null, 2) + "\n", "utf8");
  fs.writeFileSync(OUT_REPORT, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log("Drone catalog import complete");
  console.log(`  rows read:              ${report.rowsRead}`);
  console.log(`  manufacturers:          ${report.uniqueManufacturers}`);
  console.log(`  models:                 ${report.uniqueModels}`);
  console.log(`  duplicates skipped:     ${report.confirmedDuplicatesSkipped}`);
  console.log(`  invalid rows:           ${report.invalidRows.length}`);
  console.log(`  similar names (review): ${report.similarNamesForReview.length}`);
  console.log(`  catalog → ${path.relative(ROOT, OUT_CATALOG)}`);
  console.log(`  report  → ${path.relative(ROOT, OUT_REPORT)}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  cleanDisplayName,
  normalizeName,
  looseKey,
  stableId,
  importCatalog,
};
