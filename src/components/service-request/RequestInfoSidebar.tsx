"use client";

import { useLocale } from "../LocaleProvider";

export function RequestInfoSidebar() {
  const { t } = useLocale();
  const sr = t.serviceRequest;
  const items = [sr.trust1, sr.trust2, sr.trust3];

  return (
    <aside className="h-fit self-start overflow-hidden rounded-2xl bg-brand p-4 text-ink shadow-[0_12px_28px_rgba(11,74,69,0.22)] lg:p-5">
      <h2 className="font-display text-base font-bold leading-snug">{sr.sidebarTitle}</h2>
      <p className="mt-1.5 text-xs leading-5 text-mint">{sr.sidebarBody}</p>

      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs font-medium leading-5">
            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sand text-brand">
              <svg viewBox="0 0 20 20" className="h-2.5 w-2.5" fill="currentColor" aria-hidden>
                <path d="M8.1 13.6 4.8 10.3l1.2-1.2 2.1 2.1 5-5.1 1.2 1.2-6.2 6.3z" />
              </svg>
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
