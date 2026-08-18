"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { FleetAircraftDraft } from "@/lib/droneCatalog";
import {
  ORG_TYPE_ENTITY,
  ORG_TYPE_INDIVIDUAL,
  type OperatorBasicInfo,
  type OperatorLicenseMeta,
} from "@/lib/operatorJoin";
import { useLocale } from "../LocaleProvider";
import { FormNavigation } from "./FormNavigation";

type Props = {
  basic: OperatorBasicInfo;
  license: OperatorLicenseMeta;
  file: File | null;
  fleet: FleetAircraftDraft[];
  agreed: boolean;
  agreeError?: string;
  submitError?: string | null;
  submitting: boolean;
  onAgreeChange: (v: boolean) => void;
  onEdit: (step: 1 | 2 | 3) => void;
  onPrev: () => void;
  onSaveDraft: () => void;
  onClear: () => void;
  onSubmit: () => void;
};

function SummaryCard({
  title,
  onEdit,
  editLabel,
  children,
}: {
  title: string;
  onEdit: () => void;
  editLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-brand/10 bg-[#f7fbfa] p-3 sm:p-3.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="font-display text-sm font-bold text-brand">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand/15 px-2.5 py-1 text-[0.7rem] font-semibold text-brand hover:bg-white"
        >
          <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden>
            <path d="M13.6 2.9a1.5 1.5 0 0 1 2.1 2.1L7.2 13.5 3.5 14.5l1-3.7L13.6 2.9z" />
          </svg>
          {editLabel}
        </button>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-brand/8 py-1.5 last:border-0">
      <dt className="text-[0.65rem] font-semibold text-brand/50">{label}</dt>
      <dd className="mt-0.5 break-words text-[0.8125rem] font-medium leading-5 text-brand">
        {value || "—"}
      </dd>
    </div>
  );
}

export function ReviewSubmitStep({
  basic,
  license,
  file,
  fleet,
  agreed,
  agreeError,
  submitError,
  submitting,
  onAgreeChange,
  onEdit,
  onPrev,
  onSaveDraft,
  onClear,
  onSubmit,
}: Props) {
  const { t } = useLocale();
  const oj = t.operatorJoin;
  const f = t.form;
  const copy = t.fleet;

  const fileLabel = file?.name || license.name || oj.noFile;
  const orgLabel =
    basic.organization === ORG_TYPE_ENTITY
      ? oj.orgEntity
      : basic.organization === ORG_TYPE_INDIVIDUAL
        ? oj.orgIndividual
        : basic.organization;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-xl font-bold text-brand">{oj.reviewTitle}</h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-brand/65">{oj.reviewBody}</p>
        </div>
        <span className="rounded-full bg-sand/20 px-2.5 py-1 text-[0.7rem] font-bold text-brand">
          {oj.stepOf(4, 4)}
        </span>
      </div>

      <div className="space-y-2.5">
        <div className="grid gap-2.5 sm:grid-cols-2 sm:items-stretch">
          <SummaryCard title={oj.reviewBasic} onEdit={() => onEdit(1)} editLabel={oj.edit}>
            <dl>
              <Row label={f.fullName.replace(" *", "")} value={basic.fullName} />
              <Row label={f.organization} value={orgLabel} />
              <Row label={f.phone.replace(" *", "")} value={`+966 ${basic.phone}`} />
              <Row label={f.email.replace(" *", "")} value={basic.email} />
              <Row label={f.city} value={basic.city} />
              <Row label={f.operatingSector.replace(" *", "")} value={basic.operatingSector} />
            </dl>
          </SummaryCard>

          <SummaryCard title={oj.reviewLicense} onEdit={() => onEdit(2)} editLabel={oj.edit}>
            <dl>
              <Row label={f.licenseLabel.replace(" *", "")} value={fileLabel} />
              <Row
                label={oj.licenseSuccess}
                value={file ? oj.licenseSuccess : license.name ? oj.reuploadLicense : oj.noFile}
              />
              <Row label={oj.licenseNumber} value={license.licenseNumber} />
              <Row label={oj.licenseExpiry} value={license.expiryDate} />
            </dl>
          </SummaryCard>
        </div>

        <SummaryCard title={oj.reviewFleet} onEdit={() => onEdit(3)} editLabel={oj.edit}>
          <p className="mb-2 text-xs font-semibold text-brand">{copy.count(fleet.length)}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {fleet.map((item, i) => {
              const name = item.isUnlisted
                ? `${item.customManufacturer} — ${item.customModel}`
                : `${item.manufacturerName} — ${item.modelName}`;
              return (
                <li
                  key={item.localId}
                  className="rounded-lg border border-brand/8 bg-white px-2.5 py-2"
                >
                  <p className="text-[0.65rem] font-bold text-sand">{copy.aircraftN(i + 1)}</p>
                  <p className="mt-0.5 text-[0.8125rem] font-semibold text-brand">{name}</p>
                  <p className="mt-0.5 text-[0.7rem] text-brand/55">
                    {[item.serialNumber, item.usageType].filter(Boolean).join(" · ") || "—"}
                  </p>
                </li>
              );
            })}
          </ul>
        </SummaryCard>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl border border-dashed border-brand/25 bg-white px-3 py-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onAgreeChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-brand/30 text-sand focus:ring-sand"
        />
        <span className="text-[0.8125rem] leading-6 text-brand">
          {oj.agreePrefix}{" "}
          <Link href="/privacy" className="font-semibold text-sand underline-offset-2 hover:underline">
            {oj.privacyPolicy}
          </Link>{" "}
          {oj.andWord}{" "}
          <Link href="/terms" className="font-semibold text-sand underline-offset-2 hover:underline">
            {oj.terms}
          </Link>
        </span>
      </label>
      {agreeError ? (
        <p className="mt-2 text-sm text-red-600">{agreeError}</p>
      ) : null}

      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-sand/35 bg-sand/10 px-3 py-2.5 text-[0.8125rem] text-brand">
        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sand text-[0.65rem] font-bold text-brand">
          i
        </span>
        <p>{oj.reviewTip}</p>
      </div>

      {submitError ? (
        <p role="alert" className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <FormNavigation
        onPrev={onPrev}
        prevLabel={oj.prevFleet}
        onSaveDraft={onSaveDraft}
        onClear={onClear}
        onNext={onSubmit}
        nextLabel={oj.submitJoin}
        nextDisabled={submitting}
        submitting={submitting}
      />
    </div>
  );
}
