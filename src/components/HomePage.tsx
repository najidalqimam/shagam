"use client";

import dynamic from "next/dynamic";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { ContactChannels } from "./ContactChannels";
import { MobileTabBar } from "./MobileTabBar";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { Reveal, Stagger } from "./Reveal";
import { ServicesCatalog } from "./ServicesCatalog";
import { ChevronDown, ShieldAlert } from "lucide-react";
import { useLocale } from "./LocaleProvider";
import { useSiteContent } from "./SiteContentProvider";

function DroneStoryLoader() {
  const { t } = useLocale();
  return (
    <section className="flex h-[100svh] items-center justify-center bg-[#F2F7F6] text-sm text-[#4D6F6A]">
      {t.loadingScene}
    </section>
  );
}

const DroneStory = dynamic(
  () => import("./DroneStory").then((m) => m.DroneStory),
  {
    ssr: false,
    loading: () => <DroneStoryLoader />,
  },
);

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-4 font-display text-[0.75rem] tracking-[0.28em] text-sand">
      {children}
    </p>
  );
}

export function HomePage() {
  const { content } = useSiteContent();
  const { t } = useLocale();
  const {
    why,
    whyItems,
    enterprise,
    enterpriseItems,
    compliance,
    complianceItems,
    faq,
    faqs,
    contact,
  } = content;

  return (
    <div className="app-shell min-h-screen bg-bg text-ink">
      <Header />
      <main className="w-full max-w-[100vw] overflow-x-clip">
        <DroneStory />
        <Hero />

        <HowItWorks />

        <ServicesCatalog />

        <section id="why" className="border-t border-line bg-bg-elevated">
          <div className="section-pad mx-auto max-w-[1080px] py-8 md:py-10">
            <Reveal
              variant="up"
              className="grid gap-2 md:grid-cols-2 md:items-end md:gap-8"
            >
              <div>
                <p className="mb-1.5 font-display text-[0.7rem] tracking-[0.28em] text-sand">
                  {why.eyebrow}
                </p>
                <h2 className="font-display text-[clamp(1.25rem,2.2vw,1.7rem)] font-medium leading-[1.35]">
                  {why.title}
                </h2>
              </div>
              <p className="text-sm leading-6 text-ink-muted">
                {why.body}
              </p>
            </Reveal>

            <Stagger
              className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 [&>div]:h-full"
              interval={0.04}
              variant="up"
            >
              {whyItems.map((item, i) => (
                <div
                  key={item.title}
                  className="h-full rounded-xl border border-line bg-bg/40 px-3 py-2.5"
                >
                  <div className="font-display text-[0.62rem] tracking-[0.2em] text-sand">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-1.5 font-display text-sm font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-ink-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </Stagger>
          </div>
        </section>

        <section id="enterprise" className="border-t border-line bg-bg-soft text-ink-dark">
          <div className="section-pad mx-auto max-w-[1080px] py-[clamp(2.5rem,5vw,4.25rem)]">
            <Reveal
              variant="up"
              className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-end lg:gap-10"
            >
              <div>
                <p className="mb-2 font-display text-[0.7rem] tracking-[0.28em] text-brand">
                  {enterprise.eyebrow}
                </p>
                <h2 className="font-display text-[clamp(1.45rem,2.8vw,2.15rem)] font-medium leading-[1.4]">
                  {enterprise.title.replace(" بدل ", "\nبدل ").replace(" instead of ", "\ninstead of ").split("\n").map((line, i, lines) => (
                    <span key={line}>
                      {line}
                      {i < lines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </h2>
              </div>
              <p className="text-[0.95rem] leading-7 text-ink-dark-muted">
                {enterprise.body}
              </p>
            </Reveal>

            <Stagger
              className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 [&>div]:h-full"
              interval={0.05}
              variant="up"
            >
              {enterpriseItems.map((item, i) => (
                <div
                  key={item.title}
                  className="h-full rounded-xl border border-line-dark bg-bg-white/70 px-3.5 py-3"
                >
                  <div className="font-display text-[0.65rem] tracking-[0.2em] text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-2 font-display text-sm font-medium">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-ink-dark-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </Stagger>

            <Reveal className="mt-5" delay={0.1} variant="up">
              <a
                href="/request-service"
                className="inline-flex rounded-sm bg-brand px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-brand-elevated"
              >
                {enterprise.cta}
              </a>
            </Reveal>
          </div>
        </section>

        <section id="compliance" className="border-t border-line bg-bg">
          <div className="section-pad mx-auto max-w-[1080px] py-[clamp(2.5rem,5vw,4.25rem)]">
            <Reveal
              variant="up"
              className="grid gap-3 lg:grid-cols-[minmax(0,16ch)_minmax(0,1fr)] lg:items-end lg:gap-10"
            >
              <div>
                <SectionLabel>{compliance.eyebrow}</SectionLabel>
                <h2 className="font-display text-[clamp(1.45rem,2.8vw,2.15rem)] font-medium leading-[1.3]">
                  {compliance.title}
                </h2>
              </div>
              <p className="text-[0.95rem] leading-7 text-ink-muted">
                {compliance.body}
              </p>
            </Reveal>

            <Stagger
              className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 [&>div]:h-full"
              interval={0.04}
              variant="up"
            >
              {complianceItems.map((item, i) => (
                <div
                  key={item}
                  className="flex h-full items-start gap-3 rounded-xl border border-line bg-bg-elevated px-3.5 py-3"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-sand/40 font-display text-[0.65rem] text-sand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-6 text-ink-muted">{item}</p>
                </div>
              ))}
              <div className="flex h-full items-start gap-3 rounded-xl border border-sand/35 bg-sand/[0.08] px-3.5 py-3">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-sand/15 text-sand">
                  <ShieldAlert className="size-3.5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-medium text-ink">
                    {t.highRiskTitle}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-ink-muted">
                    {t.highRiskBody}
                  </p>
                </div>
              </div>
            </Stagger>
          </div>
        </section>

        <section id="faq" className="border-t border-line bg-bg-elevated">
          <div className="section-pad py-[clamp(2.5rem,5vw,4.25rem)]">
            <div className="mx-auto w-full max-w-[1080px]">
              <Reveal className="text-center" variant="up">
                <p className="mb-2 font-display text-[0.7rem] tracking-[0.28em] text-sand">
                  {faq.eyebrow}
                </p>
                <h2 className="font-display text-[clamp(1.45rem,2.8vw,2.15rem)] font-medium">
                  {faq.title}
                </h2>
              </Reveal>

              <Stagger
                className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2 [&>div]:h-full"
                interval={0.04}
                variant="up"
              >
                {faqs.map((item) => (
                  <details
                    key={item.q}
                    className="faq-item group h-full rounded-xl border border-line bg-brand/30 px-3.5 py-3 transition hover:border-sand/35 open:border-sand/45 open:bg-brand/45"
                  >
                    <summary className="flex items-start gap-2.5 text-start">
                      <span className="faq-chevron mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-line text-sand transition group-open:border-sand/50 group-open:bg-sand/10">
                        <ChevronDown className="size-3.5" />
                      </span>
                      <span className="font-display text-sm font-medium leading-6 text-ink">
                        {item.q}
                      </span>
                    </summary>
                    <p className="mt-2 ps-9 text-sm leading-6 text-ink-muted">
                      {item.a}
                    </p>
                  </details>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden border-t border-line bg-bg">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18]"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 20% 0%, rgba(211,167,77,0.35), transparent 45%), radial-gradient(ellipse at 80% 100%, rgba(169,212,205,0.2), transparent 40%)",
            }}
          />
          <div className="section-pad relative mx-auto max-w-[1080px] py-[clamp(2.5rem,5vw,4.25rem)]">
            <div className="grid items-stretch gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:gap-4">
              <Reveal
                variant="up"
                className="flex flex-col justify-center rounded-xl border border-line bg-bg-elevated/60 px-5 py-5"
              >
                <p className="mb-2 font-display text-[0.7rem] tracking-[0.28em] text-sand">
                  {contact.eyebrow}
                </p>
                <h2 className="font-display max-w-[16ch] text-[clamp(1.45rem,2.8vw,2.15rem)] font-medium leading-[1.3] text-ink">
                  {contact.title}
                </h2>
                <p className="mt-3 max-w-xl text-[0.95rem] leading-7 text-ink-muted">
                  {contact.body}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href="/request-service"
                    className="inline-flex rounded-sm bg-sand px-5 py-2.5 text-sm font-medium text-ink-dark transition hover:brightness-105"
                  >
                    {t.requestService}
                  </a>
                  <a
                    href="/join-operator"
                    className="inline-flex rounded-sm border border-line px-5 py-2.5 text-sm font-medium text-ink transition hover:border-sand/50 hover:text-sand"
                  >
                    {t.joinAsOperator}
                  </a>
                </div>
              </Reveal>

              <Reveal
                variant="up"
                delay={0.08}
                className="flex flex-col justify-center rounded-xl border border-line bg-bg-elevated px-5 py-5"
              >
                <ContactChannels className="[&>p]:mb-3" tone="dark" />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <WhatsAppFloat />
      <MobileTabBar />
    </div>
  );
}
