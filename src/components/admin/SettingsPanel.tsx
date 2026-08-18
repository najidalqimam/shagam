"use client";

import { useState, type ChangeEvent } from "react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  ContentLocale,
  LocalizedSiteSettings,
  SiteSettings,
} from "@/lib/cms/types";

export function SettingsPanel({
  initial,
}: {
  initial: LocalizedSiteSettings;
}) {
  const [editLocale, setEditLocale] = useState<ContentLocale>("ar");
  const [bundle, setBundle] = useState(initial);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const settings = bundle[editLocale];

  const setSettings = (next: SiteSettings) => {
    setBundle((b) => {
      if (editLocale === "ar") {
        return {
          ar: next,
          en: {
            ...b.en,
            contactEmail: next.contactEmail,
            contactPhone: next.contactPhone,
            whatsapp: next.whatsapp,
            facebookUrl: next.facebookUrl,
            instagramUrl: next.instagramUrl,
            twitterUrl: next.twitterUrl,
            linkedinUrl: next.linkedinUrl,
            adminNotes: next.adminNotes,
          },
        };
      }
      return {
        ar: {
          ...b.ar,
          contactEmail: next.contactEmail,
          contactPhone: next.contactPhone,
          whatsapp: next.whatsapp,
          facebookUrl: next.facebookUrl,
          instagramUrl: next.instagramUrl,
          twitterUrl: next.twitterUrl,
          linkedinUrl: next.linkedinUrl,
          adminNotes: next.adminNotes,
        },
        en: next,
      };
    });
  };

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bundle),
      });
      if (!res.ok) throw new Error("fail");
      setMsg(editLocale === "en" ? "Settings saved." : "تم حفظ الإعدادات.");
    } catch {
      setMsg(editLocale === "en" ? "Could not save." : "تعذر الحفظ.");
    } finally {
      setSaving(false);
    }
  };

  const set =
    (key: keyof SiteSettings) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSettings({ ...settings, [key]: e.target.value });

  return (
    <AdminShell
      title="الإعدادات"
      subtitle="اسم الموقع والتذييل بالعربي والإنجليزي — بيانات التواصل مشتركة"
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
                ? "Save settings"
                : "حفظ الإعدادات"}
          </Button>
        </div>
      }
    >
      <div
        className="grid max-w-3xl gap-6"
        dir={editLocale === "en" ? "ltr" : "rtl"}
        lang={editLocale}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              {editLocale === "en" ? "Brand identity" : "الهوية العامة"}
            </CardTitle>
            <CardDescription>
              {editLocale === "en"
                ? "Shown in the header and footer for the English site"
                : "تظهر في الترويسة والتذييل عبر صفحات الموقع"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="siteName">
                {editLocale === "en" ? "Site name" : "اسم الموقع"}
              </Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={set("siteName")}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="tagline">
                {editLocale === "en" ? "Tagline" : "الشعار / الوصف القصير"}
              </Label>
              <Input
                id="tagline"
                value={settings.tagline}
                onChange={set("tagline")}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="footerText">
                {editLocale === "en" ? "Footer text" : "نص الفوتر"}
              </Label>
              <Textarea
                id="footerText"
                rows={3}
                value={settings.footerText}
                onChange={set("footerText")}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="copyrightName">
                {editLocale === "en" ? "Copyright" : "حقوق النشر"}
              </Label>
              <Input
                id="copyrightName"
                value={settings.copyrightName}
                onChange={set("copyrightName")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {editLocale === "en"
                ? "Contact & social (shared)"
                : "التواصل وصفحات التواصل (مشتركة)"}
            </CardTitle>
            <CardDescription>
              {editLocale === "en"
                ? "Same for Arabic and English"
                : "نفس القيم للعربي والإنجليزي"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">
                {editLocale === "en" ? "Email" : "البريد"}
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={set("contactEmail")}
                placeholder="info@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">
                {editLocale === "en" ? "Phone" : "الهاتف"}
              </Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={set("contactPhone")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={settings.whatsapp}
                onChange={set("whatsapp")}
                placeholder="9665xxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook</Label>
              <Input
                id="facebookUrl"
                value={settings.facebookUrl}
                onChange={set("facebookUrl")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram</Label>
              <Input
                id="instagramUrl"
                value={settings.instagramUrl}
                onChange={set("instagramUrl")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitterUrl">X / Twitter</Label>
              <Input
                id="twitterUrl"
                value={settings.twitterUrl}
                onChange={set("twitterUrl")}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input
                id="linkedinUrl"
                value={settings.linkedinUrl}
                onChange={set("linkedinUrl")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {editLocale === "en" ? "Admin notes" : "ملاحظات داخلية"}
            </CardTitle>
            <CardDescription>
              {editLocale === "en"
                ? "Not shown on the public site"
                : "لا تظهر على الموقع العام"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={4}
              value={settings.adminNotes}
              onChange={set("adminNotes")}
            />
          </CardContent>
          <CardFooter>
            {msg ? (
              <p className="text-sm text-muted-foreground">{msg}</p>
            ) : null}
          </CardFooter>
        </Card>
      </div>
    </AdminShell>
  );
}
