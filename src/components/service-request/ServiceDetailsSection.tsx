"use client";

import Link from "next/link";
import type { RefObject } from "react";
import { useLocale } from "../LocaleProvider";
import { srLabel, srSelect } from "../operator-join/styles";
import { PrivacyConsent } from "./PrivacyConsent";

type Props = {
  service: string;
  notes: string;
  serviceOptions: string[];
  serviceError?: string;
  serviceRef?: RefObject<HTMLSelectElement | null>;
  onServiceChange: (v: string) => void;
  onNotesChange: (v: string) => void;
  agreed: boolean;
  agreeError?: string;
  onAgreeChange: (v: boolean) => void;
};

export function ServiceDetailsSection({
  service,
  notes,
  serviceOptions,
  serviceError,
  serviceRef,
  onServiceChange,
  onNotesChange,
  agreed,
  agreeError,
  onAgreeChange,
}: Props) {
  const { t } = useLocale();
  const sr = t.serviceRequest;
  const f = t.form;

  return (
    <section className="border-t border-brand/10 pt-6">
      <h3 className="font-display text-xl font-bold text-brand">{sr.detailsTitle}</h3>
      <p className="mt-1.5 text-sm leading-7 text-brand/65">{sr.detailsBody}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:items-start">
        <div className="space-y-3">
          <label className="block">
            <span className={srLabel}>
              {f.service.replace(" *", "")}{" "}
              <span className="text-sand">{sr.requiredMark}</span>
            </span>
            <select
              ref={serviceRef}
              className={srSelect}
              value={service}
              onChange={(e) => onServiceChange(e.target.value)}
            >
              <option value="">{f.pickService}</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {serviceError ? (
              <p className="mt-1.5 text-xs text-red-600">{serviceError}</p>
            ) : null}
          </label>

          <PrivacyConsent
            agreed={agreed}
            error={agreeError}
            onChange={onAgreeChange}
            compact
          />
        </div>

        <label className="block">
          <span className={srLabel}>{sr.missionDetails}</span>
          <textarea
            rows={3}
            className="min-h-[5.5rem] w-full resize-y rounded-xl border border-brand/15 bg-[#f2f7f6] px-3.5 py-2.5 text-sm text-brand outline-none transition placeholder:text-brand/35 focus:border-sand focus:bg-white focus:ring-2 focus:ring-sand/25"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={sr.missionHint}
          />
        </label>
      </div>
    </section>
  );
}
