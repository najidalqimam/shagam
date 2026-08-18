"use client";

import type { ReactNode } from "react";
import {
  ORG_TYPE_ENTITY,
  ORG_TYPE_INDIVIDUAL,
  type OperatorBasicInfo,
} from "@/lib/operatorJoin";
import { useLocale } from "../LocaleProvider";
import { FormNavigation } from "./FormNavigation";
import { ojField, ojLabel, ojSelect } from "./styles";

type Props = {
  value: OperatorBasicInfo;
  cities: string[];
  sectors: string[];
  errors: Partial<Record<keyof OperatorBasicInfo, string>>;
  onChange: (next: OperatorBasicInfo) => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onClear: () => void;
};

function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute start-3 top-1/2 z-[1] -translate-y-1/2 text-brand/45">
      {children}
    </span>
  );
}

export function BasicInformationStep({
  value,
  cities,
  sectors,
  errors,
  onChange,
  onNext,
  onSaveDraft,
  onClear,
}: Props) {
  const { t } = useLocale();
  const oj = t.operatorJoin;
  const f = t.form;

  const set = <K extends keyof OperatorBasicInfo>(key: K, v: OperatorBasicInfo[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold text-brand">{oj.basicTitle}</h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-brand/65">{oj.basicBody}</p>
        </div>
        <span className="rounded-full bg-sand/20 px-3 py-1.5 text-xs font-bold text-brand">
          {oj.stepOf(1, 4)}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className={ojLabel}>
            {f.fullName.replace(" *", "")}{" "}
            <span className="text-sand">{oj.requiredMark}</span>
          </span>
          <span className="relative block">
            <FieldIcon>
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1.5c-3.3 0-6 2-6 4.5V17h12v-1c0-2.5-2.7-4.5-6-4.5z" />
              </svg>
            </FieldIcon>
            <input
              className={ojField}
              value={value.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              autoComplete="name"
            />
          </span>
          {errors.fullName ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
          ) : null}
        </label>

        <div className="block">
          <span className={ojLabel}>
            {f.organization.replace(" *", "")}{" "}
            <span className="text-sand">{oj.requiredMark}</span>
          </span>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label={f.organization}>
            {(
              [
                { value: ORG_TYPE_ENTITY, label: oj.orgEntity },
                { value: ORG_TYPE_INDIVIDUAL, label: oj.orgIndividual },
              ] as const
            ).map((opt) => {
              const active = value.organization === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => set("organization", opt.value)}
                  className={`flex h-10 items-center justify-center rounded-xl border text-sm font-semibold transition ${
                    active
                      ? "border-sand bg-sand/15 text-brand"
                      : "border-brand/15 bg-[#f2f7f6] text-brand/70 hover:border-brand/30 hover:bg-white"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {errors.organization ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.organization}</p>
          ) : null}
        </div>

        <label className="block">
          <span className={ojLabel}>
            {f.phone.replace(" *", "")}{" "}
            <span className="text-sand">{oj.requiredMark}</span>
          </span>
          <span className="relative flex">
            <span className="absolute start-0 top-0 z-[1] flex h-10 w-16 items-center justify-center rounded-s-xl border border-brand/15 bg-brand/5 text-xs font-bold text-brand">
              +966
            </span>
            <span className="pointer-events-none absolute start-[4.65rem] top-1/2 z-[1] -translate-y-1/2 text-brand/45">
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M4.5 3.5h3l1.2 3.2-1.5 1.5a10.5 10.5 0 0 0 4.6 4.6l1.5-1.5 3.2 1.2v3a1.5 1.5 0 0 1-1.5 1.5A13.5 13.5 0 0 1 3 5a1.5 1.5 0 0 1 1.5-1.5z" />
              </svg>
            </span>
            <input
              className={`${ojField} ps-[5.8rem]`}
              value={value.phone}
              onChange={(e) => set("phone", e.target.value)}
              inputMode="tel"
              placeholder="5xxxxxxxx"
              autoComplete="tel-national"
            />
          </span>
          {errors.phone ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
          ) : null}
        </label>

        <label className="block">
          <span className={ojLabel}>
            {f.email.replace(" *", "")}{" "}
            <span className="text-sand">{oj.requiredMark}</span>
          </span>
          <span className="relative block">
            <FieldIcon>
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h12a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-9zm1.3.5 6.2 4.3L16.2 6H3.8z" />
              </svg>
            </FieldIcon>
            <input
              className={ojField}
              type="email"
              value={value.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
            />
          </span>
          {errors.email ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
          ) : null}
        </label>

        <label className="block">
          <span className={ojLabel}>{f.city}</span>
          <span className="relative block">
            <FieldIcon>
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M10 2.5a5 5 0 0 0-5 5c0 3.7 5 9.5 5 9.5s5-5.8 5-9.5a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>
            </FieldIcon>
            <select
              className={ojSelect}
              value={value.city}
              onChange={(e) => set("city", e.target.value)}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </span>
        </label>

        <label className="block">
          <span className={ojLabel}>
            {f.operatingSector.replace(" *", "")}{" "}
            <span className="text-sand">{oj.requiredMark}</span>
          </span>
          <span className="relative block">
            <FieldIcon>
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M3 4h14v3H3V4zm0 4.5h14V17H3V8.5zm3 2v4h2v-4H6zm6 0v4h2v-4h-2z" />
              </svg>
            </FieldIcon>
            <select
              className={ojSelect}
              value={value.operatingSector}
              onChange={(e) => set("operatingSector", e.target.value)}
            >
              <option value="">{f.pickOperatingSector}</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </span>
          {errors.operatingSector ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.operatingSector}</p>
          ) : null}
        </label>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand/10 bg-[#e8f3f0] px-4 py-3 text-sm text-brand">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[0.65rem] font-bold text-ink">
          ✓
        </span>
        <p>{oj.draftHint}</p>
      </div>

      <FormNavigation
        showPrev={false}
        onSaveDraft={onSaveDraft}
        onClear={onClear}
        onNext={onNext}
        nextLabel={oj.nextLicense}
      />
    </div>
  );
}
