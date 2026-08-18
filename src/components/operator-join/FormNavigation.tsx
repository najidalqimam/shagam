"use client";

import Link from "next/link";
import { useLocale } from "../LocaleProvider";
import { ojBtnGhost, ojBtnPrimary } from "./styles";

type FormNavigationProps = {
  onPrev?: () => void;
  onNext?: () => void;
  onSaveDraft: () => void;
  onClear?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  nextType?: "button" | "submit";
  nextDisabled?: boolean;
  submitting?: boolean;
  showPrev?: boolean;
};

export function FormNavigation({
  onPrev,
  onNext,
  onSaveDraft,
  onClear,
  prevLabel,
  nextLabel,
  nextType = "button",
  nextDisabled,
  submitting,
  showPrev = true,
}: FormNavigationProps) {
  const { t } = useLocale();
  const oj = t.operatorJoin;

  return (
    <div className="mt-6 space-y-3 border-t border-brand/10 pt-4">
      <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          {showPrev && onPrev && prevLabel ? (
            <button type="button" onClick={onPrev} className={`${ojBtnGhost} w-full sm:w-auto`}>
              <span aria-hidden>→</span>
              {prevLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onSaveDraft}
            className={`${ojBtnGhost} w-full sm:w-auto`}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M5 2h8l3 3v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 2v5h6V4H6zm0 7v4h8v-4H6z" />
            </svg>
            {oj.saveDraft}
          </button>
          {onClear ? (
            <button
              type="button"
              onClick={onClear}
              className={`${ojBtnGhost} w-full sm:w-auto`}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M6.5 3h7l.5 1.5H17v1.5H3V4.5h3l.5-1.5zM5 7h10l-.7 9.2A1.5 1.5 0 0 1 12.8 17.5H7.2A1.5 1.5 0 0 1 5.7 16.2L5 7zm3 2v6h1.5V9H8zm3.5 0v6H13V9h-1.5z" />
              </svg>
              {oj.clearFields}
            </button>
          ) : null}
        </div>
        {nextLabel ? (
          <button
            type={nextType}
            onClick={nextType === "button" ? onNext : undefined}
            disabled={nextDisabled || submitting}
            className={`${ojBtnPrimary} w-full sm:ms-auto sm:w-auto sm:min-w-[14rem]`}
          >
            {submitting ? t.form.submitting : nextLabel}
            {!submitting ? <span aria-hidden>←</span> : null}
          </button>
        ) : null}
      </div>
      <p className="flex items-center justify-center gap-2 text-center text-xs leading-6 text-brand/55">
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden>
          <path d="M10 1.5a4 4 0 0 0-4 4V7H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1V5.5a4 4 0 0 0-4-4zm-2.5 4a2.5 2.5 0 1 1 5 0V7h-5V5.5z" />
        </svg>
        {t.form.privacy}
      </p>
      <p className="text-center text-[0.7rem] text-brand/40">
        <Link href="/privacy" className="underline-offset-2 hover:underline">
          {oj.privacyPolicy}
        </Link>
        {" · "}
        <Link href="/terms" className="underline-offset-2 hover:underline">
          {oj.terms}
        </Link>
      </p>
    </div>
  );
}
