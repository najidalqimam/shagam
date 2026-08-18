import { promises as fs } from "fs";
import path from "path";
import {
  defaultSiteContentEn,
  defaultSettingsEn,
} from "@/lib/i18n/content-en";
import {
  defaultSettings,
  defaultSiteContent,
  type FormSubmission,
  type LocalizedSiteContent,
  type LocalizedSiteSettings,
  type SiteContent,
  type SiteSettings,
} from "./types";

const CMS_DIR = path.join(process.cwd(), "data", "cms");
const CONTENT_FILE = path.join(CMS_DIR, "site-content.json");
const SETTINGS_FILE = path.join(CMS_DIR, "settings.json");
const SUBMISSIONS_FILE = path.join(CMS_DIR, "submissions.json");
const DRONE_CATALOG_FILE = path.join(
  process.cwd(),
  "src",
  "data",
  "droneCatalog.json",
);

async function ensureDir() {
  await fs.mkdir(CMS_DIR, { recursive: true });
}

async function readJsonFile<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile(file: string, data: unknown) {
  await ensureDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

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

export async function getLocalizedSiteContent(): Promise<LocalizedSiteContent> {
  const defaultsAr = defaultSiteContent();
  const defaultsEn = defaultSiteContentEn();
  const stored = await readJsonFile<unknown>(CONTENT_FILE, null);

  if (!stored) {
    const bundle: LocalizedSiteContent = {
      ar: defaultsAr,
      en: defaultsEn,
    };
    await writeJsonFile(CONTENT_FILE, bundle);
    return bundle;
  }

  if (isLocalizedContent(stored)) {
    return {
      ar: mergeContent(defaultsAr, stored.ar),
      en: mergeContent(defaultsEn, stored.en),
    };
  }

  // Legacy flat JSON = Arabic only
  const bundle: LocalizedSiteContent = {
    ar: mergeContent(defaultsAr, stored as Partial<SiteContent>),
    en: defaultsEn,
  };
  await writeJsonFile(CONTENT_FILE, bundle);
  return bundle;
}

/** Arabic content by default (dashboard stats, legacy callers). */
export async function getSiteContent(): Promise<SiteContent> {
  const { ar } = await getLocalizedSiteContent();
  return ar;
}

export async function saveLocalizedSiteContent(
  content: LocalizedSiteContent,
): Promise<void> {
  await writeJsonFile(CONTENT_FILE, {
    ar: content.ar,
    en: content.en,
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
  const stored = await readJsonFile<unknown>(SETTINGS_FILE, null);

  if (!stored) {
    const bundle: LocalizedSiteSettings = {
      ar: defaultsAr,
      en: defaultsEn,
    };
    await writeJsonFile(SETTINGS_FILE, bundle);
    return bundle;
  }

  if (isLocalizedSettings(stored)) {
    const ar = mergeSettings(defaultsAr, stored.ar);
    const en = syncSharedSettings(ar, mergeSettings(defaultsEn, stored.en));
    return { ar, en };
  }

  const ar = mergeSettings(defaultsAr, stored as Partial<SiteSettings>);
  const bundle: LocalizedSiteSettings = {
    ar,
    en: syncSharedSettings(ar, defaultsEn),
  };
  await writeJsonFile(SETTINGS_FILE, bundle);
  return bundle;
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
  await writeJsonFile(SETTINGS_FILE, { ar, en });
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  const current = await getLocalizedSettings();
  await saveLocalizedSettings({
    ar: settings,
    en: syncSharedSettings(settings, current.en),
  });
}

export async function getSubmissions(): Promise<FormSubmission[]> {
  const list = await readJsonFile<FormSubmission[]>(SUBMISSIONS_FILE, []);
  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function addSubmission(
  payload: Record<string, unknown>,
  id?: string,
): Promise<FormSubmission> {
  const list = await getSubmissions();
  const entry: FormSubmission = {
    id:
      id ??
      `sub_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: "new",
    payload,
  };
  list.unshift(entry);
  await writeJsonFile(SUBMISSIONS_FILE, list);
  return entry;
}

export async function updateSubmissionStatus(
  id: string,
  status: FormSubmission["status"],
): Promise<FormSubmission | null> {
  const list = await getSubmissions();
  const idx = list.findIndex((s) => s.id === id);
  if (idx < 0) return null;
  list[idx] = { ...list[idx], status };
  await writeJsonFile(SUBMISSIONS_FILE, list);
  return list[idx];
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const list = await getSubmissions();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) return false;
  await writeJsonFile(SUBMISSIONS_FILE, next);
  return true;
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
    source: "admin",
    manufacturers: [],
  };
  return readJsonFile<StoredDroneCatalog>(DRONE_CATALOG_FILE, empty);
}

export async function saveDroneCatalog(
  catalog: StoredDroneCatalog,
): Promise<void> {
  await writeJsonFile(DRONE_CATALOG_FILE, {
    ...catalog,
    version: catalog.version || 1,
    generatedAt: new Date().toISOString(),
    source: catalog.source || "admin",
  });
}

export async function getDashboardStats() {
  const [content, submissions] = await Promise.all([
    getSiteContent(),
    getSubmissions(),
  ]);
  const submissionsNew = submissions.filter((s) => s.status === "new").length;
  const submissionsReviewed = submissions.filter(
    (s) => s.status === "reviewed",
  ).length;
  const submissionsArchived = submissions.filter(
    (s) => s.status === "archived",
  ).length;
  return {
    services: content.services.length,
    faqs: content.faqs.length,
    cities: content.cities.length,
    submissionsTotal: submissions.length,
    submissionsNew,
    submissionsReviewed,
    submissionsArchived,
    recentSubmissions: submissions.slice(0, 6),
  };
}
