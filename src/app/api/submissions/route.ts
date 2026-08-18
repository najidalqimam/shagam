import { NextResponse } from "next/server";
import { addSubmission, addSubmissionForm } from "@/lib/cms/store";
import { LaravelApiError } from "@/lib/cms/laravel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(error: unknown) {
  if (error instanceof LaravelApiError) {
    try {
      const parsed = JSON.parse(error.body) as { error?: string };
      return NextResponse.json(
        { error: parsed.error || "Request failed" },
        { status: error.status },
      );
    } catch {
      return NextResponse.json({ error: "Request failed" }, { status: error.status });
    }
  }
  return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData().catch(() => null);
      if (!form) {
        return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
      }
      const entry = await addSubmissionForm(form);
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
  } catch (error) {
    return fail(error);
  }
}
