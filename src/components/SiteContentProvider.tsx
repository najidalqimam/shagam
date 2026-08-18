"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import {
  defaultSettings,
  defaultSiteContent,
  type SiteContent,
  type SiteSettings,
} from "@/lib/cms/types";
import {
  defaultSettingsEn,
  defaultSiteContentEn,
} from "@/lib/i18n/content-en";
import { useLocale } from "./LocaleProvider";

type Ctx = {
  content: SiteContent;
  settings: SiteSettings;
};

const SiteContentContext = createContext<Ctx>({
  content: defaultSiteContent(),
  settings: defaultSettings(),
});

export function SiteContentProvider({
  contentAr,
  contentEn,
  settingsAr,
  settingsEn,
  children,
  /** @deprecated use contentAr */
  content,
  /** @deprecated use settingsAr */
  settings,
}: {
  contentAr?: SiteContent;
  contentEn?: SiteContent;
  settingsAr?: SiteSettings;
  settingsEn?: SiteSettings;
  content?: SiteContent;
  settings?: SiteSettings;
  children: ReactNode;
}) {
  const { locale } = useLocale();
  const arContent = contentAr ?? content ?? defaultSiteContent();
  const enContent = contentEn ?? defaultSiteContentEn();
  const arSettings = settingsAr ?? settings ?? defaultSettings();
  const enSettings = settingsEn ?? defaultSettingsEn();

  const value = useMemo<Ctx>(() => {
    if (locale !== "en") {
      return { content: arContent, settings: arSettings };
    }

    return {
      content: enContent,
      settings: {
        ...enSettings,
        contactEmail: arSettings.contactEmail,
        contactPhone: arSettings.contactPhone,
        whatsapp: arSettings.whatsapp,
        facebookUrl: arSettings.facebookUrl,
        instagramUrl: arSettings.instagramUrl,
        twitterUrl: arSettings.twitterUrl,
        linkedinUrl: arSettings.linkedinUrl,
      },
    };
  }, [locale, arContent, enContent, arSettings, enSettings]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
