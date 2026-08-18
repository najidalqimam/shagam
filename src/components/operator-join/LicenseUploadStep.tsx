"use client";

import { useRef, useState } from "react";
import {
  formatFileSize,
  type OperatorLicenseMeta,
} from "@/lib/operatorJoin";
import { useLocale } from "../LocaleProvider";
import { FormNavigation } from "./FormNavigation";
import { ojField, ojLabel } from "./styles";

const MAX_LICENSE_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
]);

type Props = {
  meta: OperatorLicenseMeta;
  file: File | null;
  needsReupload: boolean;
  error?: string;
  onMetaChange: (next: OperatorLicenseMeta) => void;
  onFileChange: (file: File | null, error?: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onClear: () => void;
};

export function LicenseUploadStep({
  meta,
  file,
  needsReupload,
  error,
  onMetaChange,
  onFileChange,
  onPrev,
  onNext,
  onSaveDraft,
  onClear,
}: Props) {
  const { t } = useLocale();
  const oj = t.operatorJoin;
  const f = t.form;
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const applyFile = (next: File | null) => {
    if (!next) {
      onFileChange(null);
      onMetaChange({ ...meta, name: "", size: 0, type: "" });
      return;
    }
    if (next.size > MAX_LICENSE_BYTES) {
      onFileChange(null, f.licenseTooLarge);
      return;
    }
    if (next.type && !ALLOWED.has(next.type)) {
      onFileChange(null, f.licenseInvalid);
      return;
    }
    onFileChange(next);
    onMetaChange({
      ...meta,
      name: next.name,
      size: next.size,
      type: next.type,
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold text-brand">{oj.licenseTitle}</h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-brand/65">{oj.licenseBody}</p>
        </div>
        <span className="rounded-full bg-sand/20 px-3 py-1.5 text-xs font-bold text-brand">
          {oj.stepOf(2, 4)}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/jpeg,image/png,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(e) => applyFile(e.target.files?.[0] ?? null)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          applyFile(e.dataTransfer.files?.[0] ?? null);
        }}
        className={`flex w-full flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed px-5 py-10 text-center transition ${
          dragOver
            ? "border-sand bg-sand/10"
            : error
              ? "border-red-400 bg-red-50"
              : "border-brand/30 bg-[#f2f7f6] hover:border-sand/70"
        }`}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-ink">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 16V7m0 0 3.5 3.5M12 7 8.5 10.5" strokeLinecap="round" />
            <path d="M5 16.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1.5" strokeLinecap="round" />
          </svg>
        </span>
        <span className="font-display text-base font-semibold text-brand">{oj.licenseDrop}</span>
        <span className="text-xs leading-5 text-brand/55">{f.licenseHint}</span>
      </button>

      {needsReupload && meta.name && !file ? (
        <p className="mt-3 rounded-xl border border-sand/40 bg-sand/10 px-3 py-2 text-sm text-brand">
          {oj.reuploadLicense} ({meta.name})
        </p>
      ) : null}

      {file ? (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-brand/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xs font-bold text-red-600">
              {file.type.includes("pdf") ? "PDF" : "IMG"}
            </span>
            <div>
              <p className="text-sm font-semibold text-brand">{file.name}</p>
              <p className="text-xs text-brand/55">{formatFileSize(file.size)}</p>
              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <span aria-hidden>✓</span> {oj.licenseSuccess}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full border border-brand/20 px-3 py-2 text-xs font-semibold text-brand"
            >
              {oj.licenseReplace}
            </button>
            <button
              type="button"
              onClick={() => applyFile(null)}
              className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
            >
              {oj.licenseDelete}
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={ojLabel}>{oj.licenseNumber}</span>
          <input
            className={`${ojField} !ps-4`}
            value={meta.licenseNumber}
            onChange={(e) => onMetaChange({ ...meta, licenseNumber: e.target.value })}
          />
        </label>
        <label className="block">
          <span className={ojLabel}>{oj.licenseExpiry}</span>
          <input
            type="date"
            className={`${ojField} !ps-4`}
            value={meta.expiryDate}
            onChange={(e) => onMetaChange({ ...meta, expiryDate: e.target.value })}
          />
        </label>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-sky-200/80 bg-sky-50 px-4 py-3 text-sm text-brand">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-600 text-[0.7rem] font-bold text-white">
          i
        </span>
        <p>{oj.licenseTip}</p>
      </div>

      <FormNavigation
        onPrev={onPrev}
        prevLabel={oj.prevBasic}
        onSaveDraft={onSaveDraft}
        onClear={onClear}
        onNext={onNext}
        nextLabel={oj.nextFleet}
      />
    </div>
  );
}
