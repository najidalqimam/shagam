import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import {
  deleteSubmission,
  getSubmissions,
  updateSubmissionStatus,
} from "@/lib/cms/store";
import type { FormSubmission } from "@/lib/cms/types";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getSubmissions());
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as {
    id?: string;
    status?: FormSubmission["status"];
  };
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const updated = await updateSubmissionStatus(body.id, body.status);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const ok = await deleteSubmission(body.id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
