"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

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
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { LocalizedSiteContent, SiteContent } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "hero", label: "البطل" },
  { id: "nav", label: "القائمة" },
  { id: "how", label: "كيف نعمل" },
  { id: "services", label: "الخدمات" },
  { id: "why", label: "لماذا شاغم" },
  { id: "operators", label: "المشغّلون" },
  { id: "enterprise", label: "المنظمات" },
  { id: "compliance", label: "الامتثال" },
  { id: "faqs", label: "الأسئلة" },
  { id: "lists", label: "قوائم النموذج" },
  { id: "contact", label: "التواصل" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function DualField({
  label,
  ar,
  en,
  onAr,
  onEn,
  multiline = false,
}: {
  label: string;
  ar: string;
  en: string;
  onAr: (v: string) => void;
  onEn: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">العربية</p>
          {multiline ? (
            <Textarea
              dir="rtl"
              rows={3}
              value={ar}
              onChange={(e) => onAr(e.target.value)}
            />
          ) : (
            <Input
              dir="rtl"
              value={ar}
              onChange={(e) => onAr(e.target.value)}
            />
          )}
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">English</p>
          {multiline ? (
            <Textarea
              dir="ltr"
              rows={3}
              value={en}
              onChange={(e) => onEn(e.target.value)}
            />
          ) : (
            <Input
              dir="ltr"
              value={en}
              onChange={(e) => onEn(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SharedField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function ItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-muted-foreground">{title}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 text-destructive hover:text-destructive"
          onClick={onRemove}
        >
          حذف
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DualLinesEditor({
  label,
  hint,
  arValues,
  enValues,
  onChange,
}: {
  label: string;
  hint?: string;
  arValues: string[];
  enValues: string[];
  onChange: (ar: string[], en: string[]) => void;
}) {
  const count = Math.max(arValues.length, enValues.length);
  const rows = Array.from({ length: count }, (_, i) => ({
    ar: arValues[i] ?? "",
    en: enValues[i] ?? "",
  }));

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-2">
        <div>
          <Label>{label}</Label>
          {hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange([...arValues, ""], [...enValues, ""])}
        >
          + إضافة سطر
        </Button>
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <Input
              dir="rtl"
              value={row.ar}
              placeholder={`عربي ${i + 1}`}
              onChange={(e) => {
                const nextAr = [...arValues];
                const nextEn = [...enValues];
                while (nextAr.length <= i) nextAr.push("");
                while (nextEn.length <= i) nextEn.push("");
                nextAr[i] = e.target.value;
                onChange(nextAr, nextEn);
              }}
            />
            <Input
              dir="ltr"
              value={row.en}
              placeholder={`English ${i + 1}`}
              onChange={(e) => {
                const nextAr = [...arValues];
                const nextEn = [...enValues];
                while (nextAr.length <= i) nextAr.push("");
                while (nextEn.length <= i) nextEn.push("");
                nextEn[i] = e.target.value;
                onChange(nextAr, nextEn);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() =>
                onChange(
                  arValues.filter((_, idx) => idx !== i),
                  enValues.filter((_, idx) => idx !== i),
                )
              }
            >
              حذف
            </Button>
          </div>
        ))}
        {count === 0 ? (
          <p className="text-sm text-muted-foreground">لا عناصر بعد.</p>
        ) : null}
      </div>
    </div>
  );
}

function replaceAt<T>(list: T[], i: number, item: T): T[] {
  const next = list.slice();
  while (next.length <= i) next.push(item);
  next[i] = item;
  return next;
}

export function ContentEditor({ initial }: { initial: LocalizedSiteContent }) {
  const [tab, setTab] = useState<TabId>("hero");
  const [bundle, setBundle] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const ar = bundle.ar;
  const en = bundle.en;

  const patchAr = (next: SiteContent) =>
    setBundle((b) => ({ ...b, ar: next }));
  const patchEn = (next: SiteContent) =>
    setBundle((b) => ({ ...b, en: next }));
  const mapBoth = (fn: (c: SiteContent) => SiteContent) =>
    setBundle((b) => ({ ar: fn(b.ar), en: fn(b.en) }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab") as TabId | null;
    if (t && TABS.some((x) => x.id === t)) setTab(t);
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bundle),
      });
      if (!res.ok) throw new Error("fail");
      setMsg("تم حفظ المحتوى العربي والإنجليزي.");
    } catch {
      setMsg("تعذر الحفظ. تأكد من تسجيل الدخول.");
    } finally {
      setSaving(false);
    }
  };

  const panel = useMemo(() => {
    if (tab === "hero") {
      return (
        <div className="grid gap-4">
          <DualField
            label="سطر علوي"
            ar={ar.hero.eyebrow}
            en={en.hero.eyebrow}
            onAr={(v) => patchAr({ ...ar, hero: { ...ar.hero, eyebrow: v } })}
            onEn={(v) => patchEn({ ...en, hero: { ...en.hero, eyebrow: v } })}
          />
          <DualField
            label="العنوان"
            ar={ar.hero.title}
            en={en.hero.title}
            onAr={(v) => patchAr({ ...ar, hero: { ...ar.hero, title: v } })}
            onEn={(v) => patchEn({ ...en, hero: { ...en.hero, title: v } })}
            multiline
          />
          <DualField
            label="الوصف"
            ar={ar.hero.body}
            en={en.hero.body}
            onAr={(v) => patchAr({ ...ar, hero: { ...ar.hero, body: v } })}
            onEn={(v) => patchEn({ ...en, hero: { ...en.hero, body: v } })}
            multiline
          />
          <DualField
            label="زر أساسي"
            ar={ar.hero.primaryCta}
            en={en.hero.primaryCta}
            onAr={(v) =>
              patchAr({ ...ar, hero: { ...ar.hero, primaryCta: v } })
            }
            onEn={(v) =>
              patchEn({ ...en, hero: { ...en.hero, primaryCta: v } })
            }
          />
          <DualField
            label="زر ثانوي"
            ar={ar.hero.secondaryCta}
            en={en.hero.secondaryCta}
            onAr={(v) =>
              patchAr({ ...ar, hero: { ...ar.hero, secondaryCta: v } })
            }
            onEn={(v) =>
              patchEn({ ...en, hero: { ...en.hero, secondaryCta: v } })
            }
          />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">الإحصائيات</p>
              <Button
                type="button"
                onClick={() =>
                  mapBoth((c) => ({
                    ...c,
                    stats: [...c.stats, { value: "", label: "" }],
                  }))
                }
              >
                + إحصائية
              </Button>
            </div>
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b text-start">
                    <th className="w-12 px-3 py-2.5 font-medium">#</th>
                    <th className="px-3 py-2.5 font-medium">القيمة عربي</th>
                    <th className="px-3 py-2.5 font-medium">Value EN</th>
                    <th className="px-3 py-2.5 font-medium">العنوان عربي</th>
                    <th className="px-3 py-2.5 font-medium">Title EN</th>
                    <th className="w-20 px-3 py-2.5 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {Array.from(
                    { length: Math.max(ar.stats.length, en.stats.length) },
                    (_, i) => {
                      const arItem = ar.stats[i] ?? { value: "", label: "" };
                      const enItem = en.stats[i] ?? { value: "", label: "" };
                      return (
                        <tr key={i} className="border-b last:border-b-0">
                          <td className="px-3 py-2 text-muted-foreground">
                            {i + 1}
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              dir="rtl"
                              value={arItem.value}
                              onChange={(e) =>
                                patchAr({
                                  ...ar,
                                  stats: replaceAt(ar.stats, i, {
                                    ...arItem,
                                    value: e.target.value,
                                  }),
                                })
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              dir="ltr"
                              value={enItem.value}
                              onChange={(e) =>
                                patchEn({
                                  ...en,
                                  stats: replaceAt(en.stats, i, {
                                    ...enItem,
                                    value: e.target.value,
                                  }),
                                })
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              dir="rtl"
                              value={arItem.label}
                              onChange={(e) =>
                                patchAr({
                                  ...ar,
                                  stats: replaceAt(ar.stats, i, {
                                    ...arItem,
                                    label: e.target.value,
                                  }),
                                })
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              dir="ltr"
                              value={enItem.label}
                              onChange={(e) =>
                                patchEn({
                                  ...en,
                                  stats: replaceAt(en.stats, i, {
                                    ...enItem,
                                    label: e.target.value,
                                  }),
                                })
                              }
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                mapBoth((c) => ({
                                  ...c,
                                  stats: c.stats.filter((_, idx) => idx !== i),
                                }))
                              }
                            >
                              حذف
                            </Button>
                          </td>
                        </tr>
                      );
                    },
                  )}
                  {ar.stats.length === 0 && en.stats.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-8 text-center text-muted-foreground"
                      >
                        لا توجد إحصائيات بعد.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (tab === "nav") {
      return (
        <div className="space-y-3">
          {Array.from(
            { length: Math.max(ar.navLinks.length, en.navLinks.length) },
            (_, i) => {
              const arItem = ar.navLinks[i] ?? { href: "#", label: "" };
              const enItem = en.navLinks[i] ?? { href: "#", label: "" };
              return (
                <ItemCard
                  key={i}
                  title={`رابط ${i + 1}`}
                  onRemove={() =>
                    mapBoth((c) => ({
                      ...c,
                      navLinks: c.navLinks.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <DualField
                    label="النص"
                    ar={arItem.label}
                    en={enItem.label}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        navLinks: replaceAt(ar.navLinks, i, {
                          ...arItem,
                          label: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        navLinks: replaceAt(en.navLinks, i, {
                          ...enItem,
                          label: v,
                        }),
                      })
                    }
                  />
                  <SharedField
                    label="الرابط (مشترك)"
                    value={arItem.href}
                    onChange={(v) =>
                      mapBoth((c) => ({
                        ...c,
                        navLinks: replaceAt(
                          c.navLinks,
                          i,
                          { ...(c.navLinks[i] ?? arItem), href: v },
                        ),
                      }))
                    }
                  />
                </ItemCard>
              );
            },
          )}
          <Button
            type="button"
            onClick={() =>
              mapBoth((c) => ({
                ...c,
                navLinks: [...c.navLinks, { href: "#", label: "" }],
              }))
            }
          >
            + إضافة رابط
          </Button>
        </div>
      );
    }

    if (tab === "how") {
      return (
        <div className="space-y-4">
          <DualField
            label="عنوان صغير"
            ar={ar.how.eyebrow}
            en={en.how.eyebrow}
            onAr={(v) => patchAr({ ...ar, how: { ...ar.how, eyebrow: v } })}
            onEn={(v) => patchEn({ ...en, how: { ...en.how, eyebrow: v } })}
          />
          <DualField
            label="العنوان"
            ar={ar.how.title}
            en={en.how.title}
            onAr={(v) => patchAr({ ...ar, how: { ...ar.how, title: v } })}
            onEn={(v) => patchEn({ ...en, how: { ...en.how, title: v } })}
          />
          <DualField
            label="الوصف"
            ar={ar.how.body}
            en={en.how.body}
            onAr={(v) => patchAr({ ...ar, how: { ...ar.how, body: v } })}
            onEn={(v) => patchEn({ ...en, how: { ...en.how, body: v } })}
            multiline
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">الخطوات</p>
            <Button
              type="button"
              onClick={() =>
                mapBoth((c) => ({
                  ...c,
                  steps: [
                    ...c.steps,
                    {
                      num: String(c.steps.length + 1).padStart(2, "0"),
                      title: "",
                      body: "",
                    },
                  ],
                }))
              }
            >
              + خطوة
            </Button>
          </div>
          {Array.from(
            { length: Math.max(ar.steps.length, en.steps.length) },
            (_, i) => {
              const arItem = ar.steps[i] ?? { num: "", title: "", body: "" };
              const enItem = en.steps[i] ?? { num: "", title: "", body: "" };
              return (
                <ItemCard
                  key={i}
                  title={`الخطوة ${arItem.num || i + 1}`}
                  onRemove={() =>
                    mapBoth((c) => ({
                      ...c,
                      steps: c.steps.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <SharedField
                    label="الرقم (مشترك)"
                    value={arItem.num}
                    onChange={(v) =>
                      mapBoth((c) => ({
                        ...c,
                        steps: replaceAt(c.steps, i, {
                          ...(c.steps[i] ?? arItem),
                          num: v,
                        }),
                      }))
                    }
                  />
                  <DualField
                    label="العنوان"
                    ar={arItem.title}
                    en={enItem.title}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        steps: replaceAt(ar.steps, i, {
                          ...arItem,
                          title: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        steps: replaceAt(en.steps, i, {
                          ...enItem,
                          title: v,
                        }),
                      })
                    }
                  />
                  <DualField
                    label="الوصف"
                    ar={arItem.body}
                    en={enItem.body}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        steps: replaceAt(ar.steps, i, { ...arItem, body: v }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        steps: replaceAt(en.steps, i, { ...enItem, body: v }),
                      })
                    }
                    multiline
                  />
                </ItemCard>
              );
            },
          )}
        </div>
      );
    }

    if (tab === "services") {
      return (
        <div className="space-y-4">
          <DualField
            label="عنوان صغير"
            ar={ar.servicesSection.eyebrow}
            en={en.servicesSection.eyebrow}
            onAr={(v) =>
              patchAr({
                ...ar,
                servicesSection: { ...ar.servicesSection, eyebrow: v },
              })
            }
            onEn={(v) =>
              patchEn({
                ...en,
                servicesSection: { ...en.servicesSection, eyebrow: v },
              })
            }
          />
          <DualField
            label="عنوان القسم"
            ar={ar.servicesSection.title}
            en={en.servicesSection.title}
            onAr={(v) =>
              patchAr({
                ...ar,
                servicesSection: { ...ar.servicesSection, title: v },
              })
            }
            onEn={(v) =>
              patchEn({
                ...en,
                servicesSection: { ...en.servicesSection, title: v },
              })
            }
          />
          <DualField
            label="وصف القسم"
            ar={ar.servicesSection.body}
            en={en.servicesSection.body}
            onAr={(v) =>
              patchAr({
                ...ar,
                servicesSection: { ...ar.servicesSection, body: v },
              })
            }
            onEn={(v) =>
              patchEn({
                ...en,
                servicesSection: { ...en.servicesSection, body: v },
              })
            }
            multiline
          />
          <DualField
            label="نص الزر"
            ar={ar.servicesSection.cta}
            en={en.servicesSection.cta}
            onAr={(v) =>
              patchAr({
                ...ar,
                servicesSection: { ...ar.servicesSection, cta: v },
              })
            }
            onEn={(v) =>
              patchEn({
                ...en,
                servicesSection: { ...en.servicesSection, cta: v },
              })
            }
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">الخدمات</p>
            <Button
              type="button"
              onClick={() =>
                mapBoth((c) => ({
                  ...c,
                  services: [
                    ...c.services,
                    { title: "", body: "", meta: "", kind: "data" },
                  ],
                }))
              }
            >
              + خدمة
            </Button>
          </div>
          {Array.from(
            { length: Math.max(ar.services.length, en.services.length) },
            (_, i) => {
              const arItem = ar.services[i] ?? {
                title: "",
                body: "",
                meta: "",
                kind: "data",
              };
              const enItem = en.services[i] ?? {
                title: "",
                body: "",
                meta: "",
                kind: "data",
              };
              return (
                <ItemCard
                  key={i}
                  title={`خدمة ${i + 1}`}
                  onRemove={() =>
                    mapBoth((c) => ({
                      ...c,
                      services: c.services.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <DualField
                    label="العنوان"
                    ar={arItem.title}
                    en={enItem.title}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        services: replaceAt(ar.services, i, {
                          ...arItem,
                          title: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        services: replaceAt(en.services, i, {
                          ...enItem,
                          title: v,
                        }),
                      })
                    }
                  />
                  <SharedField
                    label="النوع kind (مشترك)"
                    value={arItem.kind}
                    onChange={(v) =>
                      mapBoth((c) => ({
                        ...c,
                        services: replaceAt(c.services, i, {
                          ...(c.services[i] ?? arItem),
                          kind: v,
                        }),
                      }))
                    }
                  />
                  <DualField
                    label="الوصف"
                    ar={arItem.body}
                    en={enItem.body}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        services: replaceAt(ar.services, i, {
                          ...arItem,
                          body: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        services: replaceAt(en.services, i, {
                          ...enItem,
                          body: v,
                        }),
                      })
                    }
                    multiline
                  />
                  <DualField
                    label="الوصف المختصر (meta)"
                    ar={arItem.meta}
                    en={enItem.meta}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        services: replaceAt(ar.services, i, {
                          ...arItem,
                          meta: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        services: replaceAt(en.services, i, {
                          ...enItem,
                          meta: v,
                        }),
                      })
                    }
                  />
                </ItemCard>
              );
            },
          )}
        </div>
      );
    }

    if (tab === "faqs") {
      return (
        <div className="space-y-4">
          <DualField
            label="عنوان صغير"
            ar={ar.faq.eyebrow}
            en={en.faq.eyebrow}
            onAr={(v) => patchAr({ ...ar, faq: { ...ar.faq, eyebrow: v } })}
            onEn={(v) => patchEn({ ...en, faq: { ...en.faq, eyebrow: v } })}
          />
          <DualField
            label="عنوان القسم"
            ar={ar.faq.title}
            en={en.faq.title}
            onAr={(v) => patchAr({ ...ar, faq: { ...ar.faq, title: v } })}
            onEn={(v) => patchEn({ ...en, faq: { ...en.faq, title: v } })}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">الأسئلة</p>
            <Button
              type="button"
              onClick={() =>
                mapBoth((c) => ({
                  ...c,
                  faqs: [...c.faqs, { q: "", a: "" }],
                }))
              }
            >
              + سؤال
            </Button>
          </div>
          {Array.from(
            { length: Math.max(ar.faqs.length, en.faqs.length) },
            (_, i) => {
              const arItem = ar.faqs[i] ?? { q: "", a: "" };
              const enItem = en.faqs[i] ?? { q: "", a: "" };
              return (
                <ItemCard
                  key={i}
                  title={`سؤال ${i + 1}`}
                  onRemove={() =>
                    mapBoth((c) => ({
                      ...c,
                      faqs: c.faqs.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <DualField
                    label="السؤال"
                    ar={arItem.q}
                    en={enItem.q}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        faqs: replaceAt(ar.faqs, i, { ...arItem, q: v }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        faqs: replaceAt(en.faqs, i, { ...enItem, q: v }),
                      })
                    }
                  />
                  <DualField
                    label="الجواب"
                    ar={arItem.a}
                    en={enItem.a}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        faqs: replaceAt(ar.faqs, i, { ...arItem, a: v }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        faqs: replaceAt(en.faqs, i, { ...enItem, a: v }),
                      })
                    }
                    multiline
                  />
                </ItemCard>
              );
            },
          )}
        </div>
      );
    }

    if (tab === "lists") {
      return (
        <div className="grid gap-6">
          <DualLinesEditor
            label="المدن"
            hint="تظهر في نماذج العميل والمشغّل"
            arValues={ar.cities}
            enValues={en.cities}
            onChange={(cities, citiesEn) =>
              setBundle((b) => ({
                ar: { ...b.ar, cities },
                en: { ...b.en, cities: citiesEn },
              }))
            }
          />
          <DualLinesEditor
            label="خيارات الخدمات في النموذج"
            hint="قائمة اختيار الخدمة في طلب الخدمة"
            arValues={ar.serviceOptions}
            enValues={en.serviceOptions}
            onChange={(serviceOptions, serviceOptionsEn) =>
              setBundle((b) => ({
                ar: { ...b.ar, serviceOptions },
                en: { ...b.en, serviceOptions: serviceOptionsEn },
              }))
            }
          />
        </div>
      );
    }

    if (tab === "why") {
      return (
        <div className="space-y-4">
          <DualField
            label="عنوان صغير"
            ar={ar.why.eyebrow}
            en={en.why.eyebrow}
            onAr={(v) => patchAr({ ...ar, why: { ...ar.why, eyebrow: v } })}
            onEn={(v) => patchEn({ ...en, why: { ...en.why, eyebrow: v } })}
          />
          <DualField
            label="العنوان"
            ar={ar.why.title}
            en={en.why.title}
            onAr={(v) => patchAr({ ...ar, why: { ...ar.why, title: v } })}
            onEn={(v) => patchEn({ ...en, why: { ...en.why, title: v } })}
          />
          <DualField
            label="الوصف"
            ar={ar.why.body}
            en={en.why.body}
            onAr={(v) => patchAr({ ...ar, why: { ...ar.why, body: v } })}
            onEn={(v) => patchEn({ ...en, why: { ...en.why, body: v } })}
            multiline
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">العناصر</p>
            <Button
              type="button"
              onClick={() =>
                mapBoth((c) => ({
                  ...c,
                  whyItems: [...c.whyItems, { title: "", body: "" }],
                }))
              }
            >
              + عنصر
            </Button>
          </div>
          {Array.from(
            { length: Math.max(ar.whyItems.length, en.whyItems.length) },
            (_, i) => {
              const arItem = ar.whyItems[i] ?? { title: "", body: "" };
              const enItem = en.whyItems[i] ?? { title: "", body: "" };
              return (
                <ItemCard
                  key={i}
                  title={`عنصر ${i + 1}`}
                  onRemove={() =>
                    mapBoth((c) => ({
                      ...c,
                      whyItems: c.whyItems.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <DualField
                    label="العنوان"
                    ar={arItem.title}
                    en={enItem.title}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        whyItems: replaceAt(ar.whyItems, i, {
                          ...arItem,
                          title: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        whyItems: replaceAt(en.whyItems, i, {
                          ...enItem,
                          title: v,
                        }),
                      })
                    }
                  />
                  <DualField
                    label="الوصف"
                    ar={arItem.body}
                    en={enItem.body}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        whyItems: replaceAt(ar.whyItems, i, {
                          ...arItem,
                          body: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        whyItems: replaceAt(en.whyItems, i, {
                          ...enItem,
                          body: v,
                        }),
                      })
                    }
                    multiline
                  />
                </ItemCard>
              );
            },
          )}
        </div>
      );
    }

    if (tab === "operators") {
      return (
        <div className="space-y-4">
          <DualField
            label="عنوان صغير"
            ar={ar.operators.eyebrow}
            en={en.operators.eyebrow}
            onAr={(v) =>
              patchAr({
                ...ar,
                operators: { ...ar.operators, eyebrow: v },
              })
            }
            onEn={(v) =>
              patchEn({
                ...en,
                operators: { ...en.operators, eyebrow: v },
              })
            }
          />
          <DualField
            label="العنوان"
            ar={ar.operators.title}
            en={en.operators.title}
            onAr={(v) =>
              patchAr({ ...ar, operators: { ...ar.operators, title: v } })
            }
            onEn={(v) =>
              patchEn({ ...en, operators: { ...en.operators, title: v } })
            }
          />
          <DualField
            label="الوصف"
            ar={ar.operators.body}
            en={en.operators.body}
            onAr={(v) =>
              patchAr({ ...ar, operators: { ...ar.operators, body: v } })
            }
            onEn={(v) =>
              patchEn({ ...en, operators: { ...en.operators, body: v } })
            }
            multiline
          />
          <DualField
            label="نص الزر"
            ar={ar.operators.cta}
            en={en.operators.cta}
            onAr={(v) =>
              patchAr({ ...ar, operators: { ...ar.operators, cta: v } })
            }
            onEn={(v) =>
              patchEn({ ...en, operators: { ...en.operators, cta: v } })
            }
          />
          <DualLinesEditor
            label="المزايا"
            arValues={ar.operatorPerks}
            enValues={en.operatorPerks}
            onChange={(operatorPerks, operatorPerksEn) =>
              setBundle((b) => ({
                ar: { ...b.ar, operatorPerks },
                en: { ...b.en, operatorPerks: operatorPerksEn },
              }))
            }
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">مستويات التأهيل</p>
            <Button
              type="button"
              onClick={() =>
                mapBoth((c) => ({
                  ...c,
                  operatorLevels: [
                    ...c.operatorLevels,
                    {
                      level: String(c.operatorLevels.length + 1),
                      title: "",
                      body: "",
                    },
                  ],
                }))
              }
            >
              + مستوى
            </Button>
          </div>
          {Array.from(
            {
              length: Math.max(
                ar.operatorLevels.length,
                en.operatorLevels.length,
              ),
            },
            (_, i) => {
              const arItem = ar.operatorLevels[i] ?? {
                level: "",
                title: "",
                body: "",
              };
              const enItem = en.operatorLevels[i] ?? {
                level: "",
                title: "",
                body: "",
              };
              return (
                <ItemCard
                  key={i}
                  title={`مستوى ${i + 1}`}
                  onRemove={() =>
                    mapBoth((c) => ({
                      ...c,
                      operatorLevels: c.operatorLevels.filter(
                        (_, idx) => idx !== i,
                      ),
                    }))
                  }
                >
                  <SharedField
                    label="المستوى (مشترك)"
                    value={arItem.level}
                    onChange={(v) =>
                      mapBoth((c) => ({
                        ...c,
                        operatorLevels: replaceAt(c.operatorLevels, i, {
                          ...(c.operatorLevels[i] ?? arItem),
                          level: v,
                        }),
                      }))
                    }
                  />
                  <DualField
                    label="العنوان"
                    ar={arItem.title}
                    en={enItem.title}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        operatorLevels: replaceAt(ar.operatorLevels, i, {
                          ...arItem,
                          title: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        operatorLevels: replaceAt(en.operatorLevels, i, {
                          ...enItem,
                          title: v,
                        }),
                      })
                    }
                  />
                  <DualField
                    label="الوصف"
                    ar={arItem.body}
                    en={enItem.body}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        operatorLevels: replaceAt(ar.operatorLevels, i, {
                          ...arItem,
                          body: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        operatorLevels: replaceAt(en.operatorLevels, i, {
                          ...enItem,
                          body: v,
                        }),
                      })
                    }
                    multiline
                  />
                </ItemCard>
              );
            },
          )}
        </div>
      );
    }

    if (tab === "enterprise") {
      return (
        <div className="space-y-4">
          <DualField
            label="عنوان صغير"
            ar={ar.enterprise.eyebrow}
            en={en.enterprise.eyebrow}
            onAr={(v) =>
              patchAr({
                ...ar,
                enterprise: { ...ar.enterprise, eyebrow: v },
              })
            }
            onEn={(v) =>
              patchEn({
                ...en,
                enterprise: { ...en.enterprise, eyebrow: v },
              })
            }
          />
          <DualField
            label="العنوان"
            ar={ar.enterprise.title}
            en={en.enterprise.title}
            onAr={(v) =>
              patchAr({
                ...ar,
                enterprise: { ...ar.enterprise, title: v },
              })
            }
            onEn={(v) =>
              patchEn({
                ...en,
                enterprise: { ...en.enterprise, title: v },
              })
            }
          />
          <DualField
            label="الوصف"
            ar={ar.enterprise.body}
            en={en.enterprise.body}
            onAr={(v) =>
              patchAr({ ...ar, enterprise: { ...ar.enterprise, body: v } })
            }
            onEn={(v) =>
              patchEn({ ...en, enterprise: { ...en.enterprise, body: v } })
            }
            multiline
          />
          <DualField
            label="نص الزر"
            ar={ar.enterprise.cta}
            en={en.enterprise.cta}
            onAr={(v) =>
              patchAr({ ...ar, enterprise: { ...ar.enterprise, cta: v } })
            }
            onEn={(v) =>
              patchEn({ ...en, enterprise: { ...en.enterprise, cta: v } })
            }
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">العناصر</p>
            <Button
              type="button"
              onClick={() =>
                mapBoth((c) => ({
                  ...c,
                  enterpriseItems: [
                    ...c.enterpriseItems,
                    { title: "", body: "" },
                  ],
                }))
              }
            >
              + عنصر
            </Button>
          </div>
          {Array.from(
            {
              length: Math.max(
                ar.enterpriseItems.length,
                en.enterpriseItems.length,
              ),
            },
            (_, i) => {
              const arItem = ar.enterpriseItems[i] ?? { title: "", body: "" };
              const enItem = en.enterpriseItems[i] ?? { title: "", body: "" };
              return (
                <ItemCard
                  key={i}
                  title={`عنصر ${i + 1}`}
                  onRemove={() =>
                    mapBoth((c) => ({
                      ...c,
                      enterpriseItems: c.enterpriseItems.filter(
                        (_, idx) => idx !== i,
                      ),
                    }))
                  }
                >
                  <DualField
                    label="العنوان"
                    ar={arItem.title}
                    en={enItem.title}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        enterpriseItems: replaceAt(ar.enterpriseItems, i, {
                          ...arItem,
                          title: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        enterpriseItems: replaceAt(en.enterpriseItems, i, {
                          ...enItem,
                          title: v,
                        }),
                      })
                    }
                  />
                  <DualField
                    label="الوصف"
                    ar={arItem.body}
                    en={enItem.body}
                    onAr={(v) =>
                      patchAr({
                        ...ar,
                        enterpriseItems: replaceAt(ar.enterpriseItems, i, {
                          ...arItem,
                          body: v,
                        }),
                      })
                    }
                    onEn={(v) =>
                      patchEn({
                        ...en,
                        enterpriseItems: replaceAt(en.enterpriseItems, i, {
                          ...enItem,
                          body: v,
                        }),
                      })
                    }
                    multiline
                  />
                </ItemCard>
              );
            },
          )}
        </div>
      );
    }

    if (tab === "compliance") {
      return (
        <div className="space-y-4">
          <DualField
            label="عنوان صغير"
            ar={ar.compliance.eyebrow}
            en={en.compliance.eyebrow}
            onAr={(v) =>
              patchAr({
                ...ar,
                compliance: { ...ar.compliance, eyebrow: v },
              })
            }
            onEn={(v) =>
              patchEn({
                ...en,
                compliance: { ...en.compliance, eyebrow: v },
              })
            }
          />
          <DualField
            label="العنوان"
            ar={ar.compliance.title}
            en={en.compliance.title}
            onAr={(v) =>
              patchAr({
                ...ar,
                compliance: { ...ar.compliance, title: v },
              })
            }
            onEn={(v) =>
              patchEn({
                ...en,
                compliance: { ...en.compliance, title: v },
              })
            }
          />
          <DualField
            label="الوصف"
            ar={ar.compliance.body}
            en={en.compliance.body}
            onAr={(v) =>
              patchAr({
                ...ar,
                compliance: { ...ar.compliance, body: v },
              })
            }
            onEn={(v) =>
              patchEn({
                ...en,
                compliance: { ...en.compliance, body: v },
              })
            }
            multiline
          />
          <DualLinesEditor
            label="بنود الامتثال"
            arValues={ar.complianceItems}
            enValues={en.complianceItems}
            onChange={(complianceItems, complianceItemsEn) =>
              setBundle((b) => ({
                ar: { ...b.ar, complianceItems },
                en: { ...b.en, complianceItems: complianceItemsEn },
              }))
            }
          />
          <DualLinesEditor
            label="فحوصات الامتثال السريعة"
            hint="تظهر كنقاط مختصرة إن وُجدت في التصميم"
            arValues={ar.complianceChecks}
            enValues={en.complianceChecks}
            onChange={(complianceChecks, complianceChecksEn) =>
              setBundle((b) => ({
                ar: { ...b.ar, complianceChecks },
                en: { ...b.en, complianceChecks: complianceChecksEn },
              }))
            }
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <DualField
          label="عنوان صغير"
          ar={ar.contact.eyebrow}
          en={en.contact.eyebrow}
          onAr={(v) =>
            patchAr({ ...ar, contact: { ...ar.contact, eyebrow: v } })
          }
          onEn={(v) =>
            patchEn({ ...en, contact: { ...en.contact, eyebrow: v } })
          }
        />
        <DualField
          label="العنوان"
          ar={ar.contact.title}
          en={en.contact.title}
          onAr={(v) =>
            patchAr({ ...ar, contact: { ...ar.contact, title: v } })
          }
          onEn={(v) =>
            patchEn({ ...en, contact: { ...en.contact, title: v } })
          }
        />
        <DualField
          label="الوصف"
          ar={ar.contact.body}
          en={en.contact.body}
          onAr={(v) =>
            patchAr({ ...ar, contact: { ...ar.contact, body: v } })
          }
          onEn={(v) =>
            patchEn({ ...en, contact: { ...en.contact, body: v } })
          }
          multiline
        />
      </div>
    );
  }, [tab, ar, en]);

  return (
    <AdminShell
      title="محتوى الموقع"
      subtitle="كل حقل له خانة عربية وخانة إنجليزية جنب بعض"
      actions={
        <Button onClick={save} disabled={saving}>
          {saving ? "جاري الحفظ…" : "حفظ التغييرات"}
        </Button>
      }
    >
      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>أقسام المحتوى</CardTitle>
            <CardDescription>
              العربية على اليمين، English على اليسار. الحفظ يكتب اللغتين معاً.
            </CardDescription>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max gap-2 pb-2">
              {TABS.map((t) => (
                <Button
                  key={t.id}
                  type="button"
                  size="sm"
                  variant={tab === t.id ? "default" : "outline"}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardHeader>
        <CardContent className="space-y-4">
          {panel}
          {msg ? (
            <p
              className={cn(
                "text-sm",
                msg.includes("تعذر")
                  ? "text-destructive"
                  : "text-muted-foreground",
              )}
            >
              {msg}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
