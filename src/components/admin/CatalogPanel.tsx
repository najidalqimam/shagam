"use client";

import { useMemo, useRef, useState, type ChangeEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Model = { id: string; name: string };
type Manufacturer = { id: string; name: string; models: Model[] };

type CatalogPayload = {
  manufacturersCount: number;
  modelsCount: number;
  generatedAt: string;
  source: string;
  version: number;
  manufacturers: Manufacturer[];
};

function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function CatalogPanel({ initial }: { initial: CatalogPayload }) {
  const [manufacturers, setManufacturers] = useState(initial.manufacturers);
  const [meta, setMeta] = useState({
    source: initial.source,
    generatedAt: initial.generatedAt,
    version: initial.version,
  });
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(initial.manufacturers[0]?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState<"append" | "replace" | null>(null);
  const [msg, setMsg] = useState("");
  const appendInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return manufacturers;
    return manufacturers.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.models.some((model) => model.name.toLowerCase().includes(q)),
    );
  }, [manufacturers, query]);

  const active =
    filtered.find((m) => m.id === selected) ||
    manufacturers.find((m) => m.id === selected) ||
    filtered[0] ||
    null;

  const modelsCount = manufacturers.reduce((n, m) => n + m.models.length, 0);

  const applyCatalog = (catalog: CatalogPayload) => {
    setManufacturers(catalog.manufacturers);
    setMeta({
      source: catalog.source,
      generatedAt: catalog.generatedAt,
      version: catalog.version,
    });
    setSelected((prev) =>
      catalog.manufacturers.some((m) => m.id === prev)
        ? prev
        : (catalog.manufacturers[0]?.id ?? ""),
    );
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/catalog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: meta.version || 1,
          generatedAt: new Date().toISOString(),
          source: "admin",
          manufacturers,
        }),
      });
      if (!res.ok) throw new Error("fail");
      setMeta((m) => ({
        ...m,
        source: "admin",
        generatedAt: new Date().toISOString(),
      }));
      setMsg("تم حفظ الكتالوج. إن لم يظهر فوراً في النموذج، أعد تشغيل السيرفر.");
    } catch {
      setMsg("تعذر الحفظ.");
    } finally {
      setSaving(false);
    }
  };

  const importExcel = async (mode: "append" | "replace", file: File) => {
    if (mode === "replace") {
      const ok = window.confirm(
        "استبدال كامل: سيتم حذف الكتالوج الحالي واستبداله ببيانات الملف. متابعة؟",
      );
      if (!ok) return;
    }

    setImporting(mode);
    setMsg("");
    try {
      const form = new FormData();
      form.set("mode", mode);
      form.set("file", file);
      const res = await fetch("/api/admin/catalog/import", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : "فشل الاستيراد",
        );
      }
      applyCatalog(data.catalog as CatalogPayload);
      const addedMfr = data.report?.manufacturersAdded ?? 0;
      const addedModels = data.report?.modelsAdded ?? 0;
      setMsg(
        mode === "append"
          ? `تمت الإضافة: ${addedMfr} شركة، ${addedModels} موديل جديد.`
          : `تم الاستبدال الكامل: ${data.catalog.manufacturersCount} شركة، ${data.catalog.modelsCount} موديل.`,
      );
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "تعذر رفع الملف.");
    } finally {
      setImporting(null);
    }
  };

  const onPickFile =
    (mode: "append" | "replace") => (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      void importExcel(mode, file);
    };

  const addManufacturer = () => {
    const id = newId("mfr");
    setManufacturers((list) => [
      ...list,
      { id, name: "شركة جديدة", models: [] },
    ]);
    setSelected(id);
    setQuery("");
  };

  const updateManufacturerName = (id: string, name: string) => {
    setManufacturers((list) =>
      list.map((m) => (m.id === id ? { ...m, name } : m)),
    );
  };

  const removeManufacturer = (id: string) => {
    if (!window.confirm("حذف هذه الشركة وكل موديلاتها؟")) return;
    setManufacturers((list) => {
      const next = list.filter((m) => m.id !== id);
      if (selected === id) setSelected(next[0]?.id ?? "");
      return next;
    });
  };

  const addModel = (mfrId: string) => {
    setManufacturers((list) =>
      list.map((m) =>
        m.id === mfrId
          ? {
              ...m,
              models: [...m.models, { id: newId("mdl"), name: "موديل جديد" }],
            }
          : m,
      ),
    );
  };

  const updateModelName = (mfrId: string, modelId: string, name: string) => {
    setManufacturers((list) =>
      list.map((m) =>
        m.id === mfrId
          ? {
              ...m,
              models: m.models.map((model) =>
                model.id === modelId ? { ...model, name } : model,
              ),
            }
          : m,
      ),
    );
  };

  const removeModel = (mfrId: string, modelId: string) => {
    setManufacturers((list) =>
      list.map((m) =>
        m.id === mfrId
          ? { ...m, models: m.models.filter((model) => model.id !== modelId) }
          : m,
      ),
    );
  };

  return (
    <AdminShell
      title="كتالوج الطائرات"
      subtitle="أضف وعدّل واحذف الشركات والموديلات المستخدمة في تسجيل المشغّلين"
      actions={
        <Button onClick={save} disabled={saving}>
          {saving ? "جاري الحفظ…" : "حفظ الكتالوج"}
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>الشركات</CardDescription>
            <CardTitle className="text-3xl">{manufacturers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>الموديلات</CardDescription>
            <CardTitle className="text-3xl">{modelsCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>آخر تحديث</CardDescription>
            <CardTitle className="text-base font-medium">
              {meta.generatedAt
                ? new Date(meta.generatedAt).toLocaleString("ar-SA")
                : "—"}
            </CardTitle>
            <CardDescription className="truncate pt-1">
              {meta.source || "admin"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>رفع Excel</CardTitle>
          <CardDescription>
            الأعمدة: الشركة (B) والموديل (C) — الصف الأول عناوين. الإضافة تدمج
            بدون تكرار؛ الاستبدال يستبدل الكتالوج بالكامل.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <input
            ref={appendInputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="hidden"
            onChange={onPickFile("append")}
          />
          <input
            ref={replaceInputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            className="hidden"
            onChange={onPickFile("replace")}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!!importing || saving}
            onClick={() => appendInputRef.current?.click()}
          >
            {importing === "append"
              ? "جاري رفع الإضافة…"
              : "رفع Excel إضافة"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!!importing || saving}
            onClick={() => replaceInputRef.current?.click()}
          >
            {importing === "replace"
              ? "جاري الاستبدال…"
              : "رفع Excel الداتا كاملة"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle>إدارة الكتالوج</CardTitle>
            <CardDescription>
              ابحث، عدّل الأسماء، أضف أو احذف — ثم احفظ
            </CardDescription>
          </div>
          <Button type="button" onClick={addManufacturer}>
            + إضافة شركة
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن شركة أو موديل…"
          />

          <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
            <Card className="overflow-hidden py-0">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-1 p-2">
                  {filtered.map((mfr) => (
                    <button
                      key={mfr.id}
                      type="button"
                      onClick={() => setSelected(mfr.id)}
                      className={cn(
                        "w-full rounded-lg px-3 py-2 text-start text-sm transition",
                        active?.id === mfr.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      )}
                    >
                      {mfr.name}
                      <span className="ms-2 opacity-70">
                        ({mfr.models.length})
                      </span>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="p-3 text-sm text-muted-foreground">لا نتائج</p>
                  )}
                </div>
              </ScrollArea>
            </Card>

            <Card>
              {active ? (
                <>
                  <CardHeader className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1 space-y-2">
                        <CardDescription>اسم الشركة</CardDescription>
                        <Input
                          value={active.name}
                          onChange={(e) =>
                            updateManufacturerName(active.id, e.target.value)
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeManufacturer(active.id)}
                      >
                        حذف الشركة
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">
                        الموديلات ({active.models.length})
                      </CardTitle>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addModel(active.id)}
                      >
                        + موديل
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {active.models.map((model) => (
                        <li
                          key={model.id}
                          className="flex gap-2 rounded-lg bg-muted p-2"
                        >
                          <Input
                            value={model.name}
                            onChange={(e) =>
                              updateModelName(
                                active.id,
                                model.id,
                                e.target.value,
                              )
                            }
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="shrink-0 text-destructive"
                            onClick={() => removeModel(active.id, model.id)}
                          >
                            حذف
                          </Button>
                        </li>
                      ))}
                      {active.models.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          لا موديلات — أضف موديلاً جديداً.
                        </p>
                      ) : null}
                    </ul>
                  </CardContent>
                </>
              ) : (
                <CardHeader>
                  <CardTitle>اختر شركة</CardTitle>
                  <CardDescription>أو أضف شركة جديدة للبدء</CardDescription>
                </CardHeader>
              )}
            </Card>
          </div>

          {msg ? (
            <p className="text-sm text-muted-foreground">{msg}</p>
          ) : null}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
