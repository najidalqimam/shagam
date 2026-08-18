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
    operators,
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
          <div className="section-pad mx-auto max-w-[1440px] py-[clamp(4rem,9vw,7.5rem)]">
            <Reveal variant="up">
              <SectionLabel>{why.eyebrow}</SectionLabel>
              <h2 className="font-display max-w-[14ch] text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-[1.25]">
                {why.title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-muted">
                {why.body}
              </p>
            </Reveal>

            <Stagger className="mt-16 grid gap-10 md:grid-cols-2" interval={0.08} variant="up">
              {whyItems.map((item, i) => (
                <div key={item.title} className="border-t border-line pt-8">
                  <div className="font-display text-xs tracking-[0.22em] text-sand">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-8 text-ink-muted">{item.body}</p>
                </div>
              ))}
            </Stagger>
          </div>
        </section>

        <section id="operators" className="border-t border-line bg-bg">
          <div className="section-pad mx-auto max-w-[1440px] py-[clamp(4rem,9vw,7.5rem)]">
            <Reveal variant="up" className="max-w-3xl">
              <SectionLabel>{operators.eyebrow}</SectionLabel>
              <h2 className="font-display max-w-[16ch] text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.25]">
                {operators.title}
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-ink-muted">
                {operators.body}
              </p>
              <a
                href="/join-operator"
                className="mt-10 inline-flex rounded-sm bg-sand px-6 py-3.5 text-[0.95rem] font-medium text-ink-dark transition hover:brightness-105"
              >
                {t.joinAsOperator}
              </a>
            </Reveal>
          </div>
        </section>

        <section id="enterprise" className="border-t border-line bg-bg-soft text-ink-dark">
          <div className="section-pad mx-auto max-w-[1440px] py-[clamp(4rem,9vw,7.5rem)]">
            <Reveal variant="up">
              <p className="mb-4 font-display text-[0.75rem] tracking-[0.28em] text-brand">
                {enterprise.eyebrow}
              </p>
              <h2 className="font-display max-w-[16ch] text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-[1.25]">
                {enterprise.title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-dark-muted">
                {enterprise.body}
              </p>
            </Reveal>

            <Stagger
              className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
              interval={0.07}
              variant="up"
            >
              {enterpriseItems.map((item, i) => (
                <div key={item.title}>
                  <div className="font-display text-xs tracking-[0.2em] text-brand">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-medium">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-ink-dark-muted">{item.body}</p>
                </div>
              ))}
            </Stagger>

            <Reveal className="mt-14" delay={0.1} variant="up">
              <a
                href="/request-service"
                className="inline-flex rounded-sm bg-brand px-6 py-3.5 text-[0.95rem] font-medium text-ink transition hover:bg-brand-elevated"
              >
                {enterprise.cta}
              </a>
            </Reveal>
          </div>
        </section>

        <section id="compliance" className="border-t border-line bg-bg">
          <div className="section-pad mx-auto grid max-w-[1440px] gap-12 py-[clamp(4rem,9vw,7.5rem)] lg:grid-cols-[1fr_1fr]">
            <Reveal variant="right">
              <SectionLabel>{compliance.eyebrow}</SectionLabel>
              <h2 className="font-display max-w-[12ch] text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.25]">
                {compliance.title}
              </h2>
              <p className="mt-5 text-lg leading-8 text-ink-muted">
                {compliance.body}
              </p>
            </Reveal>

            <div>
              <Stagger className="space-y-0" interval={0.05} variant="left">
                {complianceItems.map((item, i) => (
                  <div
                    key={item}
                    className={`flex gap-3 border-t border-line pt-4 text-ink-muted ${
                      i === 0 ? "border-t-0 pt-0" : ""
                    }`}
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sand" />
                    <span className="leading-7">{item}</span>
                  </div>
                ))}
              </Stagger>

              <Reveal className="mt-10 border border-line bg-bg-elevated p-6" delay={0.12} variant="scale">
                <h3 className="font-display text-lg font-medium text-ink">
                  {t.highRiskTitle}
                </h3>
                <p className="mt-3 leading-7 text-ink-muted">
                  {t.highRiskBody}
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-line bg-bg-elevated">
          <div className="section-pad mx-auto max-w-[960px] py-[clamp(4rem,9vw,7.5rem)]">
            <Reveal className="text-center" variant="up">
              <SectionLabel>{faq.eyebrow}</SectionLabel>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-medium">
                {faq.title}
              </h2>
            </Reveal>

            <Stagger className="mt-12 divide-y divide-line border-y border-line" interval={0.06} variant="up">
              {faqs.map((item) => (
                <details key={item.q} className="faq-item group py-5">
                  <summary className="flex items-start justify-between gap-6">
                    <span className="font-display text-lg font-medium text-ink">
                      {item.q}
                    </span>
                    <span className="faq-chevron mt-1 text-sand transition">
                      ⌄
                    </span>
                  </summary>
                  <p className="mt-4 max-w-3xl leading-8 text-ink-muted">{item.a}</p>
                </details>
              ))}
            </Stagger>
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
          <div className="section-pad relative mx-auto max-w-[920px] py-[clamp(4rem,9vw,7.5rem)]">
            <Reveal variant="up">
              <SectionLabel>{contact.eyebrow}</SectionLabel>
              <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-medium text-ink">
                {contact.title}
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink-muted">
                {contact.body}
              </p>
              <a
                href="/request-service"
                className="mt-8 inline-flex rounded-sm bg-sand px-6 py-3.5 text-[0.95rem] font-medium text-ink-dark transition hover:brightness-105"
              >
                {t.requestService}
              </a>
            </Reveal>

            <ContactChannels className="mt-8" tone="dark" />
          </div>
        </section>
      </main>

      <SiteFooter />

      <WhatsAppFloat />
      <MobileTabBar />
    </div>
  );
}
