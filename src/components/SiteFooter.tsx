"use client";

import { Reveal } from "./Reveal";
import { useLocale } from "./LocaleProvider";
import { useSiteContent } from "./SiteContentProvider";

const DEVELOPER_URL = "https://najidalqimam.sa/";

export function SiteFooter() {
  const { settings } = useSiteContent();
  const { t } = useLocale();

  return (
    <footer className="border-t border-line bg-bg-elevated">
      <Reveal
        className="section-pad mx-auto flex max-w-[1440px] flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between"
        variant="up"
      >
        <div>
          <div className="font-display text-2xl font-semibold text-ink">
            {settings.siteName}
          </div>
          <p className="mt-2 max-w-md text-sm leading-7 text-ink-muted">
            {settings.footerText}
          </p>
        </div>
        <p className="text-sm leading-7 text-ink-muted">
          © {new Date().getFullYear()} {settings.siteName}
          {" · "}
          {t.developedByPrefix}{" "}
          <a
            href={DEVELOPER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sand underline-offset-2 transition hover:underline"
          >
            {t.developerName}
          </a>
        </p>
      </Reveal>
    </footer>
  );
}
