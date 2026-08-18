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
      <div className="section-pad relative mx-auto max-w-[1440px] py-[clamp(4rem,9vw,7.5rem)]">
        <Reveal variant="up">
          <p className="mb-4 font-display text-[0.75rem] tracking-[0.28em] text-sand">
            {servicesSection.eyebrow}
          </p>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display max-w-[14ch] text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-[1.25] text-ink">
                {servicesSection.title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-muted">
                {servicesSection.body}
              </p>
            </div>
            <a
              href="/request-service"
              className="inline-flex w-fit rounded-full bg-sand px-5 py-3 text-sm font-medium text-ink-dark transition hover:brightness-105"
            >
              {servicesSection.cta}
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <Stagger className="min-w-0" interval={0.05} variant="right">
            {services.map((service, i) => {
              const isActive = active === i;
              return (
                <button
                  key={service.title}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`relative flex w-full gap-5 border-b border-line py-6 text-start transition-colors ${
                    isActive ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-y-3 start-0 w-[3px] rounded-full bg-sand" />
                  )}

                  <span
                    className={`font-display mt-1 w-12 shrink-0 text-sm tracking-[0.18em] ${
                      isActive ? "text-sand" : "text-ink-muted"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 flex-1 pe-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl font-medium text-ink">
                        {service.title}
                      </h3>
                      <span
                        className={`mt-1 text-sand transition-opacity ${
                          isActive ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        ←
                      </span>
                    </div>
                    <p className="mt-2 max-w-xl text-[0.95rem] leading-7 text-ink-muted">
                      {service.body}
                    </p>
                    <div className="mt-3 inline-flex rounded-full border border-line px-3 py-1 text-xs text-sand">
                      {service.meta}
                    </div>
                  </div>
                </button>
              );
            })}
          </Stagger>

          <Reveal className="relative hidden lg:block" delay={0.12} variant="left">
            <div className="sticky top-28 rounded-sm border border-line bg-brand-elevated/40 p-8">
              {current && (
                <>
                  <p className="font-display text-xs tracking-[0.28em] text-sand">
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(services.length).padStart(2, "0")}
                  </p>
                  <h3 className="mt-5 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-medium leading-[1.3] text-ink">
                    {current.title}
                  </h3>
                  <p className="mt-5 leading-8 text-ink-muted">{current.body}</p>
                  <p className="mt-6 text-sm text-sand">{current.meta}</p>
                  <div className="mt-10 h-px w-full bg-gradient-to-l from-sand via-mint/40 to-transparent" />
                  <a
                    href="/request-service"
                    className="mt-8 inline-flex rounded-full bg-sand px-5 py-3 text-sm font-medium text-ink-dark transition hover:brightness-105"
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
