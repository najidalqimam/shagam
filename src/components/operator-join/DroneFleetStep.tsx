"use client";

import {
  createEmptyAircraft,
  isAircraftComplete,
  type FleetAircraftDraft,
} from "@/lib/droneCatalog";
import { useLocale } from "../LocaleProvider";
import { DroneCard } from "./DroneCard";
import { FormNavigation } from "./FormNavigation";

type Props = {
  fleet: FleetAircraftDraft[];
  usageOptions: string[];
  error?: string;
  fieldErrors: Record<string, string>;
  onChange: (next: FleetAircraftDraft[]) => void;
  onPrev: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onClear: () => void;
};

export function DroneFleetStep({
  fleet,
  usageOptions,
  error,
  fieldErrors,
  onChange,
  onPrev,
  onNext,
  onSaveDraft,
  onClear,
}: Props) {
  const { t } = useLocale();
  const oj = t.operatorJoin;
  const copy = t.fleet;
  const count = fleet.filter(isAircraftComplete).length;

  const updateAt = (index: number, patch: Partial<FleetAircraftDraft>) => {
    onChange(fleet.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl font-bold text-brand">{oj.fleetTitle}</h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-brand/65">{oj.fleetBody}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">
            {copy.count(count)}
          </span>
          <span className="rounded-full bg-sand/20 px-3 py-1.5 text-xs font-bold text-brand">
            {oj.stepOf(3, 4)}
          </span>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-500/30 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {fleet.map((item, index) => (
          <DroneCard
            key={item.localId}
            item={item}
            index={index}
            canRemove={fleet.length > 1}
            usageOptions={usageOptions}
            fieldErrors={fieldErrors}
            onChange={(patch) => updateAt(index, patch)}
            onRemove={() => onChange(fleet.filter((_, i) => i !== index))}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...fleet, createEmptyAircraft()])}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-sand bg-sand/10 px-5 py-3.5 text-sm font-bold text-brand transition hover:bg-sand/20"
      >
        {fleet.length === 0 ? copy.add : copy.addAnother}
      </button>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-brand/10 bg-[#e8f3f0] px-4 py-3 text-sm text-brand">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[0.7rem] font-bold text-ink">
          i
        </span>
        <p>{oj.fleetTip}</p>
      </div>

      <FormNavigation
        onPrev={onPrev}
        prevLabel={oj.prevLicense}
        onSaveDraft={onSaveDraft}
        onClear={onClear}
        onNext={onNext}
        nextLabel={oj.nextReview}
      />
    </div>
  );
}
