"use client";

import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { FormSubmission } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

const statusLabel: Record<FormSubmission["status"], string> = {
  new: "جديد",
  reviewed: "تمت المراجعة",
  archived: "مؤرشف",
};

const statusOrder = ["new", "reviewed", "archived"] as const;

export function SubmissionsPanel({
  initial,
}: {
  initial: FormSubmission[];
}) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"all" | FormSubmission["status"]>("all");
  const [active, setActive] = useState<FormSubmission | null>(
    initial[0] ?? null,
  );

  useEffect(() => {
    setItems(initial);
    setActive(initial[0] ?? null);
  }, [initial]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.status === filter);
  }, [filter, items]);

  const counts = useMemo(
    () => ({
      all: items.length,
      new: items.filter((i) => i.status === "new").length,
      reviewed: items.filter((i) => i.status === "reviewed").length,
      archived: items.filter((i) => i.status === "archived").length,
    }),
    [items],
  );

  const setStatus = async (id: string, status: FormSubmission["status"]) => {
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) return;
    const updated = (await res.json()) as FormSubmission;
    setItems((list) => list.map((s) => (s.id === id ? updated : s)));
    setActive((cur) => (cur?.id === id ? updated : cur));
  };

  const remove = async (id: string) => {
    if (!window.confirm("حذف هذا الطلب نهائياً؟")) return;
    const res = await fetch("/api/admin/submissions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) return;
    setItems((list) => {
      const next = list.filter((s) => s.id !== id);
      setActive((cur) => (cur?.id === id ? next[0] ?? null : cur));
      return next;
    });
  };

  return (
    <AdminShell
      title="طلبات النموذج"
      subtitle="راجع الطلبات وغيّر حالتها بسهولة"
    >
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["all", "الكل", counts.all],
            ["new", "جديد", counts.new],
            ["reviewed", "تمت المراجعة", counts.reviewed],
            ["archived", "مؤرشف", counts.archived],
          ] as const
        ).map(([id, label, count]) => (
          <Button
            key={id}
            type="button"
            size="sm"
            variant={filter === id ? "default" : "outline"}
            onClick={() => setFilter(id)}
          >
            {label}
            <Badge variant="secondary" className="ms-1">
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            لا توجد طلبات في هذا التصنيف.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <Card className="overflow-hidden py-0">
            <ScrollArea className="h-[70vh]">
              <div className="space-y-1 p-2">
                {filtered.map((item) => {
                  const selected = active?.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActive(item)}
                      className={cn(
                        "w-full rounded-lg px-3 py-3 text-start text-sm transition",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-medium">
                          {String(item.payload.fullName || "بدون اسم")}
                        </p>
                        <Badge
                          variant={selected ? "secondary" : "outline"}
                          className="shrink-0"
                        >
                          {statusLabel[item.status]}
                        </Badge>
                      </div>
                      <p
                        className={cn(
                          "mt-1 truncate text-xs",
                          selected
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground",
                        )}
                      >
                        {String(item.payload.role || "—")}
                      </p>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </Card>

          {active && (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <CardTitle>
                      {String(active.payload.fullName || "طلب")}
                    </CardTitle>
                    <CardDescription>
                      {new Date(active.createdAt).toLocaleString("ar-SA")}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusOrder.map((s) => (
                      <Button
                        key={s}
                        type="button"
                        size="sm"
                        variant={active.status === s ? "default" : "outline"}
                        onClick={() => setStatus(active.id, s)}
                      >
                        {statusLabel[s]}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => remove(active.id)}
                    >
                      حذف الطلب
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(active.payload).map(([key, value], index) => {
                  if (
                    key === "license" &&
                    value &&
                    typeof value === "object" &&
                    "storedName" in value
                  ) {
                    const license = value as {
                      originalName?: string;
                      storedName: string;
                      mimeType?: string;
                      size?: number;
                    };
                    return (
                      <div key={key}>
                        {index > 0 && <Separator className="mb-3" />}
                        <p className="text-xs text-muted-foreground">الرخصة</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <p className="text-sm">
                            {license.originalName || license.storedName}
                            {typeof license.size === "number"
                              ? ` · ${(license.size / 1024).toFixed(0)} KB`
                              : ""}
                          </p>
                          <Button asChild size="sm" variant="outline">
                            <a
                              href={`/api/admin/uploads?file=${encodeURIComponent(license.storedName)}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              تحميل الرخصة
                            </a>
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={key}>
                      {index > 0 && <Separator className="mb-3" />}
                      <p className="text-xs text-muted-foreground">{key}</p>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm">
                        {typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : String(value ?? "—")}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </AdminShell>
  );
}
