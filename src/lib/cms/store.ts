import { cache } from "react";
import {
  defaultSiteContentEn,
  defaultSettingsEn,
} from "@/lib/i18n/content-en";
import { laravelJson } from "./laravel";
import {
  defaultSettings,
  defaultSiteContent,
  type FormSubmission,
  type LocalizedSiteContent,
  type LocalizedSiteSettings,
  type SiteContent,
  type SiteSettings,
} from "./types";

type ContentBundle = {
  content: LocalizedSiteContent;
  settings: LocalizedSiteSettings;
};

function isLocalizedContent(
  value: unknown,
): value is Partial<LocalizedSiteContent> {
  return (
    !!value &&
    typeof value === "object" &&
    "ar" in value &&
    "en" in value &&
    typeof (value as LocalizedSiteContent).ar === "object" &&
    typeof (value as LocalizedSiteContent).en === "object"
  );
}

function isLocalizedSettings(
  value: unknown,
): value is Partial<LocalizedSiteSettings> {
  return (
    !!value &&
    typeof value === "object" &&
    "ar" in value &&
    "en" in value &&
    typeof (value as LocalizedSiteSettings).ar === "object" &&
    typeof (value as LocalizedSiteSettings).en === "object"
  );
}

function mergeContent(
  defaults: SiteContent,
  stored?: Partial<SiteContent> | null,
): SiteContent {
  if (!stored) return defaults;
  return { ...defaults, ...stored } as SiteContent;
}

function mergeSettings(
  defaults: SiteSettings,
  stored?: Partial<SiteSettings> | null,
): SiteSettings {
  if (!stored) return defaults;
  return { ...defaults, ...stored };
}

/** Shared contact channels stay identical across locales. */
function syncSharedSettings(
  primary: SiteSettings,
  secondary: SiteSettings,
): SiteSettings {
  return {
    ...secondary,
    contactEmail: primary.contactEmail,
    contactPhone: primary.contactPhone,
    whatsapp: primary.whatsapp,
    facebookUrl: primary.facebookUrl,
    instagramUrl: primary.instagramUrl,
    twitterUrl: primary.twitterUrl,
    linkedinUrl: primary.linkedinUrl,
    adminNotes: primary.adminNotes,
  };
}

const loadBundle = cache(async (): Promise<ContentBundle> => {
  return laravelJson<ContentBundle>("/content");
});

export async function getLocalizedSiteContent(): Promise<LocalizedSiteContent> {
  const defaultsAr = defaultSiteContent();
  const defaultsEn = defaultSiteContentEn();
  const stored = (await loadBundle()).content;

  if (isLocalizedContent(stored)) {
    return {
      ar: mergeContent(defaultsAr, stored.ar),
      en: mergeContent(defaultsEn, stored.en),
    };
  }

  return { ar: defaultsAr, en: defaultsEn };
}

/** Arabic content by default (dashboard stats, legacy callers). */
export async function getSiteContent(): Promise<SiteContent> {
  const { ar } = await getLocalizedSiteContent();
  return ar;
}

export async function saveLocalizedSiteContent(
  content: LocalizedSiteContent,
): Promise<void> {
  await laravelJson("/admin/content", {
    method: "PUT",
    admin: true,
    body: JSON.stringify({ ar: content.ar, en: content.en }),
  });
}

/** @deprecated Prefer saveLocalizedSiteContent — saves Arabic only and keeps EN. */
export async function saveSiteContent(content: SiteContent): Promise<void> {
  const current = await getLocalizedSiteContent();
  await saveLocalizedSiteContent({ ...current, ar: content });
}

export async function getLocalizedSettings(): Promise<LocalizedSiteSettings> {
  const defaultsAr = defaultSettings();
  const defaultsEn = defaultSettingsEn();
  const stored = (await loadBundle()).settings;

  if (isLocalizedSettings(stored)) {
    const ar = mergeSettings(defaultsAr, stored.ar);
    const en = syncSharedSettings(ar, mergeSettings(defaultsEn, stored.en));
    return { ar, en };
  }

  return {
    ar: defaultsAr,
    en: syncSharedSettings(defaultsAr, defaultsEn),
  };
}

export async function getSettings(): Promise<SiteSettings> {
  const { ar } = await getLocalizedSettings();
  return ar;
}

export async function saveLocalizedSettings(
  settings: LocalizedSiteSettings,
): Promise<void> {
  const ar = settings.ar;
  const en = syncSharedSettings(ar, settings.en);
  await laravelJson("/admin/settings", {
    method: "PUT",
    admin: true,
    body: JSON.stringify({ ar, en }),
  });
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  const current = await getLocalizedSettings();
  await saveLocalizedSettings({
    ar: settings,
    en: syncSharedSettings(settings, current.en),
  });
}

export async function getSubmissions(): Promise<FormSubmission[]> {
  const list = await laravelJson<FormSubmission[]>("/admin/submissions", {
    admin: true,
  });
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addSubmission(
  payload: Record<string, unknown>,
): Promise<FormSubmission> {
  const result = await laravelJson<{ ok: boolean; id: string }>("/submissions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return {
    id: result.id,
    createdAt: new Date().toISOString(),
    status: "new",
    payload,
  };
}

export async function addSubmissionForm(form: FormData): Promise<{ id: string }> {
  const result = await laravelJson<{ ok: boolean; id: string }>("/submissions", {
    method: "POST",
    body: form,
  });
  return { id: result.id };
}

export async function updateSubmissionStatus(
  id: string,
  status: FormSubmission["status"],
): Promise<FormSubmission | null> {
  try {
    return await laravelJson<FormSubmission>("/admin/submissions", {
      method: "PATCH",
      admin: true,
      body: JSON.stringify({ id, status }),
    });
  } catch {
    return null;
  }
}

export async function deleteSubmission(id: string): Promise<boolean> {
  try {
    await laravelJson("/admin/submissions", {
      method: "DELETE",
      admin: true,
      body: JSON.stringify({ id }),
    });
    return true;
  } catch {
    return false;
  }
}

export type StoredDroneCatalog = {
  version: number;
  generatedAt: string;
  source: string;
  manufacturers: Array<{
    id: string;
    name: string;
    models: Array<{ id: string; name: string }>;
  }>;
};

export async function getDroneCatalog(): Promise<StoredDroneCatalog> {
  const empty: StoredDroneCatalog = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: "database",
    manufacturers: [],
  };
  const catalog = await laravelJson<StoredDroneCatalog>("/catalog");
  return {
    ...empty,
    ...catalog,
    manufacturers: Array.isArray(catalog.manufacturers)
      ? catalog.manufacturers
      : [],
  };
}

export async function saveDroneCatalog(
  catalog: StoredDroneCatalog,
): Promise<void> {
  await laravelJson("/admin/catalog", {
    method: "PUT",
    admin: true,
    body: JSON.stringify({
      ...catalog,
      version: catalog.version || 1,
      source: catalog.source || "admin",
    }),
  });
}

export async function getDashboardStats() {
  return laravelJson<{
    services: number;
    faqs: number;
    cities: number;
    submissionsTotal: number;
    submissionsNew: number;
    submissionsReviewed: number;
    submissionsArchived: number;
    recentSubmissions: FormSubmission[];
  }>("/admin/stats", { admin: true });
}
