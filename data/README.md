# Drone manufacturer catalog

Source spreadsheet (GACA-registered manufacturers/models) lives at:

- `data/drone-manufacturers.xlsx`

## Import

**From admin (recommended):** `/admin/catalog` → «رفع Excel إضافة» (merge) or «رفع Excel الداتا كاملة» (full replace).

**From CLI:**

```bash
npm run import:drones
# or
npm run import:drones -- path/to/updated.xlsx
```

Writes:

- `src/data/droneCatalog.json` — static catalog for the UI
- `data/drone-catalog-import-report.json` — counts, duplicates, similar-name review (CLI only)

The import is idempotent: re-running yields the same stable IDs and does not create duplicates.

## Tests

```bash
npm run test:drones
```

## Note

This project is frontend-only. Fleet data is included in the contact-form payload in memory / console; durable storage and admin review of unlisted aircraft require a backend.
