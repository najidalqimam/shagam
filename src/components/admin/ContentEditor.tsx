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
import type { ContentLocale, LocalizedSiteContent, SiteContent } from "@/lib/cms/types";
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

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {multiline ? (
        <Textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
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
    <div className="rounded-xl border border-[#07564F]/10 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold text-[#4d6f6a]">{title}</p>
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
      {children}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" onClick={onClick}>
      + {label}
    </Button>
  );
}

function LinesEditor({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
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
          onClick={() => onChange([...value, ""])}
        >
          + إضافة سطر
        </Button>
      </div>
      <div className="space-y-2">
        {value.map((line, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={line}
              onChange={(e) => {
                const next = [...value];
                next[i] = e.target.value;
                onChange(next);
              }}
              placeholder={`عنصر ${i + 1}`}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 text-destructive"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            >
              حذف
            </Button>
          </div>
        ))}
        {value.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا عناصر بعد.</p>
        ) : null}
      </div>
    </div>
  );
}

export function ContentEditor({ initial }: { initial: LocalizedSiteContent }) {
  const [tab, setTab] = useState<TabId>("hero");
  const [editLocale, setEditLocale] = useState<ContentLocale>("ar");
  const [bundle, setBundle] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const content = bundle[editLocale];
  const setContent = (next: SiteContent) => {
    setBundle((b) => ({ ...b, [editLocale]: next }));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab") as TabId | null;
    if (t && TABS.some((x) => x.id === t)) setTab(t);
    const lang = params.get("lang");
    if (lang === "en" || lang === "ar") setEditLocale(lang);
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
      setMsg(
        editLocale === "en"
          ? "English content saved."
          : "تم حفظ المحتوى بنجاح.",
      );
    } catch {
      setMsg(
        editLocale === "en"
          ? "Could not save. Check your login."
          : "تعذر الحفظ. تأكد من تسجيل الدخول.",
      );
    } finally {
      setSaving(false);
    }
  };

  const panel = useMemo(() => {
    if (tab === "hero") {
      return (
        <div className="grid gap-4">
          <Field
            label="سطر علوي"
            value={content.hero.eyebrow}
            onChange={(v) =>
              setContent({ ...content, hero: { ...content.hero, eyebrow: v } })
            }
          />
          <Field
            label="العنوان"
            value={content.hero.title}
            onChange={(v) =>
              setContent({ ...content, hero: { ...content.hero, title: v } })
            }
            multiline
          />
          <Field
            label="الوصف"
            value={content.hero.body}
            onChange={(v) =>
              setContent({ ...content, hero: { ...content.hero, body: v } })
            }
            multiline
          />
          <Field
            label="زر أساسي"
            value={content.hero.primaryCta}
            onChange={(v) =>
              setContent({
                ...content,
                hero: { ...content.hero, primaryCta: v },
              })
            }
          />
          <Field
            label="زر ثانوي"
            value={content.hero.secondaryCta}
            onChange={(v) =>
              setContent({
                ...content,
                hero: { ...content.hero, secondaryCta: v },
              })
            }
          />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">الإحصائيات</p>
              <AddButton
                label="إحصائية"
                onClick={() =>
                  setContent({
                    ...content,
                    stats: [...content.stats, { value: "0", label: "جديد" }],
                  })
                }
              />
            </div>
            {content.stats.map((s, i) => (
              <ItemCard
                key={i}
                title={`إحصائية ${i + 1}`}
                onRemove={() =>
                  setContent({
                    ...content,
                    stats: content.stats.filter((_, idx) => idx !== i),
                  })
                }
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="القيمة"
                    value={s.value}
                    onChange={(v) => {
                      const stats = [...content.stats];
                      stats[i] = { ...stats[i], value: v };
                      setContent({ ...content, stats });
                    }}
                  />
                  <Field
                    label="العنوان"
                    value={s.label}
                    onChange={(v) => {
                      const stats = [...content.stats];
                      stats[i] = { ...stats[i], label: v };
                      setContent({ ...content, stats });
                    }}
                  />
                </div>
              </ItemCard>
            ))}
          </div>
        </div>
      );
    }

    if (tab === "nav") {
      return (
        <div className="space-y-3">
          {content.navLinks.map((link, i) => (
            <ItemCard
              key={i}
              title={`رابط ${i + 1}`}
              onRemove={() =>
                setContent({
                  ...content,
                  navLinks: content.navLinks.filter((_, idx) => idx !== i),
                })
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="النص"
                  value={link.label}
                  onChange={(v) => {
                    const navLinks = [...content.navLinks];
                    navLinks[i] = { ...navLinks[i], label: v };
                    setContent({ ...content, navLinks });
                  }}
                />
                <Field
                  label="الرابط"
                  value={link.href}
                  onChange={(v) => {
                    const navLinks = [...content.navLinks];
                    navLinks[i] = { ...navLinks[i], href: v };
                    setContent({ ...content, navLinks });
                  }}
                />
              </div>
            </ItemCard>
          ))}
          <AddButton
            label="إضافة رابط"
            onClick={() =>
              setContent({
                ...content,
                navLinks: [
                  ...content.navLinks,
                  { href: "#", label: "رابط جديد" },
                ],
              })
            }
          />
        </div>
      );
    }

    if (tab === "how") {
      return (
        <div className="space-y-4">
          <Field
            label="عنوان صغير"
            value={content.how.eyebrow}
            onChange={(v) =>
              setContent({ ...content, how: { ...content.how, eyebrow: v } })
            }
          />
          <Field
            label="العنوان"
            value={content.how.title}
            onChange={(v) =>
              setContent({ ...content, how: { ...content.how, title: v } })
            }
          />
          <Field
            label="الوصف"
            value={content.how.body}
            onChange={(v) =>
              setContent({ ...content, how: { ...content.how, body: v } })
            }
            multiline
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">الخطوات</p>
            <AddButton
              label="خطوة"
              onClick={() =>
                setContent({
                  ...content,
                  steps: [
                    ...content.steps,
                    {
                      num: String(content.steps.length + 1).padStart(2, "0"),
                      title: "خطوة جديدة",
                      body: "",
                    },
                  ],
                })
              }
            />
          </div>
          {content.steps.map((step, i) => (
            <ItemCard
              key={i}
              title={`الخطوة ${step.num || i + 1}`}
              onRemove={() =>
                setContent({
                  ...content,
                  steps: content.steps.filter((_, idx) => idx !== i),
                })
              }
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Field
                  label="الرقم"
                  value={step.num}
                  onChange={(v) => {
                    const steps = [...content.steps];
                    steps[i] = { ...steps[i], num: v };
                    setContent({ ...content, steps });
                  }}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="العنوان"
                    value={step.title}
                    onChange={(v) => {
                      const steps = [...content.steps];
                      steps[i] = { ...steps[i], title: v };
                      setContent({ ...content, steps });
                    }}
                  />
                </div>
              </div>
              <div className="mt-3">
                <Field
                  label="الوصف"
                  value={step.body}
                  onChange={(v) => {
                    const steps = [...content.steps];
                    steps[i] = { ...steps[i], body: v };
                    setContent({ ...content, steps });
                  }}
                  multiline
                />
              </div>
            </ItemCard>
          ))}
        </div>
      );
    }

    if (tab === "services") {
      return (
        <div className="space-y-4">
          <Field
            label="عنوان صغير"
            value={content.servicesSection.eyebrow}
            onChange={(v) =>
              setContent({
                ...content,
                servicesSection: { ...content.servicesSection, eyebrow: v },
              })
            }
          />
          <Field
            label="عنوان القسم"
            value={content.servicesSection.title}
            onChange={(v) =>
              setContent({
                ...content,
                servicesSection: { ...content.servicesSection, title: v },
              })
            }
          />
          <Field
            label="وصف القسم"
            value={content.servicesSection.body}
            onChange={(v) =>
              setContent({
                ...content,
                servicesSection: { ...content.servicesSection, body: v },
              })
            }
            multiline
          />
          <Field
            label="نص الزر"
            value={content.servicesSection.cta}
            onChange={(v) =>
              setContent({
                ...content,
                servicesSection: { ...content.servicesSection, cta: v },
              })
            }
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">الخدمات</p>
            <AddButton
              label="خدمة"
              onClick={() =>
                setContent({
                  ...content,
                  services: [
                    ...content.services,
                    {
                      title: "خدمة جديدة",
                      body: "",
                      meta: "",
                      kind: "data",
                    },
                  ],
                })
              }
            />
          </div>
          {content.services.map((service, i) => (
            <ItemCard
              key={i}
              title={`خدمة ${i + 1}`}
              onRemove={() =>
                setContent({
                  ...content,
                  services: content.services.filter((_, idx) => idx !== i),
                })
              }
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="العنوان"
                  value={service.title}
                  onChange={(v) => {
                    const services = [...content.services];
                    services[i] = { ...services[i], title: v };
                    setContent({ ...content, services });
                  }}
                />
                <Field
                  label="النوع (kind)"
                  value={service.kind}
                  onChange={(v) => {
                    const services = [...content.services];
                    services[i] = { ...services[i], kind: v };
                    setContent({ ...content, services });
                  }}
                />
              </div>
              <div className="mt-3">
                <Field
                  label="الوصف"
                  value={service.body}
                  onChange={(v) => {
                    const services = [...content.services];
                    services[i] = { ...services[i], body: v };
                    setContent({ ...content, services });
                  }}
                  multiline
                />
              </div>
              <div className="mt-3">
                <Field
                  label="الوصف المختصر (meta)"
                  value={service.meta}
                  onChange={(v) => {
                    const services = [...content.services];
                    services[i] = { ...services[i], meta: v };
                    setContent({ ...content, services });
                  }}
                />
              </div>
            </ItemCard>
          ))}
        </div>
      );
    }

    if (tab === "faqs") {
      return (
        <div className="space-y-4">
          <Field
            label="عنوان صغير"
            value={content.faq.eyebrow}
            onChange={(v) =>
              setContent({ ...content, faq: { ...content.faq, eyebrow: v } })
            }
          />
          <Field
            label="عنوان القسم"
            value={content.faq.title}
            onChange={(v) =>
              setContent({ ...content, faq: { ...content.faq, title: v } })
            }
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">الأسئلة</p>
            <AddButton
              label="سؤال"
              onClick={() =>
                setContent({
                  ...content,
                  faqs: [...content.faqs, { q: "سؤال جديد؟", a: "" }],
                })
              }
            />
          </div>
          {content.faqs.map((faq, i) => (
            <ItemCard
              key={i}
              title={`سؤال ${i + 1}`}
              onRemove={() =>
                setContent({
                  ...content,
                  faqs: content.faqs.filter((_, idx) => idx !== i),
                })
              }
            >
              <Field
                label="السؤال"
                value={faq.q}
                onChange={(v) => {
                  const faqs = [...content.faqs];
                  faqs[i] = { ...faqs[i], q: v };
                  setContent({ ...content, faqs });
                }}
              />
              <div className="mt-3">
                <Field
                  label="الجواب"
                  value={faq.a}
                  onChange={(v) => {
                    const faqs = [...content.faqs];
                    faqs[i] = { ...faqs[i], a: v };
                    setContent({ ...content, faqs });
                  }}
                  multiline
                />
              </div>
            </ItemCard>
          ))}
        </div>
      );
    }

    if (tab === "lists") {
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          <LinesEditor
            label="المدن"
            hint="تظهر في نماذج العميل والمشغّل"
            value={content.cities}
            onChange={(cities) => setContent({ ...content, cities })}
          />
          <LinesEditor
            label="خيارات الخدمات في النموذج"
            hint="قائمة اختيار الخدمة في طلب الخدمة"
            value={content.serviceOptions}
            onChange={(serviceOptions) =>
              setContent({ ...content, serviceOptions })
            }
          />
        </div>
      );
    }

    if (tab === "why") {
      return (
        <div className="space-y-4">
          <Field
            label="عنوان صغير"
            value={content.why.eyebrow}
            onChange={(v) =>
              setContent({ ...content, why: { ...content.why, eyebrow: v } })
            }
          />
          <Field
            label="العنوان"
            value={content.why.title}
            onChange={(v) =>
              setContent({ ...content, why: { ...content.why, title: v } })
            }
          />
          <Field
            label="الوصف"
            value={content.why.body}
            onChange={(v) =>
              setContent({ ...content, why: { ...content.why, body: v } })
            }
            multiline
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">العناصر</p>
            <AddButton
              label="عنصر"
              onClick={() =>
                setContent({
                  ...content,
                  whyItems: [
                    ...content.whyItems,
                    { title: "عنصر جديد", body: "" },
                  ],
                })
              }
            />
          </div>
          {content.whyItems.map((item, i) => (
            <ItemCard
              key={i}
              title={`عنصر ${i + 1}`}
              onRemove={() =>
                setContent({
                  ...content,
                  whyItems: content.whyItems.filter((_, idx) => idx !== i),
                })
              }
            >
              <Field
                label="العنوان"
                value={item.title}
                onChange={(v) => {
                  const whyItems = [...content.whyItems];
                  whyItems[i] = { ...whyItems[i], title: v };
                  setContent({ ...content, whyItems });
                }}
              />
              <div className="mt-3">
                <Field
                  label="الوصف"
                  value={item.body}
                  onChange={(v) => {
                    const whyItems = [...content.whyItems];
                    whyItems[i] = { ...whyItems[i], body: v };
                    setContent({ ...content, whyItems });
                  }}
                  multiline
                />
              </div>
            </ItemCard>
          ))}
        </div>
      );
    }

    if (tab === "operators") {
      return (
        <div className="space-y-4">
          <Field
            label="عنوان صغير"
            value={content.operators.eyebrow}
            onChange={(v) =>
              setContent({
                ...content,
                operators: { ...content.operators, eyebrow: v },
              })
            }
          />
          <Field
            label="العنوان"
            value={content.operators.title}
            onChange={(v) =>
              setContent({
                ...content,
                operators: { ...content.operators, title: v },
              })
            }
          />
          <Field
            label="الوصف"
            value={content.operators.body}
            onChange={(v) =>
              setContent({
                ...content,
                operators: { ...content.operators, body: v },
              })
            }
            multiline
          />
          <Field
            label="نص الزر"
            value={content.operators.cta}
            onChange={(v) =>
              setContent({
                ...content,
                operators: { ...content.operators, cta: v },
              })
            }
          />
          <LinesEditor
            label="المزايا"
            value={content.operatorPerks}
            onChange={(operatorPerks) =>
              setContent({ ...content, operatorPerks })
            }
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">مستويات التأهيل</p>
            <AddButton
              label="مستوى"
              onClick={() =>
                setContent({
                  ...content,
                  operatorLevels: [
                    ...content.operatorLevels,
                    {
                      level: String(content.operatorLevels.length + 1),
                      title: "مستوى جديد",
                      body: "",
                    },
                  ],
                })
              }
            />
          </div>
          {content.operatorLevels.map((level, i) => (
            <ItemCard
              key={i}
              title={`مستوى ${i + 1}`}
              onRemove={() =>
                setContent({
                  ...content,
                  operatorLevels: content.operatorLevels.filter(
                    (_, idx) => idx !== i,
                  ),
                })
              }
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <Field
                  label="المستوى"
                  value={level.level}
                  onChange={(v) => {
                    const operatorLevels = [...content.operatorLevels];
                    operatorLevels[i] = { ...operatorLevels[i], level: v };
                    setContent({ ...content, operatorLevels });
                  }}
                />
                <Field
                  label="العنوان"
                  value={level.title}
                  onChange={(v) => {
                    const operatorLevels = [...content.operatorLevels];
                    operatorLevels[i] = { ...operatorLevels[i], title: v };
                    setContent({ ...content, operatorLevels });
                  }}
                />
                <Field
                  label="الوصف"
                  value={level.body}
                  onChange={(v) => {
                    const operatorLevels = [...content.operatorLevels];
                    operatorLevels[i] = { ...operatorLevels[i], body: v };
                    setContent({ ...content, operatorLevels });
                  }}
                />
              </div>
            </ItemCard>
          ))}
        </div>
      );
    }

    if (tab === "enterprise") {
      return (
        <div className="space-y-4">
          <Field
            label="عنوان صغير"
            value={content.enterprise.eyebrow}
            onChange={(v) =>
              setContent({
                ...content,
                enterprise: { ...content.enterprise, eyebrow: v },
              })
            }
          />
          <Field
            label="العنوان"
            value={content.enterprise.title}
            onChange={(v) =>
              setContent({
                ...content,
                enterprise: { ...content.enterprise, title: v },
              })
            }
          />
          <Field
            label="الوصف"
            value={content.enterprise.body}
            onChange={(v) =>
              setContent({
                ...content,
                enterprise: { ...content.enterprise, body: v },
              })
            }
            multiline
          />
          <Field
            label="نص الزر"
            value={content.enterprise.cta}
            onChange={(v) =>
              setContent({
                ...content,
                enterprise: { ...content.enterprise, cta: v },
              })
            }
          />
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">العناصر</p>
            <AddButton
              label="عنصر"
              onClick={() =>
                setContent({
                  ...content,
                  enterpriseItems: [
                    ...content.enterpriseItems,
                    { title: "عنصر جديد", body: "" },
                  ],
                })
              }
            />
          </div>
          {content.enterpriseItems.map((item, i) => (
            <ItemCard
              key={i}
              title={`عنصر ${i + 1}`}
              onRemove={() =>
                setContent({
                  ...content,
                  enterpriseItems: content.enterpriseItems.filter(
                    (_, idx) => idx !== i,
                  ),
                })
              }
            >
              <Field
                label="العنوان"
                value={item.title}
                onChange={(v) => {
                  const enterpriseItems = [...content.enterpriseItems];
                  enterpriseItems[i] = { ...enterpriseItems[i], title: v };
                  setContent({ ...content, enterpriseItems });
                }}
              />
              <div className="mt-3">
                <Field
                  label="الوصف"
                  value={item.body}
                  onChange={(v) => {
                    const enterpriseItems = [...content.enterpriseItems];
                    enterpriseItems[i] = { ...enterpriseItems[i], body: v };
                    setContent({ ...content, enterpriseItems });
                  }}
                  multiline
                />
              </div>
            </ItemCard>
          ))}
        </div>
      );
    }

    if (tab === "compliance") {
      return (
        <div className="space-y-4">
          <Field
            label="عنوان صغير"
            value={content.compliance.eyebrow}
            onChange={(v) =>
              setContent({
                ...content,
                compliance: { ...content.compliance, eyebrow: v },
              })
            }
          />
          <Field
            label="العنوان"
            value={content.compliance.title}
            onChange={(v) =>
              setContent({
                ...content,
                compliance: { ...content.compliance, title: v },
              })
            }
          />
          <Field
            label="الوصف"
            value={content.compliance.body}
            onChange={(v) =>
              setContent({
                ...content,
                compliance: { ...content.compliance, body: v },
              })
            }
            multiline
          />
          <LinesEditor
            label="بنود الامتثال"
            value={content.complianceItems}
            onChange={(complianceItems) =>
              setContent({ ...content, complianceItems })
            }
          />
          <LinesEditor
            label="فحوصات الامتثال السريعة"
            hint="تظهر كنقاط مختصرة إن وُجدت في التصميم"
            value={content.complianceChecks}
            onChange={(complianceChecks) =>
              setContent({ ...content, complianceChecks })
            }
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <Field
          label="عنوان صغير"
          value={content.contact.eyebrow}
          onChange={(v) =>
            setContent({
              ...content,
              contact: { ...content.contact, eyebrow: v },
            })
          }
        />
        <Field
          label="العنوان"
          value={content.contact.title}
          onChange={(v) =>
            setContent({
              ...content,
              contact: { ...content.contact, title: v },
            })
          }
        />
        <Field
          label="الوصف"
          value={content.contact.body}
          onChange={(v) =>
            setContent({
              ...content,
              contact: { ...content.contact, body: v },
            })
          }
          multiline
        />
      </div>
    );
  }, [tab, content, editLocale]);

  return (
    <AdminShell
      title="محتوى الموقع"
      subtitle="عدّل النسخة العربية والإنجليزية لكل أقسام الصفحة الرئيسية والنماذج"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-[#07564F]/15 p-0.5">
            <Button
              type="button"
              size="sm"
              variant={editLocale === "ar" ? "default" : "ghost"}
              className="h-8"
              onClick={() => setEditLocale("ar")}
            >
              عربي
            </Button>
            <Button
              type="button"
              size="sm"
              variant={editLocale === "en" ? "default" : "ghost"}
              className="h-8"
              onClick={() => setEditLocale("en")}
            >
              English
            </Button>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving
              ? editLocale === "en"
                ? "Saving…"
                : "جاري الحفظ…"
              : editLocale === "en"
                ? "Save changes"
                : "حفظ التغييرات"}
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>
              {editLocale === "en" ? "Content sections" : "أقسام المحتوى"}
            </CardTitle>
            <CardDescription>
              {editLocale === "en"
                ? "Editing English copy. Switch to عربي for Arabic. Save writes both languages."
                : "تحرّر النسخة العربية الآن. بدّل إلى English للإنجليزية. الحفظ يحفظ اللغتين معاً."}
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
        <CardContent
          className="space-y-4"
          dir={editLocale === "en" ? "ltr" : "rtl"}
          lang={editLocale}
        >
          {panel}
          {msg ? (
            <p
              className={cn(
                "text-sm",
                msg.includes("تعذر") || msg.includes("Could not")
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
