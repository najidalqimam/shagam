import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { addSubmission } from "@/lib/cms/store";

export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "data", "cms", "uploads");
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
]);

function safeFileName(name: string) {
  return name.replace(/[^\w.\-()\u0600-\u06FF ]+/g, "_").slice(0, 120);
}

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const role = String(form.get("role") ?? "");
    const isOperator = role === "مشغّل طائرات مسيّرة";

    let fleet: unknown = undefined;
    const fleetRaw = form.get("fleet");
    if (typeof fleetRaw === "string" && fleetRaw.trim()) {
      try {
        fleet = JSON.parse(fleetRaw);
      } catch {
        return NextResponse.json({ error: "Invalid fleet payload" }, { status: 400 });
      }
    }

    const payload: Record<string, unknown> = {
      role,
      fullName: String(form.get("fullName") ?? ""),
      organization: String(form.get("organization") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      city: String(form.get("city") ?? ""),
      service: isOperator ? null : String(form.get("service") ?? ""),
      operatingSector: isOperator
        ? String(form.get("operatingSector") ?? "")
        : null,
      notes: String(form.get("notes") ?? ""),
      ...(fleet && typeof fleet === "object" ? (fleet as Record<string, unknown>) : {}),
    };

    if (isOperator) {
      const license = form.get("license");
      if (!(license instanceof File) || license.size === 0) {
        return NextResponse.json(
          { error: "License file required" },
          { status: 400 },
        );
      }
      if (license.size > MAX_BYTES) {
        return NextResponse.json({ error: "File too large" }, { status: 400 });
      }
      const mime = license.type || "application/octet-stream";
      if (!ALLOWED.has(mime)) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
      }

      await ensureUploadDir();
      const entryId = `sub_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      const originalName = safeFileName(license.name || "license");
      const storedName = `${entryId}_${originalName}`;
      const bytes = Buffer.from(await license.arrayBuffer());
      await fs.writeFile(path.join(UPLOAD_DIR, storedName), bytes);

      payload.license = {
        originalName,
        storedName,
        mimeType: mime,
        size: license.size,
      };

      const entry = await addSubmission(payload, entryId);
      return NextResponse.json({ ok: true, id: entry.id });
    }

    const entry = await addSubmission(payload);
    return NextResponse.json({ ok: true, id: entry.id });
  }

  const payload = (await req.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const entry = await addSubmission(payload);
  return NextResponse.json({ ok: true, id: entry.id });
}
