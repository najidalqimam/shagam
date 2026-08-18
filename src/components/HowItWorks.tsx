"use client";

import type { StepItem } from "@/lib/cms/types";
import { DroneIcon } from "./DroneIcon";
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

function DesktopJourney({
  steps,
  activeStep,
  progress,
  reducedMotion,
  inView,
}: {
  steps: StepItem[];
  activeStep: number;
  progress: number;
  reducedMotion: boolean;
  inView: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const traveledRef = useRef<SVGPathElement>(null);
  const droneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const traveled = traveledRef.current;
    const drone = droneRef.current;
    if (!path || !traveled || !drone) return;

    const len = path.getTotalLength();
    if (len <= 0) return;

    traveled.style.strokeDasharray = `${len}`;
    const draw = Math.min(1, Math.max(0, progress));
    traveled.style.strokeDashoffset = `${len * (1 - draw)}`;

    const node = NODE_XY[Math.min(activeStep, NODE_XY.length - 1)];
    const dist = reducedMotion ? null : draw * len;
    const pt = dist == null ? node : path.getPointAtLength(dist);
    const lookAt = dist == null ? len * 0.02 : Math.min(len, dist + 4);
    const look = path.getPointAtLength(lookAt);
    const angle = (Math.atan2(look.y - pt.y, look.x - pt.x) * 180) / Math.PI;
    const lean = Math.max(-24, Math.min(24, angle * 0.2));

    drone.style.left = `${(pt.x / VB_W) * 100}%`;
    drone.style.top = `${(pt.y / VB_H) * 100}%`;
    drone.style.transform = `translate3d(-50%, -50%, 0) rotate(${lean}deg)`;
  }, [progress, activeStep, reducedMotion]);

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
          {/* Upcoming dashed */}
          <path
            d={PATH_D}
            fill="none"
            stroke="rgba(7,86,79,0.22)"
            strokeWidth="2.4"
            strokeDasharray="7 8"
            strokeLinecap="round"
          />
          {/* Completed solid */}
          <path
            ref={traveledRef}
            d={PATH_D}
            fill="none"
            stroke={GREEN}
            strokeWidth="2.8"
            strokeLinecap="round"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />
          <path
            ref={pathRef}
            d={PATH_D}
            fill="none"
            stroke="transparent"
            strokeWidth="10"
          />
        </svg>

        {/* Nodes */}
        {NODE_XY.map((pt, i) => {
          const done = i < activeStep;
          const active = i === activeStep;
          return (
            <div
              key={steps[i].num}
              className="absolute z-10"
              style={{
                left: `${(pt.x / VB_W) * 100}%`,
                top: `${(pt.y / VB_H) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {active && !reducedMotion && (
                <span
                  className="absolute inset-0 -m-2 rounded-full bg-[#D3A74D]/35 map-city-pulse"
                  aria-hidden
                />
              )}
              <span
                className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                  active
                    ? "h-5 w-5 border-[#D3A74D] bg-[#07564F]"
                    : done
                      ? "border-[#07564F] bg-[#07564F]"
                      : "border-[#07564F]/35 bg-[#F2F8F6]"
                }`}
              >
                {done && (
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path
                      d="M2 6.2l2.6 2.6 5.2-5.4"
                      stroke="#fff"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
            </div>
          );
        })}

        {/* Drone */}
        <div
          ref={droneRef}
          className="pointer-events-none absolute z-20 h-9 w-9"
          style={{
            left: `${(NODE_XY[0].x / VB_W) * 100}%`,
            top: `${(NODE_XY[0].y / VB_H) * 100}%`,
            transform: "translate3d(-50%, -50%, 0)",
          }}
        >
          <DroneIcon animate={inView && !reducedMotion} className="h-full w-full" />
        </div>

        {/* Cards */}
        {steps.map((step, i) => {
          const pt = NODE_XY[i];
          const up = CARD_SIDE[i] === "up";
          const active = i === activeStep;
          const upcoming = i > activeStep;

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

              <article
                className={`rounded-xl border p-3 shadow-[0_6px_18px_rgba(7,86,79,0.07)] transition duration-300 ${
                  active
                    ? "border-[#D3A74D] bg-[#07564F] text-white shadow-[0_10px_24px_rgba(7,86,79,0.2)]"
                    : upcoming
                      ? "border-[#07564F]/15 bg-white/90 text-[#07564F] opacity-90"
                      : "border-[#07564F]/18 bg-white text-[#07564F]"
                }`}
              >
                <div className={active ? "text-[#D3A74D]" : "text-[#07564F]"}>
                  <StepIcon index={i} />
                </div>
                <h3 className="mt-1.5 font-display text-[0.8rem] font-semibold leading-snug">
                  {step.num} — {step.title}
                </h3>
                <p
                  className={`mt-1 line-clamp-3 text-[0.68rem] leading-4 ${
                    active ? "text-white/85" : "text-[#4d6f6a]"
                  }`}
                >
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
    // Instant align — avoid smooth scroll fighting the page scroll
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
                {step.num} — {step.title}
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

function MobileJourney({
  steps,
  activeStep,
  progress,
  reducedMotion,
  inView,
}: {
  steps: StepItem[];
  activeStep: number;
  progress: number;
  reducedMotion: boolean;
  inView: boolean;
}) {
  const { t: ui } = useLocale();
  const droneTop = `${8 + progress * 84}%`;

  return (
    <ol className="relative mx-auto flex max-w-lg flex-col gap-0">
      {/* Vertical rail */}
      <span
        className="absolute start-3 top-4 bottom-4 w-px bg-[#07564F]/20"
        aria-hidden
      />
      <span
        className="absolute start-3 top-4 w-px origin-top bg-[#07564F] transition-[height] duration-300"
        style={{ height: `calc(${progress * 100}% - 1rem)` }}
        aria-hidden
      />

      {!reducedMotion && (
        <div
          className="pointer-events-none absolute start-0 z-20 h-10 w-10 -translate-x-1/4 transition-[top] duration-300"
          style={{ top: droneTop }}
        >
          <DroneIcon animate={inView && !reducedMotion} className="h-full w-full" />
        </div>
      )}

      {steps.map((step, i) => {
        const active = i === activeStep;
        const done = i < activeStep;
        return (
          <li key={step.num} className="relative flex gap-4 pb-5">
            <span
              className={`relative z-10 mt-5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 ${
                active
                  ? "border-[#D3A74D] bg-[#07564F] ring-4 ring-[#D3A74D]/25"
                  : done
                    ? "border-[#07564F] bg-[#07564F]"
                    : "border-[#07564F]/30 bg-[#F2F8F6]"
              }`}
            />
            <article
              className={`flex-1 rounded-2xl border p-4 transition ${
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
              <h3 className="mt-3 font-display text-base font-semibold">
                {step.num} — {step.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-6 ${
                  active ? "text-white/85" : "text-[#4d6f6a]"
                }`}
              >
                {step.body}
              </p>
            </article>
          </li>
        );
      })}
    </ol>
  );
}

export function HowItWorks() {
  const { content } = useSiteContent();
  const { locale, t } = useLocale();
  const steps = content.steps;
  const ctaArrow = locale === "ar" ? "←" : "→";
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const stepRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [layout, setLayout] = useState<"mobile" | "tablet" | "desktop">("desktop");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;

    const apply = (p: number) => {
      const clamped = Math.min(1, Math.max(0, p));
      const step =
        clamped >= 1
          ? steps.length - 1
          : Math.min(steps.length - 1, Math.floor(clamped * steps.length));

      const progressChanged = Math.abs(clamped - progressRef.current) >= 0.02;
      const stepChanged = step !== stepRef.current;
      if (!progressChanged && !stepChanged) return;

      progressRef.current = clamped;
      stepRef.current = step;
      if (progressChanged) setProgress(clamped);
      if (stepChanged) setActiveStep(step);
    };

    /** Progress while the section crosses the viewport — no pin, no trap. */
    const readProgress = () => {
      if (!inView && progressRef.current <= 0) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const startY = vh * 0.62;
      const endY = vh * 0.28;
      const range = rect.height + (startY - endY);
      if (range <= 0) return;
      const scrolled = startY - rect.top;
      apply(scrolled / range);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        readProgress();
      });
    };

    readProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion, inView]);

  // Reduced motion: show full journey without scroll-driven animation.
  const journeyProgress = reducedMotion ? 1 : progress;
  const journeyStep = reducedMotion ? steps.length - 1 : activeStep;

  return (
    <section
      ref={sectionRef}
      id="how"
      className="relative overflow-x-clip border-t border-line-dark bg-[#F2F8F6] text-[#07564F]"
      aria-labelledby="how-title"
    >
      {/* Faint topo lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='500' fill='none'><path d='M20 120C160 70 280 160 420 120S700 40 880 90M40 260C200 210 340 300 500 250S780 180 880 230M60 400C220 350 380 430 540 390S780 320 880 370' stroke='%2307564F' stroke-width='1.2'/></svg>`,
          )}")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 30%",
          backgroundSize: "min(100%, 1000px) auto",
        }}
      />

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
          {layout === "desktop" && (
            <DesktopJourney
              steps={steps}
              activeStep={journeyStep}
              progress={journeyProgress}
              reducedMotion={reducedMotion}
              inView={inView}
            />
          )}
          {layout === "tablet" && (
            <TabletJourney
              steps={steps}
              activeStep={journeyStep}
              setActiveStep={setActiveStep}
            />
          )}
          {layout === "mobile" && (
            <MobileJourney
              steps={steps}
              activeStep={journeyStep}
              progress={journeyProgress}
              reducedMotion={reducedMotion}
              inView={inView}
            />
          )}
        </Reveal>

        <Reveal className="relative z-20 mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8" delay={0.16} variant="up">
          <a
            href="/request-service"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D3A74D] px-6 py-3 text-[0.92rem] font-semibold text-[#07564F] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D3A74D]"
          >
            {t.journeyCta}
            <span aria-hidden>{ctaArrow}</span>
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 text-[0.92rem] font-semibold text-[#07564F] transition hover:text-[#D3A74D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#07564F]"
          >
            {t.journeyDetails}
            <span aria-hidden>{ctaArrow}</span>
          </a>
        </Reveal>

        <p className="sr-only" aria-live="polite">
          {t.stageOf(journeyStep + 1, steps.length)}: {steps[journeyStep].title}
        </p>
      </div>
    </section>
  );
}
