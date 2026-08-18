import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { laravelFetch } from "@/lib/cms/laravel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const file = url.searchParams.get("file");
  if (!file || file.includes("..") || file.includes("/") || file.includes("\\")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const res = await laravelFetch(
    `/admin/uploads?file=${encodeURIComponent(file)}`,
    { admin: true },
  );
  if (!res.ok) {
    return NextResponse.json({ error: "Not found" }, { status: res.status });
  }

  const data = Buffer.from(await res.arrayBuffer());
  const lower = file.toLowerCase();
  const contentType = lower.endsWith(".pdf")
    ? "application/pdf"
    : lower.endsWith(".png")
      ? "image/png"
      : lower.endsWith(".jpg") || lower.endsWith(".jpeg")
        ? "image/jpeg"
        : "application/octet-stream";

  return new NextResponse(data, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
