import type { SiteSettings } from "@/lib/cms/types";

/** Digits only, for tel: and wa.me links. */
export function digitsOnly(value: string): string {
  return value.replace(/\D+/g, "");
}

/** Build https://wa.me/<number> from local or international Saudi numbers. */
export function whatsappHref(whatsapp: string, message?: string): string | null {
  let digits = digitsOnly(whatsapp);
  if (!digits) return null;
  if (digits.startsWith("05") && digits.length === 10) {
    digits = `966${digits.slice(1)}`;
  } else if (digits.startsWith("5") && digits.length === 9) {
    digits = `966${digits}`;
  } else if (digits.startsWith("9660")) {
    digits = `966${digits.slice(4)}`;
  }
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function telHref(phone: string): string | null {
  let digits = digitsOnly(phone);
  if (!digits) return null;
  if (digits.startsWith("05") && digits.length === 10) {
    digits = `966${digits.slice(1)}`;
  } else if (digits.startsWith("5") && digits.length === 9) {
    digits = `966${digits}`;
  }
  return `tel:+${digits}`;
}

export function mailtoHref(email: string): string | null {
  const trimmed = email.trim();
  return trimmed.includes("@") ? `mailto:${trimmed}` : null;
}

export type ContactChannel = {
  id: string;
  href: string;
  label: string;
  external?: boolean;
};

export function buildContactChannels(
  settings: SiteSettings,
  labels: {
    email: string;
    phone: string;
    whatsapp: string;
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  },
  whatsappMessage?: string,
): ContactChannel[] {
  const channels: ContactChannel[] = [];

  const mail = mailtoHref(settings.contactEmail);
  if (mail) {
    channels.push({ id: "email", href: mail, label: labels.email });
  }

  const phone = telHref(settings.contactPhone);
  if (phone) {
    channels.push({
      id: "phone",
      href: phone,
      label: settings.contactPhone.trim() || labels.phone,
    });
  }

  const wa = whatsappHref(settings.whatsapp, whatsappMessage);
  if (wa) {
    channels.push({
      id: "whatsapp",
      href: wa,
      label: labels.whatsapp,
      external: true,
    });
  }

  const socials: Array<[keyof SiteSettings, string]> = [
    ["facebookUrl", labels.facebook],
    ["instagramUrl", labels.instagram],
    ["twitterUrl", labels.twitter],
    ["linkedinUrl", labels.linkedin],
  ];

  for (const [key, label] of socials) {
    const url = String(settings[key] ?? "").trim();
    if (!url) continue;
    const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    channels.push({ id: key, href, label, external: true });
  }

  return channels;
}
