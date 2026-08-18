"use client";

import type { OperatorJoinStep } from "@/lib/operatorJoin";
import { useLocale } from "../LocaleProvider";

const STEPS: { id: OperatorJoinStep; key: "stepBasic" | "stepLicense" | "stepFleet" | "stepReview" }[] = [
  { id: 1, key: "stepBasic" },
  { id: 2, key: "stepLicense" },
  { id: 3, key: "stepFleet" },
  { id: 4, key: "stepReview" },
];

export function OperatorStepper({ step }: { step: OperatorJoinStep }) {
  const { t } = useLocale();
  const oj = t.operatorJoin;

  return (
    <>
      {/* Desktop / tablet sidebar — height follows content */}
      <aside className="relative hidden h-fit self-start overflow-hidden rounded-2xl bg-brand p-4 text-ink shadow-[0_12px_28px_rgba(11,74,69,0.22)] lg:block lg:p-5">
        <div>
          <h2 className="font-display text-base font-bold leading-snug">{oj.stepsTitle}</h2>
          <p className="mt-1 text-xs leading-5 text-mint">{oj.stepsSubtitle}</p>
        </div>

        <ol className="relative mt-5 space-y-0">
          {STEPS.map((item, index) => {
            const done = step > item.id;
            const active = step === item.id;
            const isLast = index === STEPS.length - 1;
            return (
              <li key={item.id} className="relative flex gap-2.5 pb-4 last:pb-0">
                {!isLast && (
                  <span
                    className={`absolute start-[13px] top-7 h-[calc(100%-1rem)] w-px border-s border-dashed ${
                      done ? "border-sand" : "border-white/25"
                    }`}
                    aria-hidden
                  />
                )}
                <span
                  className={`relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold ${
                    active
                      ? "bg-sand text-brand shadow-[0_0_0_4px_rgba(184,148,79,0.28)]"
                      : done
                        ? "bg-white text-brand"
                        : "border border-white/35 bg-transparent text-mint"
                  }`}
                >
                  {done ? (
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                      <path d="M8.1 13.6 4.8 10.3l1.2-1.2 2.1 2.1 5-5.1 1.2 1.2-6.2 6.3z" />
                    </svg>
                  ) : (
                    String(item.id).padStart(2, "0")
                  )}
                </span>
                <div className="min-w-0 pt-1">
                  <p
                    className={`text-[0.65rem] font-bold tracking-[0.12em] ${
                      active ? "text-sand" : "text-mint/70"
                    }`}
                  >
                    {String(item.id).padStart(2, "0")}
                  </p>
                  <p
                    className={`mt-0.5 text-xs font-semibold leading-5 ${
                      active ? "text-ink" : done ? "text-ink/90" : "text-mint"
                    }`}
                  >
                    {oj[item.key]}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </aside>

      {/* Mobile horizontal stepper */}
      <div className="h-fit rounded-2xl bg-brand px-4 py-3 text-ink lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[0.65rem] font-bold tracking-[0.12em] text-sand">
              {oj.stepOf(step, 4)}
            </p>
            <p className="mt-0.5 font-display text-sm font-bold">
              {oj[STEPS[step - 1].key]}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {STEPS.map((item) => (
              <span
                key={item.id}
                className={`h-2 rounded-full transition-all ${
                  item.id === step
                    ? "w-6 bg-sand"
                    : item.id < step
                      ? "w-2 bg-white"
                      : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
