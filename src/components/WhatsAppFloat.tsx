"use client";

import { useEffect, useState } from "react";
import { whatsappHref } from "@/lib/contact";
import { useLocale } from "./LocaleProvider";
import { useSiteContent } from "./SiteContentProvider";

export function WhatsAppFloat() {
  const { settings } = useSiteContent();
  const { t } = useLocale();
  const href = whatsappHref(settings.whatsapp, t.whatsappPrefill);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      const covered = window.innerHeight - vv.height > 120;
      setKeyboardOpen(covered);
    };

    onResize();
    vv.addEventListener("resize", onResize);
    vv.addEventListener("scroll", onResize);
    return () => {
      vv.removeEventListener("resize", onResize);
      vv.removeEventListener("scroll", onResize);
    };
  }, []);

  if (!href || keyboardOpen) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsappFloat}
      className="app-whatsapp fixed end-3 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)] ring-4 ring-white/80 transition hover:scale-105 hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:end-5 sm:h-14 sm:w-14"
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden fill="currentColor">
        <path d="M16.04 3C9.4 3 4 8.36 4 14.96c0 2.1.55 4.15 1.6 5.96L4 29l8.28-1.55A12.03 12.03 0 0 0 16.04 27C22.68 27 28 21.64 28 15.04 28 8.36 22.68 3 16.04 3zm0 21.9c-1.82 0-3.6-.49-5.15-1.42l-.37-.22-4.91.92.93-4.79-.24-.39a9.86 9.86 0 0 1-1.5-5.2c0-5.45 4.47-9.88 9.99-9.88 5.52 0 10 4.43 10 9.88 0 5.45-4.48 9.88-10 9.88zm5.48-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
}
