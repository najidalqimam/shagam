"use client";

import { useState } from "react";
import { Reveal, Stagger } from "./Reveal";
import { useLocale } from "./LocaleProvider";
import { useSiteContent } from "./SiteContentProvider";

export function ServicesCatalog() {
  const { content } = useSiteContent();
  const { locale } = useLocale();
  const { services, servicesSection } = content;
  const [active, setActive] = useState(0);

  const current = services[Math.min(active, Math.max(services.length - 1, 0))];

  return (
    <section id="services" className="relative overflow-x-clip border-t border-line bg-bg">
      <div className="section-pad relative mx-auto max-w-[1080px] py-[clamp(2.5rem,5vw,4.25rem)]">
        <Reveal
          variant="up"
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-8"
        >
          <div>
            <p className="mb-2 font-display text-[0.7rem] tracking-[0.28em] text-sand">
              {servicesSection.eyebrow}
            </p>
            <h2 className="font-display text-[clamp(1.45rem,2.8vw,2.15rem)] font-medium leading-[1.3] text-ink">
              {servicesSection.title}
            </h2>
            <p className="mt-2 max-w-2xl text-[0.95rem] leading-7 text-ink-muted">
              {servicesSection.body}
            </p>
          </div>
          <a
            href="/request-service"
            className="inline-flex w-fit rounded-full bg-sand px-5 py-2.5 text-sm font-medium text-ink-dark transition hover:brightness-105"
          >
            {servicesSection.cta}
          </a>
        </Reveal>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4">
          <Stagger className="min-w-0 divide-y divide-line overflow-hidden rounded-xl border border-line" interval={0.03} variant="right">
            {services.map((service, i) => {
              const isActive = active === i;
              return (
                <button
                  key={service.title}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`relative flex w-full gap-3 px-3.5 py-2.5 text-start transition-colors ${
                    isActive ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-y-1.5 start-0 w-[2px] rounded-full bg-sand" />
                  )}

                  <span
                    className={`font-display mt-0.5 w-8 shrink-0 text-[0.7rem] tracking-[0.14em] ${
                      isActive ? "text-sand" : "text-ink-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-sm font-medium text-ink">
                        {service.title}
                      </h3>
                      <span
                        className={`text-sand transition-opacity ${
                          isActive ? "opacity-100" : "opacity-25"
                        }`}
                      >
                        ←
                      </span>
                    </div>
                    {isActive && (
                      <p className="mt-1 text-sm leading-6 text-ink-muted">
                        {service.body}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </Stagger>

          <Reveal className="relative hidden lg:block" delay={0.08} variant="left">
            <div className="sticky top-24 rounded-xl border border-line bg-brand-elevated/40 p-5">
              {current && (
                <>
                  <p className="font-display text-[0.65rem] tracking-[0.28em] text-sand">
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(services.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-display text-lg font-medium leading-[1.35] text-ink">
                    {current.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-ink-muted">{current.body}</p>
                  <a
                    href="/request-service"
                    className="mt-5 inline-flex rounded-full bg-sand px-4 py-2 text-sm font-medium text-ink-dark transition hover:brightness-105"
                  >
                    {locale === "en" ? "Request this service" : "اطلب هذه الخدمة"}
                  </a>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
