"use client";

import { Reveal } from "./Reveal";
import { useLocale } from "./LocaleProvider";
import { useSiteContent } from "./SiteContentProvider";

const journeyMeta = [
  { id: "req", num: "01" },
  { id: "ops", num: "02" },
  { id: "out", num: "03" },
] as const;

function JourneyIcon({ id }: { id: (typeof journeyMeta)[number]["id"] }) {
  if (id === "req") {
    return (
      <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" aria-hidden>
        <rect
          x="8"
          y="6"
          width="18"
          height="24"
          rx="3"
          stroke="#D9A52E"
          strokeWidth="1.6"
        />
        <path
          d="M12 14h10M12 19h10M12 24h6"
          stroke="#D9A52E"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="28" cy="28" r="7" fill="#0B4A45" stroke="#D9A52E" strokeWidth="1.4" />
        <path
          d="M25.5 28.2l1.8 1.8 3.4-3.6"
          stroke="#D9A52E"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (id === "ops") {
    return (
      <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" aria-hidden>
        <path
          d="M20 12l6 6-6 6-6-6 6-6Z"
          stroke="#D9A52E"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="18" r="2" fill="#D9A52E" />
        <circle cx="14" cy="18" r="2.2" stroke="#D9A52E" strokeWidth="1.2" />
        <circle cx="26" cy="18" r="2.2" stroke="#D9A52E" strokeWidth="1.2" />
        <circle cx="20" cy="12" r="2.2" stroke="#D9A52E" strokeWidth="1.2" />
        <circle cx="20" cy="24" r="2.2" stroke="#D9A52E" strokeWidth="1.2" />
        <circle cx="29" cy="29" r="7" fill="#0B4A45" stroke="#D9A52E" strokeWidth="1.4" />
        <path
          d="M26.5 29.2l1.8 1.8 3.4-3.6"
          stroke="#D9A52E"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" className="h-7 w-7" fill="none" aria-hidden>
      <rect
        x="7"
        y="8"
        width="20"
        height="24"
        rx="3"
        stroke="#D9A52E"
        strokeWidth="1.6"
      />
      <path
        d="M12 15h10M12 20h10M12 25h7"
        stroke="#D9A52E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="29" cy="29" r="7" fill="#0B4A45" stroke="#D9A52E" strokeWidth="1.4" />
      <path
        d="M26.5 29.2l1.8 1.8 3.4-3.6"
        stroke="#D9A52E"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function JourneyPanel() {
  const { t } = useLocale();
  const journey = journeyMeta.map((step, i) => ({
    ...step,
    title: t.heroCards[i]?.title ?? "",
    body: t.heroCards[i]?.body ?? "",
  }));

  return (
    <div className="relative w-full">
      <ol className="relative hidden grid-cols-3 gap-2.5 md:grid lg:gap-3">
        {journey.map((step) => (
          <li key={step.id} className="flex items-stretch">
            <article className="flex w-full flex-col rounded-xl border border-white/12 bg-white/[0.06] p-3 shadow-[0_6px_18px_rgba(0,0,0,0.14)] lg:p-3.5">
              <JourneyIcon id={step.id} />
              <h3 className="mt-2.5 font-display text-[0.92rem] font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-1 flex-1 text-[0.75rem] leading-5 text-mint/90">
                {step.body}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-white/15" />
                <span className="font-display text-[0.65rem] tracking-[0.16em] text-sand">
                  {step.num}
                </span>
                <span className="h-px flex-1 bg-white/15" />
              </div>
            </article>
          </li>
        ))}
      </ol>

      <ol className="relative flex flex-col gap-0 md:hidden">
        {journey.map((step, i) => (
          <li key={step.id} className="relative flex gap-3">
            <div className="flex w-5 flex-col items-center">
              <span className="mt-4 h-2 w-2 rounded-full bg-sand" />
              {i < journey.length - 1 && (
                <span className="w-px flex-1 bg-sand/35" aria-hidden />
              )}
            </div>
            <article className="mb-3 flex-1 rounded-xl border border-white/12 bg-white/[0.05] p-3">
              <JourneyIcon id={step.id} />
              <h3 className="mt-2 font-display text-sm font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-mint/90">{step.body}</p>
              <p className="mt-2 font-display text-[0.65rem] tracking-[0.14em] text-sand">
                {step.num}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Value band after the scroll drone story. */
export function Hero() {
  const { content } = useSiteContent();
  const { t } = useLocale();
  const { hero, stats, complianceChecks } = content;

  return (
    <section
      className="hero-value relative overflow-x-clip border-t border-white/8 bg-bg"
      aria-labelledby="hero-value-title"
    >
      {/* Atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 55% 35%, rgba(217,165,46,0.1), transparent 60%), radial-gradient(ellipse 50% 40% at 15% 80%, rgba(169,212,205,0.08), transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' fill='none'><path d='M40 120C180 80 260 160 400 140S640 60 760 100M20 260C160 220 300 300 460 270S700 200 790 240M60 420C200 380 320 460 480 430S720 350 780 390' stroke='%23a9d4cd' stroke-width='1.2'/></svg>`,
          )}")`,
          backgroundSize: "min(100%, 900px) auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 20%",
        }}
      />

      <div className="section-pad relative z-10 mx-auto max-w-[1440px] py-[clamp(1.75rem,4vw,2.75rem)]">
        <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-2 lg:gap-6 xl:gap-8">
          {/* Copy — RTL start */}
          <Reveal className="order-1 min-w-0 lg:max-w-xl" variant="right">
            <p className="mb-2 font-display text-[0.72rem] font-medium tracking-[0.06em] text-[#D9A52E]">
              {hero.eyebrow}
            </p>
            <h2
              id="hero-value-title"
              className="font-display max-w-[20ch] text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-[1.4] text-ink"
            >
              {hero.title}
            </h2>
            <p className="mt-3 max-w-[40ch] text-[0.9rem] leading-7 text-mint">
              {hero.body}
            </p>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <a
                href="/request-service"
                className="inline-flex items-center justify-center rounded-full bg-[#D9A52E] px-5 py-2.5 text-[0.88rem] font-semibold text-[#0B4A45] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D9A52E]"
              >
                {hero.primaryCta}
              </a>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-full border border-white/35 bg-transparent px-5 py-2.5 text-[0.88rem] font-semibold text-ink transition hover:border-mint hover:bg-white/6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </Reveal>

          {/* Journey — RTL end */}
          <Reveal className="order-2 min-w-0" delay={0.1} variant="left">
            <JourneyPanel />
          </Reveal>
        </div>

        {/* Stats board */}
        <Reveal className="mt-6 lg:mt-7" delay={0.16} variant="up">
          <div className="overflow-hidden rounded-xl border border-white/12 bg-white/[0.05]">
            <ul className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
              {stats.map((item, i) => (
                <li
                  key={item.label}
                  className={`px-4 py-4 sm:px-5 sm:py-4 ${
                    i % 2 === 1 ? "sm:border-s sm:border-white/10" : ""
                  } ${i >= 2 ? "sm:border-t sm:border-white/10 lg:border-t-0" : ""} ${
                    i > 0 ? "lg:border-s lg:border-white/10" : ""
                  }`}
                >
                  <div className="font-display text-[clamp(1.25rem,2vw,1.55rem)] font-semibold text-[#D9A52E]">
                    {item.value === "ساعات" || item.value === "Hours"
                      ? t.hoursWithin
                      : item.value}
                  </div>
                  <p className="mt-1 text-[0.84rem] font-medium leading-5 text-ink">
                    {item.label}
                  </p>
                  <p className="mt-2 flex items-start gap-1.5 text-[0.74rem] leading-5 text-mint/85">
                    <svg
                      className="mt-0.5 h-3 w-3 shrink-0 text-[#D9A52E]"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2.5 7.2l2.8 2.8 6.2-6.4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{complianceChecks[i] ?? complianceChecks[0]}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
