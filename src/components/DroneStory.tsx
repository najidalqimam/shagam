"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef, useState } from "react";
import { SaudiMap2D, type SaudiMap2DHandle } from "./SaudiMap2D";
import { Reveal } from "./Reveal";
import { useLocale } from "./LocaleProvider";

gsap.registerPlugin(ScrollTrigger);

const STAGE_IDS = ["droneA", "droneB", "droneC", "droneD"] as const;
const STAGE_COUNT = STAGE_IDS.length;

function stageFromProgress(p: number) {
  return Math.min(STAGE_COUNT - 1, Math.max(0, Math.floor(p * STAGE_COUNT)));
}

export function DroneStory() {
  const { t } = useLocale();
  const stages = useMemo(
    () =>
      STAGE_IDS.map((id, i) => ({
        id,
        label: t.storyStages[i]?.label ?? "",
        title: t.storyStages[i]?.title ?? "",
        body: t.storyStages[i]?.body ?? "",
      })),
    [t],
  );

  const wrapRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const mapRef = useRef<SaudiMap2DHandle>(null);
  const [stage, setStage] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const stageEl = wrap.querySelector<HTMLElement>(".drone-stage");
    if (!stageEl) return;

    const syncUi = (p: number) => {
      progressRef.current = p;
      mapRef.current?.setProgress(p);

      const nextStage = stageFromProgress(p);
      setStage((prev) => (prev === nextStage ? prev : nextStage));

      const nextHint = p < 0.07;
      setShowHint((prev) => (prev === nextHint ? prev : nextHint));
    };

    if (reducedMotion) {
      syncUi(0);
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        id: "shagamDrone",
        trigger: stageEl,
        start: "top top",
        end: () => `+=${window.innerHeight * 2.6}`,
        scrub: 0.35,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onUpdate: (self) => syncUi(self.progress),
        onRefresh: (self) => syncUi(self.progress),
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        syncUi(st.progress);
      });

      return () => {
        st.kill();
      };
    });

    mm.add("(max-width: 1023px)", () => {
      const st = ScrollTrigger.create({
        id: "shagamDroneMobile",
        trigger: wrap,
        start: "top 20%",
        end: "bottom 40%",
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (self) => syncUi(self.progress),
        onRefresh: (self) => syncUi(self.progress),
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        syncUi(st.progress);
      });

      return () => {
        st.kill();
      };
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mm.revert();
      ScrollTrigger.getById("shagamDrone")?.kill();
      ScrollTrigger.getById("shagamDroneMobile")?.kill();
    };
  }, [reducedMotion]);

  const active = stages[stage];

  return (
    <section
      ref={wrapRef}
      id="top"
      className="drone-wrap relative w-full max-w-[100vw] overflow-x-clip bg-[#F2F8F6]"
      aria-label={t.mapAria}
    >
      <div className="drone-stage relative w-full max-w-[100vw] overflow-x-clip lg:h-[100svh] lg:overflow-hidden">
        <div className="section-pad relative z-20 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-8 py-20 lg:h-full lg:grid-cols-2 lg:gap-12 lg:py-0 lg:pt-[4.75rem]">
          <Reveal className="relative z-30 order-1 w-full min-w-0 justify-self-start" variant="right">
            <div className="relative min-h-[10.25rem] max-w-[34rem] sm:min-h-[11rem] lg:min-h-[12.25rem]">
              {stages.map((item, i) => (
                <div
                  key={item.id}
                  id={item.id}
                  className="drone-slide transition-[opacity,transform] duration-500 ease-out"
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    insetInline: 0,
                    top: i === 0 ? undefined : 0,
                    opacity: i === stage ? 1 : 0,
                    visibility: i === stage ? "visible" : "hidden",
                    transform:
                      i === stage ? "translateY(0)" : "translateY(8px)",
                    pointerEvents: i === stage ? "auto" : "none",
                  }}
                  aria-hidden={i !== stage}
                >
                  <p className="mb-3 font-display text-[0.78rem] font-semibold tracking-[0.08em] text-[#D9A52E]">
                    {String(i + 1).padStart(2, "0")} — {item.label}
                  </p>
                  <h2 className="font-display max-w-[18ch] text-[clamp(1.25rem,2.8vw,1.85rem)] font-semibold leading-[1.45] text-[#07564F]">
                    {item.title}
                  </h2>
                  <p className="mt-2.5 max-w-[36ch] text-[0.95rem] leading-7 text-[#4d6f6a]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <ol
              className="mt-4 grid max-w-xl grid-cols-4 gap-2 sm:mt-5 lg:mt-6"
              aria-label={t.stagesAria}
            >
              {stages.map((item, i) => {
                const done = i < stage;
                const current = i === stage;
                return (
                  <li key={item.id} className="relative flex flex-col items-center gap-2">
                    {i < stages.length - 1 && (
                      <span
                        className={`pointer-events-none absolute top-3.5 start-1/2 h-[2px] w-full ${
                          done ? "bg-[#07564F]" : "bg-[#07564F]/18"
                        }`}
                        aria-hidden
                      />
                    )}
                    <span
                      className={`relative z-[1] flex h-7 w-7 items-center justify-center rounded-full border-2 text-[0.65rem] font-bold transition-colors ${
                        current
                          ? "border-[#D9A52E] bg-[#D9A52E] text-white"
                          : done
                            ? "border-[#07564F] bg-[#07564F] text-white"
                            : "border-[#07564F]/25 bg-[#F2F8F6] text-[#07564F]/45"
                      }`}
                      aria-current={current ? "step" : undefined}
                    >
                      {done ? (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path
                            d="M2.5 6.2 L4.8 8.5 L9.5 3.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    <span
                      className={`text-center text-[0.68rem] leading-4 ${
                        current
                          ? "font-semibold text-[#D9A52E]"
                          : done
                            ? "font-medium text-[#07564F]"
                            : "text-[#07564F]/40"
                      }`}
                    >
                      {item.label}
                    </span>
                  </li>
                );
              })}
            </ol>

            <p className="mt-8 max-w-sm text-xs leading-6 text-[#4d6f6a]">
              {t.storyTagline}
            </p>
          </Reveal>

          <Reveal
            className="relative order-2 flex h-[min(58vw,300px)] w-full min-w-0 items-center justify-center justify-self-end overflow-hidden sm:h-[340px] lg:h-[min(78vh,700px)] lg:overflow-visible"
            delay={0.12}
            variant="left"
          >
            <SaudiMap2D
              ref={mapRef}
              progressRef={progressRef}
              stageIndex={stage}
              reducedMotion={reducedMotion}
            />
          </Reveal>
        </div>

        <div
          className={`pointer-events-none absolute bottom-5 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#4d6f6a] transition-opacity duration-500 lg:flex ${
            showHint && !reducedMotion ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={!showHint}
        >
          <svg width="22" height="34" viewBox="0 0 22 34" fill="none">
            <rect
              x="1"
              y="1"
              width="20"
              height="32"
              rx="10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <line
              x1="11"
              x2="11"
              y1="8"
              y2="14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className={reducedMotion ? undefined : "animate-pulse"}
            />
          </svg>
          <span className="flex flex-col items-center gap-0.5 text-[0.68rem] tracking-[0.12em]">
            <span>{t.scrollHint}</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden>
              <path
                d="M1 1.5 L6 6.5 L11 1.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <p className="sr-only" aria-live="polite">
          {t.stageOf(stage + 1, STAGE_COUNT)}: {active.label}. {active.title}
        </p>
      </div>
    </section>
  );
}
