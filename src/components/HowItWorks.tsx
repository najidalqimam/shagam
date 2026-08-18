"use client";

import type { StepItem } from "@/lib/cms/types";
import { Reveal } from "./Reveal";
import { useLocale } from "./LocaleProvider";
import { useSiteContent } from "./SiteContentProvider";
import { useEffect, useRef, useState } from "react";

const GOLD = "#D3A74D";
const GREEN = "#07564F";
const VB_W = 1000;
const VB_H = 200;

/** 5 evenly spaced nodes (RTL: 01 on the right). Shallow sine. */
const NODE_XY = [
  { x: 880, y: 86 },
  { x: 690, y: 128 },
  { x: 500, y: 86 },
  { x: 310, y: 128 },
  { x: 120, y: 86 },
] as const;

const HANDLE = 42;

/** Smooth sine through the nodes, flat tangents at each step. */
const PATH_D = [
  `M ${NODE_XY[0].x} ${NODE_XY[0].y}`,
  `C ${NODE_XY[0].x - HANDLE} ${NODE_XY[0].y}, ${NODE_XY[1].x + HANDLE} ${NODE_XY[1].y}, ${NODE_XY[1].x} ${NODE_XY[1].y}`,
  `C ${NODE_XY[1].x - HANDLE} ${NODE_XY[1].y}, ${NODE_XY[2].x + HANDLE} ${NODE_XY[2].y}, ${NODE_XY[2].x} ${NODE_XY[2].y}`,
  `C ${NODE_XY[2].x - HANDLE} ${NODE_XY[2].y}, ${NODE_XY[3].x + HANDLE} ${NODE_XY[3].y}, ${NODE_XY[3].x} ${NODE_XY[3].y}`,
  `C ${NODE_XY[3].x - HANDLE} ${NODE_XY[3].y}, ${NODE_XY[4].x + HANDLE} ${NODE_XY[4].y}, ${NODE_XY[4].x} ${NODE_XY[4].y}`,
].join(" ");

/** Cards sit above peaks and below troughs. */
const CARD_SIDE: Array<"up" | "down"> = ["up", "down", "up", "down", "up"];

function StepIcon({ index }: { index: number }) {
  const common = {
    className: "h-6 w-6",
    fill: "none" as const,
    viewBox: "0 0 32 32",
    "aria-hidden": true as const,
  };

  if (index === 0) {
    return (
      <svg {...common}>
        <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="18" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="5" y="18" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
        <rect x="18" y="18" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (index === 1) {
    return (
      <svg {...common}>
        <circle cx="16" cy="14" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16 7v14M9 14h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M16 21c-3 3-6 5-6 7h12c0-2-3-4-6-7Z" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (index === 2) {
    return (
      <svg {...common}>
        <rect x="7" y="5" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M11 11h6M11 15h6M11 19h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="23" cy="23" r="6" fill={GREEN} stroke={GOLD} strokeWidth="1.4" />
        <path d="M20.8 23.1l1.6 1.6 3-3.2" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (index === 3) {
    return (
      <svg {...common}>
        <rect x="6" y="6" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 12h8M10 16h8M10 20h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M22 10l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="6" y="5" width="15" height="20" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 11h7M10 15h7M10 19h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="23" cy="23" r="6" fill={GREEN} stroke={GOLD} strokeWidth="1.4" />
      <path d="M20.8 23.1l1.6 1.6 3-3.2" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function DesktopJourney({ steps }: { steps: StepItem[] }) {
  return (
    <div className="relative mx-auto w-full max-w-[1040px]">
      <div className="relative pt-10 pb-16">
        <div className="relative w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <path
            d={PATH_D}
            fill="none"
            stroke="rgba(7,86,79,0.28)"
            strokeWidth="2.4"
            strokeDasharray="7 8"
            strokeLinecap="round"
          />
        </svg>

        {NODE_XY.map((pt, i) => (
          <div
            key={steps[i].num}
            className="absolute z-10"
            style={{
              left: `${(pt.x / VB_W) * 100}%`,
              top: `${(pt.y / VB_H) * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="flex h-3.5 w-3.5 rounded-full border-2 border-[#07564F] bg-[#F2F8F6]" />
          </div>
        ))}

        {steps.map((step, i) => {
          const pt = NODE_XY[i];
          const up = CARD_SIDE[i] === "up";

          return (
            <div
              key={step.num}
              className="absolute z-10 w-[min(168px,16.5vw)]"
              style={{
                left: `${(pt.x / VB_W) * 100}%`,
                top: `${(pt.y / VB_H) * 100}%`,
                transform: up
                  ? "translate(-50%, calc(-100% - 12px))"
                  : "translate(-50%, 12px)",
              }}
            >
              <span
                className={`absolute left-1/2 w-px bg-[#07564F]/25 ${
                  up ? "bottom-0 h-3 translate-y-full" : "top-0 h-3 -translate-y-full"
                }`}
                aria-hidden
              />

              <article className="rounded-xl border border-[#07564F]/18 bg-white p-3 text-[#07564F] shadow-[0_6px_18px_rgba(7,86,79,0.07)]">
                <div className="text-[#07564F]">
                  <StepIcon index={i} />
                </div>
                <h3 className="mt-1.5 font-display text-[0.8rem] font-semibold leading-snug">
                  {step.num} - {step.title}
                </h3>
                <p className="mt-1 line-clamp-3 text-[0.68rem] leading-4 text-[#4d6f6a]">
                  {step.body}
                </p>
              </article>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

function TabletJourney({
  steps,
  activeStep,
  setActiveStep,
}: {
  steps: StepItem[];
  activeStep: number;
  setActiveStep: (n: number) => void;
}) {
  const { t: ui } = useLocale();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.querySelector<HTMLElement>(`[data-step="${activeStep}"]`);
    // Instant align - avoid smooth scroll fighting the page scroll
    card?.scrollIntoView({ inline: "center", block: "nearest", behavior: "auto" });
  }, [activeStep]);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="rail flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-4"
      >
        {steps.map((step, i) => {
          const active = i === activeStep;
          return (
            <button
              key={step.num}
              type="button"
              data-step={i}
              onClick={() => setActiveStep(i)}
              className={`w-[min(280px,78vw)] shrink-0 snap-center rounded-2xl border p-5 text-start transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07564F] ${
                active
                  ? "border-[#D3A74D] bg-[#07564F] text-white"
                  : "border-[#07564F]/15 bg-white text-[#07564F]"
              }`}
            >
              {active && (
                <p className="mb-2 text-[0.7rem] font-semibold text-[#D3A74D]">
                  {ui.phaseOf(i + 1, 5)}
                </p>
              )}
              <div className={active ? "text-[#D3A74D]" : "text-[#07564F]"}>
                <StepIcon index={i} />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">
                {step.num} - {step.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-6 ${
                  active ? "text-white/85" : "text-[#4d6f6a]"
                }`}
              >
                {step.body}
              </p>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex justify-center gap-2">
        {steps.map((s, i) => (
          <button
            key={s.num}
            type="button"
            aria-label={ui.stepAria(s.num)}
            onClick={() => setActiveStep(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === activeStep ? "bg-[#D3A74D]" : "bg-[#07564F]/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function MobileJourney({ steps }: { steps: StepItem[] }) {
  return (
    <ol className="relative mx-auto flex max-w-lg flex-col gap-3">
      {steps.map((step, i) => (
        <li key={step.num}>
          <article className="rounded-2xl border border-[#07564F]/15 bg-white p-4 text-[#07564F]">
            <div className="text-[#07564F]">
              <StepIcon index={i} />
            </div>
            <h3 className="mt-3 font-display text-base font-semibold">
              {step.num} - {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#4d6f6a]">{step.body}</p>
          </article>
        </li>
      ))}
    </ol>
  );
}

export function HowItWorks() {
  const { content } = useSiteContent();
  const { t } = useLocale();
  const steps = content.steps;
  const [layout, setLayout] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const tablet = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const sync = () => {
      if (desktop.matches) setLayout("desktop");
      else if (tablet.matches) setLayout("tablet");
      else setLayout("mobile");
    };
    sync();
    desktop.addEventListener("change", sync);
    tablet.addEventListener("change", sync);
    return () => {
      desktop.removeEventListener("change", sync);
      tablet.removeEventListener("change", sync);
    };
  }, []);

  return (
    <section
      id="how"
      className="relative overflow-x-clip border-t border-line-dark bg-[#F2F8F6] text-[#07564F]"
      aria-labelledby="how-title"
    >
      <div className="section-pad relative z-10 mx-auto max-w-[1440px] py-[clamp(1.75rem,3.2vw,2.75rem)]">
        <Reveal variant="up">
          <div className="relative z-20 mx-auto max-w-2xl text-center">
            <p className="mb-2 inline-flex items-center gap-3 font-display text-[0.75rem] font-semibold tracking-[0.2em] text-[#D3A74D]">
              <span className="hidden h-px w-8 bg-[#D3A74D]/50 sm:block" />
              {content.how.eyebrow}
              <span className="hidden h-px w-8 bg-[#D3A74D]/50 sm:block" />
            </p>
            <h2
              id="how-title"
              className="font-display text-[clamp(1.3rem,2.4vw,1.85rem)] font-semibold leading-[1.35]"
            >
              {content.how.title}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-[0.9rem] leading-6 text-[#4d6f6a]">
              {content.how.body}
            </p>
          </div>
        </Reveal>

        <Reveal className="relative z-0 mt-2" delay={0.1} variant="scale">
          {layout === "desktop" && <DesktopJourney steps={steps} />}
          {layout === "tablet" && (
            <TabletJourney
              steps={steps}
              activeStep={activeStep}
              setActiveStep={setActiveStep}
            />
          )}
          {layout === "mobile" && <MobileJourney steps={steps} />}
        </Reveal>

        <Reveal className="relative z-20 mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8" delay={0.16} variant="up">
          <a
            href="/request-service"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D3A74D] px-6 py-3 text-[0.92rem] font-semibold text-[#07564F] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3A74D]"
          >
            {t.journeyCta}
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 text-[0.92rem] font-semibold text-[#07564F] transition hover:text-[#D3A74D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07564F]"
          >
            {t.journeyDetails}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
