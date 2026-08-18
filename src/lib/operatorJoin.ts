export const OPERATOR_JOIN_DRAFT_KEY = "shagam-operator-join-draft-v1";
export const OPERATOR_ROLE_VALUE = "مشغّل طائرات مسيّرة";
export const ORG_TYPE_ENTITY = "كيان";
export const ORG_TYPE_INDIVIDUAL = "فرد";

export type OperatorOrgType = typeof ORG_TYPE_ENTITY | typeof ORG_TYPE_INDIVIDUAL;

export type OperatorJoinStep = 1 | 2 | 3 | 4;

export type OperatorBasicInfo = {
  fullName: string;
  organization: string;
  phone: string;
  email: string;
  city: string;
  operatingSector: string;
};

export type OperatorLicenseMeta = {
  name: string;
  size: number;
  type: string;
  licenseNumber: string;
  expiryDate: string;
};

export type OperatorJoinDraftJson = {
  step: OperatorJoinStep;
  basic: OperatorBasicInfo;
  license: OperatorLicenseMeta;
  fleet: import("./droneCatalog").FleetAircraftDraft[];
  agreed: boolean;
  updatedAt: string;
};

export function emptyBasicInfo(city = ""): OperatorBasicInfo {
  return {
    fullName: "",
    organization: "",
    phone: "",
    email: "",
    city,
    operatingSector: "",
  };
}

export function emptyLicenseMeta(): OperatorLicenseMeta {
  return {
    name: "",
    size: 0,
    type: "",
    licenseNumber: "",
    expiryDate: "",
  };
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Accepts 5xxxxxxxx, 05xxxxxxxx, or +9665xxxxxxxx */
export function isValidSaudiMobile(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (/^9665\d{8}$/.test(digits)) return true;
  if (/^05\d{8}$/.test(digits)) return true;
  if (/^5\d{8}$/.test(digits)) return true;
  return false;
}

export function normalizeSaudiMobile(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("966")) return `+${digits}`;
  if (digits.startsWith("0")) return `+966${digits.slice(1)}`;
  return `+966${digits}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function loadOperatorDraft(): OperatorJoinDraftJson | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(OPERATOR_JOIN_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OperatorJoinDraftJson;
  } catch {
    return null;
  }
}

export function saveOperatorDraft(draft: OperatorJoinDraftJson): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    OPERATOR_JOIN_DRAFT_KEY,
    JSON.stringify({ ...draft, updatedAt: new Date().toISOString() }),
  );
}

export function clearOperatorDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OPERATOR_JOIN_DRAFT_KEY);
}
