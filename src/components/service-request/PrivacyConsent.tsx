"use client";

import Link from "next/link";
import { useLocale } from "../LocaleProvider";

type Props = {
  agreed: boolean;
  error?: string;
  onChange: (v: boolean) => void;
  compact?: boolean;
};

export function PrivacyConsent({ agreed, error, onChange, compact }: Props) {
  const { t } = useLocale();
  const sr = t.serviceRequest;

  return (
    <div className={compact ? "space-y-1.5" : "space-y-3"}>
      <label
        className={`flex cursor-pointer items-start gap-2.5 ${
          compact
            ? "rounded-xl border border-brand/12 bg-[#f7fbfa] px-3 py-2.5"
            : "rounded-2xl border border-dashed border-brand/25 bg-[#f7fbfa] px-4 py-4"
        }`}
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand/30 text-sand focus:ring-sand"
        />
        <span className={`text-brand ${compact ? "text-xs leading-5" : "text-sm leading-7"}`}>
          {sr.agreeBefore}
          <Link
            href="/privacy"
            className="font-semibold text-sand underline-offset-2 hover:underline"
          >
            {sr.privacyLink}
          </Link>
          {sr.agreeAfter}
        </span>
      </label>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {!compact ? (
        <p className="flex items-center gap-2 text-xs leading-6 text-brand/55">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden>
            <path d="M10 1.5a4 4 0 0 0-4 4V7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1V5.5a4 4 0 0 0-4-4zm-2.5 4a2.5 2.5 0 1 1 5 0V7h-5V5.5z" />
          </svg>
          {sr.lockNote}
        </p>
      ) : null}
    </div>
  );
}
