"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "./LocaleProvider";
import { useSiteContent } from "./SiteContentProvider";

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M20 9.5 L24.2 20 L20 30.5 L15.8 20 Z"
        fill="#B8944F"
      />
      <circle cx="20" cy="11.5" r="2.3" fill="currentColor" />
      <circle cx="27.5" cy="20" r="2.3" fill="currentColor" />
      <circle cx="20" cy="28.5" r="2.3" fill="currentColor" />
      <circle cx="12.5" cy="20" r="2.3" fill="currentColor" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const { content, settings } = useSiteContent();
  const { locale, toggleLocale, t } = useLocale();
  const navLinks = content.navLinks;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [onLight, setOnLight] = useState(true);
  const [active, setActive] = useState("");

  const resolveHref = (href: string) => {
    if (!href.startsWith("#")) return href;
    if (pathname === "/" || pathname === "") return href;
    return `/${href}`;
  };

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;
    let lastOnLight = true;
    let lastActive = "";

    const sections = navLinks
      .map((link) => {
        const id = link.href.replace("#", "");
        return { href: link.href, el: document.getElementById(id) };
      })
      .filter((s): s is { href: string; el: HTMLElement } => !!s.el);

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const y = window.scrollY;
        const nextScrolled = y > 16;
        if (nextScrolled !== lastScrolled) {
          lastScrolled = nextScrolled;
          setScrolled(nextScrolled);
        }

        const storyEnd =
          window.innerWidth >= 1024
            ? window.innerHeight * 2.8
            : window.innerHeight * 1.6;
        const nextOnLight = y < storyEnd;
        if (nextOnLight !== lastOnLight) {
          lastOnLight = nextOnLight;
          setOnLight(nextOnLight);
        }

        const offset = 120;
        const ranked = sections
          .map((section) => ({
            href: section.href,
            top: section.el.getBoundingClientRect().top,
          }))
          .sort((a, b) => a.top - b.top);

        let current = "";
        for (const section of ranked) {
          if (section.top <= offset) current = section.href;
        }
        if (current !== lastActive) {
          lastActive = current;
          setActive(current);
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navLinks]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const light = pathname === "/" || pathname === "" ? onLight : true;
  const solidDark = !light && (scrolled || open);
  const compactNav = locale === "en";

  return (
    <header
      className={`app-header fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,border-color] duration-300 ${
        light
          ? "border-b border-brand/12 bg-white/95 shadow-[0_10px_32px_rgba(11,74,69,0.1)]"
          : solidDark
            ? "border-b border-white/10 bg-brand/95 shadow-[0_8px_30px_rgba(0,0,0,0.18)]"
            : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="section-pad relative z-[70] mx-auto grid h-14 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 sm:h-16 lg:h-[4.5rem]">
        {/* Logo */}
        <a
          href={resolveHref("#top")}
          className={`group z-10 flex min-w-0 items-center gap-2.5 justify-self-start ${
            light ? "text-brand" : "text-ink"
          }`}
          onClick={() => setOpen(false)}
        >
          <LogoMark className="h-9 w-9 shrink-0 transition group-hover:scale-[1.04] sm:h-10 sm:w-10" />
          <span className="min-w-0">
            <span className="font-display block truncate text-[1.15rem] font-bold leading-none tracking-tight sm:text-[1.35rem]">
              {settings.siteName}
            </span>
            <span
              className={`mt-1 hidden truncate text-[0.62rem] leading-none tracking-[0.02em] sm:block ${
                light ? "text-ink-dark-muted" : "text-mint"
              }`}
            >
              {settings.tagline}
            </span>
          </span>
        </a>

        {/* Desktop nav — truly centered */}
        <nav
          className="hidden min-w-0 justify-self-center lg:flex"
          aria-label={t.mainNav}
        >
          <div
            className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-1 ${
              light
                ? "border-brand/12 bg-bg-soft"
                : "border-white/12 bg-white/10"
            }`}
          >
            {navLinks.map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={resolveHref(link.href)}
                  className={`relative whitespace-nowrap rounded-full font-semibold transition ${
                    compactNav
                      ? "px-3 py-2 text-[0.78rem]"
                      : "px-3.5 py-2 text-[0.82rem]"
                  } ${
                    isActive
                      ? light
                        ? "bg-brand text-ink"
                        : "bg-sand text-ink-dark"
                      : light
                        ? "text-ink-dark hover:bg-brand/10 hover:text-brand"
                        : "text-mint hover:bg-white/10 hover:text-ink"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Actions */}
        <div className="z-10 flex shrink-0 items-center justify-end gap-2 justify-self-end">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={t.langSwitchTo}
            title={t.langSwitchTo}
            className={`inline-flex size-9 items-center justify-center rounded-full border text-[0.72rem] font-bold tracking-wide transition sm:size-10 sm:border-2 sm:text-[0.78rem] ${
              light
                ? "border-brand/25 bg-brand/[0.04] text-brand hover:bg-brand hover:text-ink"
                : "border-ink/35 text-ink hover:bg-ink hover:text-brand"
            }`}
          >
            {locale === "ar" ? "EN" : "عربي"}
          </button>
          <a
            href="/join-operator"
            className={`hidden h-10 items-center rounded-full border-2 px-4 text-[0.8rem] font-semibold transition lg:inline-flex ${
              light
                ? "border-brand text-brand hover:bg-brand hover:text-ink"
                : "border-ink/50 text-ink hover:bg-ink hover:text-brand"
            }`}
          >
            {t.joinAsOperator}
          </a>
          <a
            href="/request-service"
            className={`hidden h-10 items-center rounded-full px-4 text-[0.8rem] font-semibold transition md:inline-flex ${
              light
                ? "bg-brand text-ink hover:bg-brand-elevated"
                : "bg-sand text-ink-dark hover:brightness-105"
            }`}
          >
            {t.requestService}
          </a>

          <button
            type="button"
            aria-label={open ? t.closeMenu : t.openMenu}
            aria-expanded={open}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition sm:h-10 sm:w-10 sm:border-2 lg:hidden ${
              light
                ? "border-brand/20 bg-brand/[0.04] text-brand hover:bg-brand/8"
                : "border-ink/30 text-ink hover:bg-white/10"
            }`}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{t.menu}</span>
            <span className="relative flex h-3.5 w-4 flex-col justify-between">
              <span
                className={`h-[1.5px] w-full origin-center rounded-full bg-current transition duration-300 ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-full rounded-full bg-current transition duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-full origin-center rounded-full bg-current transition duration-300 ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <div
        className={`app-mobile-menu fixed inset-0 z-[60] flex flex-col transition-[opacity,visibility] duration-300 ease-out lg:hidden ${
          open
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div
          className={`flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain section-pad pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] pt-5 ${
            light
              ? "bg-gradient-to-b from-white via-white to-[#f2f7f6] text-ink-dark"
              : "bg-gradient-to-b from-brand via-brand to-brand-deep text-ink"
          }`}
        >
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((link, index) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={resolveHref(link.href)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-[1.1rem] font-semibold transition active:scale-[0.985] ${
                    isActive
                      ? light
                        ? "bg-brand text-ink shadow-[0_8px_24px_rgba(11,74,69,0.22)]"
                        : "bg-sand text-ink-dark shadow-[0_8px_24px_rgba(184,148,79,0.28)]"
                      : light
                        ? "bg-brand/[0.04] text-ink-dark hover:bg-brand/[0.08]"
                        : "bg-white/6 hover:bg-white/10"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span>{link.label}</span>
                  <span
                    className={`text-[0.7rem] font-bold tracking-[0.14em] ${
                      isActive
                        ? light
                          ? "text-mint"
                          : "text-brand"
                        : light
                          ? "text-ink-dark-muted/50"
                          : "text-mint/50"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </a>
              );
            })}
          </nav>

          <div className="mt-auto grid grid-cols-1 gap-2.5 pt-10">
            <a
              href="/join-operator"
              className={`inline-flex items-center justify-center rounded-2xl border px-4 py-3.5 text-sm font-semibold ${
                light
                  ? "border-brand/20 bg-white text-brand"
                  : "border-ink/25 text-ink"
              }`}
              onClick={() => setOpen(false)}
            >
              {t.joinAsOperator}
            </a>
            <a
              href="/request-service"
              className={`inline-flex items-center justify-center rounded-2xl px-4 py-3.5 text-sm font-semibold ${
                light
                  ? "bg-brand text-ink shadow-[0_10px_28px_rgba(11,74,69,0.28)]"
                  : "bg-sand text-ink-dark"
              }`}
              onClick={() => setOpen(false)}
            >
              {t.requestService}
            </a>
            <button
              type="button"
              onClick={() => {
                toggleLocale();
                setOpen(false);
              }}
              className={`inline-flex w-full items-center justify-center rounded-2xl border px-4 py-3 text-sm font-bold ${
                light
                  ? "border-transparent text-ink-dark-muted"
                  : "border-transparent text-mint"
              }`}
            >
              {locale === "ar" ? "English" : "العربية"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
