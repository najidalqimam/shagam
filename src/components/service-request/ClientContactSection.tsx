"use client";

import type { ReactNode, RefObject } from "react";
import { SearchableSelect } from "../SearchableSelect";
import { useLocale } from "../LocaleProvider";
import { srField, srLabel } from "../operator-join/styles";

export type ContactFields = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
};

type Props = {
  value: ContactFields;
  cities: string[];
  errors: Partial<Record<keyof ContactFields, string>>;
  fieldRefs: Partial<Record<keyof ContactFields, RefObject<HTMLInputElement | HTMLSelectElement | null>>>;
  onChange: (next: ContactFields) => void;
};

function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute start-3 top-1/2 z-[1] -translate-y-1/2 text-brand/45">
      {children}
    </span>
  );
}

export function ClientContactSection({
  value,
  cities,
  errors,
  fieldRefs,
  onChange,
}: Props) {
  const { t } = useLocale();
  const sr = t.serviceRequest;
  const f = t.form;

  const set = <K extends keyof ContactFields>(key: K, v: ContactFields[K]) =>
    onChange({ ...value, [key]: v });

  const cityOption = value.city ? { id: value.city, label: value.city } : null;

  return (
    <section>
      <h3 className="font-display text-xl font-bold text-brand">{sr.contactTitle}</h3>
      <p className="mt-2 text-sm leading-7 text-brand/65">{sr.contactBody}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={srLabel}>
            {f.fullName.replace(" *", "")}{" "}
            <span className="text-sand">{sr.requiredMark}</span>
          </span>
          <span className="relative block">
            <FieldIcon>
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1.5c-3.3 0-6 2-6 4.5V17h12v-1c0-2.5-2.7-4.5-6-4.5z" />
              </svg>
            </FieldIcon>
            <input
              ref={fieldRefs.fullName as RefObject<HTMLInputElement>}
              className={srField}
              value={value.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              autoComplete="name"
            />
          </span>
          {errors.fullName ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.fullName}</p>
          ) : null}
        </label>

        <div>
          <SearchableSelect
            label={f.city}
            value={cityOption}
            loadOptions={(query) =>
              cities
                .filter((c) =>
                  c.toLowerCase().includes(query.trim().toLowerCase()),
                )
                .map((c) => ({ id: c, label: c }))
            }
            onChange={(option) => set("city", option?.label ?? "")}
            placeholder={f.city}
            emptyMessage="—"
            light
            compact
          />
        </div>

        <label className="block">
          <span className={srLabel}>
            {f.phone.replace(" *", "")}{" "}
            <span className="text-sand">{sr.requiredMark}</span>
          </span>
          <span className="relative flex">
            <span className="absolute start-0 top-0 z-[1] flex h-10 w-16 items-center justify-center rounded-s-xl border border-brand/15 bg-brand/5 text-xs font-bold text-brand">
              +966
            </span>
            <span className="pointer-events-none absolute start-[4.6rem] top-1/2 z-[1] -translate-y-1/2 text-brand/45">
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M4.5 3.5h3l1.2 3.2-1.5 1.5a10.5 10.5 0 0 0 4.6 4.6l1.5-1.5 3.2 1.2v3a1.5 1.5 0 0 1-1.5 1.5A13.5 13.5 0 0 1 3 5a1.5 1.5 0 0 1 1.5-1.5z" />
              </svg>
            </span>
            <input
              ref={fieldRefs.phone as RefObject<HTMLInputElement>}
              className={`${srField} ps-[5.8rem]`}
              value={value.phone}
              onChange={(e) => set("phone", e.target.value.replace(/[^\d]/g, ""))}
              inputMode="numeric"
              placeholder="5xxxxxxxx"
              autoComplete="tel-national"
            />
          </span>
          {errors.phone ? (
            <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
          ) : null}
        </label>

        <label className="block">
          <span className={srLabel}>
            {f.email.replace(" *", "")}{" "}
            <span className="text-sand">{sr.requiredMark}</span>
          </span>
          <span className="relative block">
            <FieldIcon>
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h12a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-9zm1.3.5 6.2 4.3L16.2 6H3.8z" />
              </svg>
            </FieldIcon>
            <input
              ref={fieldRefs.email as RefObject<HTMLInputElement>}
              className={srField}
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
      </div>
    </section>
  );
}
