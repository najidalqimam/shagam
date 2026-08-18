"use client";

import { useCallback } from "react";
import { SearchableSelect } from "../SearchableSelect";
import {
  CATALOG_RESULT_LIMIT,
  OTHER_MANUFACTURER_ID,
  getManufacturerById,
  searchManufacturers,
  searchModelsForManufacturer,
  type FleetAircraftDraft,
} from "@/lib/droneCatalog";
import { useLocale } from "../LocaleProvider";
import { ojField, ojLabel, ojSelect } from "./styles";

type Props = {
  item: FleetAircraftDraft;
  index: number;
  canRemove: boolean;
  usageOptions: string[];
  fieldErrors: Record<string, string>;
  onChange: (patch: Partial<FleetAircraftDraft>) => void;
  onRemove: () => void;
};

export function DroneCard({
  item,
  index,
  canRemove,
  usageOptions,
  fieldErrors,
  onChange,
  onRemove,
}: Props) {
  const { t } = useLocale();
  const copy = t.fleet;
  const otherLabel = copy.otherManufacturer;
  const isOther = item.isUnlisted;

  const loadManufacturers = useCallback(
    (query: string) => {
      const results = searchManufacturers(query, CATALOG_RESULT_LIMIT).map((m) => ({
        id: m.id,
        label: m.name,
      }));
      results.push({ id: OTHER_MANUFACTURER_ID, label: otherLabel });
      return results;
    },
    [otherLabel],
  );

  const manufacturerOption = isOther
    ? { id: OTHER_MANUFACTURER_ID, label: otherLabel }
    : item.manufacturerId
      ? { id: item.manufacturerId, label: item.manufacturerName }
      : null;
  const modelOption = item.modelId
    ? { id: item.modelId, label: item.modelName }
    : null;

  const loadModels = (query: string) => {
    if (!item.manufacturerId || isOther) return [];
    return searchModelsForManufacturer(
      item.manufacturerId,
      query,
      CATALOG_RESULT_LIMIT,
    ).map((m) => ({ id: m.id, label: m.name }));
  };

  const initial = (item.manufacturerName || "?").slice(0, 1).toUpperCase();

  return (
    <article className="rounded-[1.25rem] border border-brand/10 bg-white p-4 shadow-[0_8px_24px_rgba(11,74,69,0.06)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-ink">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/8 text-[0.7rem] font-bold text-brand">
              {initial}
            </span>
            <h4 className="font-display text-base font-semibold text-brand">
              {copy.aircraftN(index + 1)}
            </h4>
          </div>
        </div>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
            aria-label={copy.remove}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path d="M7.5 3h5l.5 1H16v1.5H4V4h3l.5-1zM5.5 7h9l-.7 9.2A1.5 1.5 0 0 1 12.3 17.5H7.7a1.5 1.5 0 0 1-1.5-1.3L5.5 7z" />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="space-y-4">
        <SearchableSelect
          label={copy.manufacturer}
          value={manufacturerOption}
          loadOptions={loadManufacturers}
          resultLimit={CATALOG_RESULT_LIMIT + 1}
          error={
            fieldErrors[`${item.localId}.manufacturer`] ||
            fieldErrors[`${item.localId}.customManufacturer`]
          }
          onChange={(option) => {
            if (!option) {
              onChange({
                isUnlisted: false,
                manufacturerId: "",
                manufacturerName: "",
                modelId: "",
                modelName: "",
                customManufacturer: "",
                customModel: "",
              });
              return;
            }
            if (option.id === OTHER_MANUFACTURER_ID) {
              onChange({
                isUnlisted: true,
                manufacturerId: OTHER_MANUFACTURER_ID,
                manufacturerName: otherLabel,
                modelId: "",
                modelName: "",
              });
              return;
            }
            const mfr = getManufacturerById(option.id);
            onChange({
              isUnlisted: false,
              manufacturerId: option.id,
              manufacturerName: mfr?.name ?? option.label,
              modelId: "",
              modelName: "",
              customManufacturer: "",
              customModel: "",
            });
          }}
          placeholder={copy.manufacturerPh}
          emptyMessage={copy.manufacturerEmpty}
          light
        />

        {isOther ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={ojLabel}>{copy.customManufacturer}</span>
              <input
                className={`${ojField} !ps-4`}
                value={item.customManufacturer}
                onChange={(e) => onChange({ customManufacturer: e.target.value })}
              />
              {fieldErrors[`${item.localId}.customManufacturer`] ? (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors[`${item.localId}.customManufacturer`]}
                </p>
              ) : null}
            </label>
            <label className="block">
              <span className={ojLabel}>{copy.customModel}</span>
              <input
                className={`${ojField} !ps-4`}
                value={item.customModel}
                onChange={(e) => onChange({ customModel: e.target.value })}
              />
              {fieldErrors[`${item.localId}.customModel`] ? (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors[`${item.localId}.customModel`]}
                </p>
              ) : null}
            </label>
          </div>
        ) : (
          <SearchableSelect
            label={copy.model}
            value={modelOption}
            loadOptions={loadModels}
            resultLimit={CATALOG_RESULT_LIMIT}
            disabled={!item.manufacturerId}
            error={fieldErrors[`${item.localId}.model`]}
            onChange={(option) => {
              if (!option) {
                onChange({ modelId: "", modelName: "" });
                return;
              }
              onChange({ modelId: option.id, modelName: option.label });
            }}
            placeholder={
              item.manufacturerId ? copy.modelPh : copy.modelPhDisabled
            }
            emptyMessage={copy.modelEmpty}
            light
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={ojLabel}>{copy.serialNumber}</span>
            <input
              className={`${ojField} !ps-4`}
              value={item.serialNumber}
              onChange={(e) => onChange({ serialNumber: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={ojLabel}>{copy.usageType}</span>
            <select
              className={`${ojSelect} !ps-4`}
              value={item.usageType}
              onChange={(e) => onChange({ usageType: e.target.value })}
            >
              <option value="">{copy.pickUsage}</option>
              {usageOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            {fieldErrors[`${item.localId}.usageType`] ? (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors[`${item.localId}.usageType`]}
              </p>
            ) : null}
          </label>
        </div>
      </div>
    </article>
  );
}
