/**
 * Unit tests for drone catalog import/cleanup.
 * Run: node --test scripts/test-drone-catalog-import.js
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const os = require("os");
const XLSX = require("xlsx");
const {
  cleanDisplayName,
  normalizeName,
  looseKey,
  stableId,
  importCatalog,
} = require("./import-drone-catalog.js");

describe("normalize helpers", () => {
  it("trims and collapses spaces", () => {
    assert.equal(cleanDisplayName("  DJI   Mavic  "), "DJI Mavic");
  });

  it("normalizes case for comparison", () => {
    assert.equal(normalizeName("Air 2S"), normalizeName("AIR 2S"));
    assert.equal(normalizeName("Mavic 3 pro"), normalizeName("Mavic 3 Pro"));
  });

  it("does not merge hyphen vs space via strict normalize", () => {
    assert.notEqual(normalizeName("BEYOND VISION"), normalizeName("beyond-vision"));
  });

  it("loose key flags hyphen/space variants as similar", () => {
    assert.equal(looseKey("BEYOND VISION"), looseKey("beyond-vision"));
  });

  it("stable ids are deterministic", () => {
    assert.equal(stableId("mfr", "dji"), stableId("mfr", "dji"));
    assert.notEqual(stableId("mfr", "dji"), stableId("mfr", "autel"));
  });
});

describe("importCatalog", () => {
  function writeTempXlsx(rows) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const file = path.join(os.tmpdir(), `drone-cat-${Date.now()}.xlsx`);
    XLSX.writeFile(wb, file);
    return file;
  }

  it("skips header and imports rows", () => {
    const file = writeTempXlsx([
      ["#", "الشركة المصنعة (Manufacturer)", "النوع / الموديل (Model)"],
      [1, "DJI", "Air 2S"],
      [2, "Autel", "Evo II"],
    ]);
    const { catalog, report } = importCatalog(file);
    assert.equal(report.rowsRead, 2);
    assert.equal(catalog.manufacturers.length, 2);
    fs.unlinkSync(file);
  });

  it("merges case-only duplicates", () => {
    const file = writeTempXlsx([
      ["#", "Mfr", "Model"],
      [1, "DJI", "Air 2S"],
      [2, "dji", "AIR 2S"],
      [3, "DJI", "Agras T10"],
      [4, "DJI", "Agras T10"],
    ]);
    const { catalog, report } = importCatalog(file);
    const dji = catalog.manufacturers.find((m) => m.name === "DJI" || m.name === "dji");
    assert.ok(dji);
    assert.equal(dji.models.length, 2);
    assert.equal(report.confirmedDuplicatesSkipped, 2);
    fs.unlinkSync(file);
  });

  it("allows same model name under different manufacturers", () => {
    const file = writeTempXlsx([
      ["#", "Mfr", "Model"],
      [1, "Alpha", "Scout"],
      [2, "Beta", "Scout"],
    ]);
    const { catalog } = importCatalog(file);
    assert.equal(catalog.manufacturers.length, 2);
    assert.equal(catalog.manufacturers[0].models[0].name, "Scout");
    assert.equal(catalog.manufacturers[1].models[0].name, "Scout");
    assert.notEqual(
      catalog.manufacturers[0].models[0].id,
      catalog.manufacturers[1].models[0].id,
    );
    fs.unlinkSync(file);
  });

  it("does not auto-merge similar unconfirmed names", () => {
    const file = writeTempXlsx([
      ["#", "Mfr", "Model"],
      [1, "BEYOND VISION", "X1"],
      [2, "beyond-vision", "X2"],
    ]);
    const { catalog, report } = importCatalog(file);
    assert.equal(catalog.manufacturers.length, 2);
    assert.ok(report.similarNamesForReview.some((s) => s.type === "manufacturer"));
    fs.unlinkSync(file);
  });

  it("is idempotent on stable ids", () => {
    const file = writeTempXlsx([
      ["#", "Mfr", "Model"],
      [1, "DJI", "Matrice 350 RTK"],
    ]);
    const a = importCatalog(file);
    const b = importCatalog(file);
    assert.deepEqual(a.catalog.manufacturers, b.catalog.manufacturers);
    fs.unlinkSync(file);
  });

  it("records invalid rows", () => {
    const file = writeTempXlsx([
      ["#", "Mfr", "Model"],
      [1, "DJI", ""],
      [2, "", "Solo"],
    ]);
    const { report } = importCatalog(file);
    assert.equal(report.invalidRows.length, 2);
    fs.unlinkSync(file);
  });

  it("imports real spreadsheet without throwing", () => {
    const real = path.join(__dirname, "..", "data", "drone-manufacturers.xlsx");
    assert.ok(fs.existsSync(real));
    const { catalog, report } = importCatalog(real);
    assert.equal(report.rowsRead, 449);
    assert.ok(catalog.manufacturers.length > 100);
    assert.ok(report.uniqueModels > 400);
    // Re-run twice: same counts
    const again = importCatalog(real);
    assert.equal(again.report.uniqueManufacturers, report.uniqueManufacturers);
    assert.equal(again.report.uniqueModels, report.uniqueModels);
  });
});
