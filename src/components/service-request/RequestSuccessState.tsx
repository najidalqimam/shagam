"use client";

import Link from "next/link";
import { useLocale } from "../LocaleProvider";
import { ojBtnGhost, ojBtnPrimary, ojCard } from "../operator-join/styles";

type Props = {
  requestId?: string;
  onAnother: () => void;
};

export function RequestSuccessState({ requestId, onAnother }: Props) {
  const { t } = useLocale();
  const sr = t.serviceRequest;

  return (
    <div className={`${ojCard} mx-auto max-w-lg text-center`}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-ink">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden>
          <path d="M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 6.4-6.5 1.4 1.4-7.8 7.9z" />
        </svg>
      </div>
      <h2 className="mt-6 font-display text-2xl font-bold text-brand">{sr.successTitle}</h2>
      <p className="mt-3 text-sm leading-7 text-brand/65">{sr.successBody}</p>
      {requestId ? (
        <p className="mt-4 text-sm font-semibold text-sand">{sr.requestId(requestId)}</p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/" className={ojBtnPrimary}>
          {sr.backHome}
        </Link>
        <button type="button" onClick={onAnother} className={ojBtnGhost}>
          {sr.anotherRequest}
        </button>
      </div>
    </div>
  );
}
