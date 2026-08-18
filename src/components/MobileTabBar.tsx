"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "./LocaleProvider";
import { useSiteContent } from "./SiteContentProvider";

function TabIcon({
  id,
  active,
}: {
  id: "home" | "services" | "how" | "operators";
  active: boolean;
}) {
  const stroke = {
    viewBox: "0 0 24 24",
    className: "h-[22px] w-[22px]",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "home":
      return active ? (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden fill="currentColor">
          <path d="M4 10.2 12 3.5l8 6.7V20a1.2 1.2 0 0 1-1.2 1.2H14.2v-5.6h-4.4v5.6H5.2A1.2 1.2 0 0 1 4 20V10.2z" />
        </svg>
      ) : (
        <svg {...stroke}>
          <path d="M4.5 10.5 12 4l7.5 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5.5a1 1 0 0 1-1-1v-9.5z" />
        </svg>
      );
    case "services":
      return (
        <svg {...stroke} strokeWidth={active ? 2 : 1.7}>
          <rect x="4" y="4" width="7" height="7" rx="1.75" fill={active ? "currentColor" : "none"} />
          <rect x="13" y="4" width="7" height="7" rx="1.75" fill={active ? "currentColor" : "none"} />
          <rect x="4" y="13" width="7" height="7" rx="1.75" fill={active ? "currentColor" : "none"} />
          <rect x="13" y="13" width="7" height="7" rx="1.75" fill={active ? "currentColor" : "none"} />
        </svg>
      );
    case "how":
      return (
        <svg {...stroke} strokeWidth={active ? 2 : 1.7}>
          <circle cx="7" cy="8" r="2.2" fill={active ? "currentColor" : "none"} />
          <path d="M9.2 8h4.3" />
          <path d="M15.2 5.2 18.8 8l-3.6 2.8z" fill={active ? "currentColor" : "none"} />
          <path d="M7 10.2v4.3" />
          <rect
            x="4.8"
            y="14.5"
            width="4.4"
            height="4.4"
            rx="1"
            fill={active ? "currentColor" : "none"}
          />
        </svg>
      );
    case "operators":
      return active ? (
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" aria-hidden fill="currentColor">
          <circle cx="9" cy="8" r="3.2" />
          <circle cx="16.8" cy="9.1" r="2.6" />
          <path d="M3.2 19.5c0-3 2.5-5.2 5.8-5.2 3.3 0 5.8 2.2 5.8 5.2" />
          <path d="M13.2 19.5c.2-1.9 1.7-3.5 3.6-3.5 2 0 3.5 1.4 3.7 3.5" />
        </svg>
      ) : (
        <svg {...stroke}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.4" />
          <path d="M3.8 19c0-2.7 2.3-4.7 5.2-4.7s5.2 2 5.2 4.7" />
          <path d="M13.8 19c.15-1.7 1.5-3 3.2-3s3.05 1.2 3.2 3" />
        </svg>
      );
  }
}

function DroneCtaIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-7 w-7 text-ink" aria-hidden fill="none">
      <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 12.5 L23.4 20 L20 27.5 L16.6 20 Z" fill="#B8944F" />
      <circle cx="20" cy="14.2" r="1.7" fill="currentColor" />
      <circle cx="25.8" cy="20" r="1.7" fill="currentColor" />
      <circle cx="20" cy="25.8" r="1.7" fill="currentColor" />
      <circle cx="14.2" cy="20" r="1.7" fill="currentColor" />
      <path
        d="M8 10.5h5.5M26.5 10.5H32M8 29.5h5.5M26.5 29.5H32"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="7" cy="10.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="33" cy="10.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="29.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="33" cy="29.5" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const SIDE_TABS = [
  { hash: "#top", id: "home" as const, section: "top" },
  { hash: "#how", id: "how" as const, section: "how" },
  { hash: "#services", id: "services" as const, section: "services" },
  { href: "/join-operator", id: "operators" as const, section: "operators" },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname === "";
  const { content } = useSiteContent();
  const { t } = useLocale();
  const [active, setActive] = useState("#top");

  const resolveHash = (hash: string) => (onHome ? hash : `/${hash}`);

  const labelFor = (section: (typeof SIDE_TABS)[number]["section"]) => {
    if (section === "top") return t.navHome;
    if (section === "operators") return t.joinAsOperator;
    return content.navLinks.find((l) => l.href === `#${section}`)?.label ?? section;
  };

  useEffect(() => {
    if (!onHome) {
      if (pathname.startsWith("/join-operator")) setActive("#operators");
      else if (pathname.startsWith("/request-service")) setActive("#contact");
      else setActive("");
      return;
    }

    const ids = [
      { href: "#top", id: "top" },
      { href: "#how", id: "how" },
      { href: "#services", id: "services" },
      { href: "#contact", id: "contact" },
    ];

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const sections = ids
          .map((item) => {
            const el = document.getElementById(item.id);
            return el ? { href: item.href, top: el.getBoundingClientRect().top } : null;
          })
          .filter((s): s is { href: string; top: number } => !!s)
          .sort((a, b) => a.top - b.top);

        const offset = 160;
        let current = sections[0]?.href ?? "#top";
        for (const section of sections) {
          if (section.top <= offset) current = section.href;
        }
        setActive(current);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, [onHome, pathname]);

  const renderSide = (tab: (typeof SIDE_TABS)[number]) => {
    const isActive =
      tab.id === "operators"
        ? active === "#operators" || pathname.startsWith("/join-operator")
        : active === tab.hash;

    const href = "href" in tab && tab.href ? tab.href : resolveHash(tab.hash);

    return (
      <Link
        key={tab.id}
        href={href}
        aria-current={isActive ? "page" : undefined}
        onClick={() => {
          if (tab.hash) setActive(tab.hash);
          if (tab.id === "operators") setActive("#operators");
        }}
        className={`app-tab flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5 py-1 transition-colors duration-200 ${
          isActive ? "text-brand" : "text-[#6b8581]"
        }`}
      >
        <span
          className={`relative flex h-9 w-9 items-center justify-center rounded-xl transition ${
            isActive ? "bg-brand/10" : "bg-transparent"
          }`}
        >
          <TabIcon id={tab.id} active={isActive} />
        </span>
        <span
          className={`max-w-full truncate text-[0.62rem] leading-none tracking-tight ${
            isActive ? "font-bold" : "font-medium"
          }`}
        >
          {labelFor(tab.section)}
        </span>
      </Link>
    );
  };

  const ctaActive = pathname.startsWith("/request-service") || active === "#contact";

  return (
    <nav className="app-tabbar fixed inset-x-0 bottom-0 z-50 px-3 lg:hidden" aria-label={t.mainNav}>
      <div className="app-tabbar-dock relative mx-auto max-w-md">
        <div className="flex items-end justify-between gap-0.5 px-1.5 pb-1.5 pt-2">
          {renderSide(SIDE_TABS[0])}
          {renderSide(SIDE_TABS[1])}

          <Link
            href="/request-service"
            className="app-tab-cta group relative -mt-7 flex w-[4.6rem] shrink-0 flex-col items-center"
            aria-current={ctaActive ? "page" : undefined}
          >
            <span className="app-tab-cta-glow absolute top-1 h-14 w-14 rounded-full" aria-hidden />
            <span
              className={`relative z-[1] flex h-[3.35rem] w-[3.35rem] items-center justify-center rounded-full bg-brand text-ink shadow-[0_10px_24px_rgba(11,74,69,0.35)] ring-[3px] transition group-active:scale-95 ${
                ctaActive ? "ring-sand" : "ring-white"
              }`}
            >
              <DroneCtaIcon />
            </span>
            <span className="relative z-[1] mt-1 max-w-[4.6rem] truncate text-center text-[0.62rem] font-semibold leading-none tracking-tight text-brand">
              {t.orderNow}
            </span>
          </Link>

          {renderSide(SIDE_TABS[2])}
          {renderSide(SIDE_TABS[3])}
        </div>
      </div>
    </nav>
  );
}
