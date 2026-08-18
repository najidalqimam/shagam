"use client";

import { useCallback, useMemo } from "react";
import { SearchableSelect } from "./SearchableSelect";
import {
  CATALOG_RESULT_LIMIT,
  OTHER_MANUFACTURER_ID,
  createEmptyAircraft,
  getManufacturerById,
  isAircraftComplete,
  searchManufacturers,
  searchModelsForManufacturer,
  type FleetAircraftDraft,
} from "@/lib/droneCatalog";
import { useLocale } from "./LocaleProvider";

type OperatorFleetFieldsProps = {
  value: FleetAircraftDraft[];
  onChange: (next: FleetAircraftDraft[]) => void;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const fieldClass =
  "w-full rounded-xl border border-[#07564F]/15 bg-[#F2F8F6] px-4 py-3.5 text-[#07564F] outline-none transition placeholder:text-[#07564F]/40 focus:border-[#D3A74D] focus:bg-white focus:ring-2 focus:ring-[#D3A74D]/25";

export function OperatorFleetFields({
  value,
  onChange,
  error,
  fieldErrors = {},
}: OperatorFleetFieldsProps) {
  const { t } = useLocale();
  const copy = t.fleet;
  const otherLabel = copy.otherManufacturer;

  const fleetCount = useMemo(
    () => value.filter(isAircraftComplete).length,
    [value],
  );

  const loadManufacturers = useCallback(
    (query: string) => {
      const results = searchManufacturers(query, CATALOG_RESULT_LIMIT).map(
        (m) => ({
          id: m.id,
          label: m.name,
        }),
      );
      results.push({ id: OTHER_MANUFACTURER_ID, label: otherLabel });
      return results;
    },
    [otherLabel],
  );

  const updateAt = (index: number, patch: Partial<FleetAircraftDraft>) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const addAircraft = () => {
    onChange([...value, createEmptyAircraft()]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-2xl border border-[#D3A74D]/35 bg-[#FFF9EF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-[#4d6f6a]">{copy.intro}</p>
        <p className="shrink-0 text-sm font-semibold text-[#07564F]">
          {copy.count(fleetCount)}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-500/30 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="space-y-4">
        {value.map((item, index) => {
          const isOther = item.isUnlisted;
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

          return (
            <article
              key={item.localId}
              className="rounded-2xl border border-[#07564F]/12 bg-white p-4 shadow-[0_8px_24px_rgba(7,86,79,0.06)] sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#07564F] text-xs font-bold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h4 className="font-display text-base font-semibold text-[#07564F]">
                    {copy.aircraftN(index + 1)}
                  </h4>
                </div>
                {value.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAt(index)}
                    className="rounded-full border border-[#07564F]/15 px-3 py-1.5 text-xs text-[#4d6f6a] transition hover:border-red-400 hover:text-red-700"
                  >
                    {copy.remove}
                  </button>
                )}
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
                      updateAt(index, {
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
                      updateAt(index, {
                        isUnlisted: true,
                        manufacturerId: OTHER_MANUFACTURER_ID,
                        manufacturerName: otherLabel,
                        modelId: "",
                        modelName: "",
                        customManufacturer: item.customManufacturer,
                        customModel: item.customModel,
                      });
                      return;
                    }
                    const mfr = getManufacturerById(option.id);
                    updateAt(index, {
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
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-medium text-[#07564F]">
                        {copy.customManufacturer}
                      </span>
                      <input
                        value={item.customManufacturer}
                        onChange={(e) =>
                          updateAt(index, {
                            customManufacturer: e.target.value,
                          })
                        }
                        className={fieldClass}
                        placeholder={copy.customManufacturerPh}
                      />
                      {fieldErrors[`${item.localId}.customManufacturer`] && (
                        <p className="text-xs text-red-600">
                          {fieldErrors[`${item.localId}.customManufacturer`]}
                        </p>
                      )}
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      <span className="font-medium text-[#07564F]">
                        {copy.customModel}
                      </span>
                      <input
                        value={item.customModel}
                        onChange={(e) =>
                          updateAt(index, { customModel: e.target.value })
                        }
                        className={fieldClass}
                        placeholder={copy.customModelPh}
                      />
                      {fieldErrors[`${item.localId}.customModel`] && (
                        <p className="text-xs text-red-600">
                          {fieldErrors[`${item.localId}.customModel`]}
                        </p>
                      )}
                    </label>
                    <p className="sm:col-span-2 text-xs leading-6 text-[#4d6f6a]">
                      {copy.reviewNote}
                    </p>
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
                        updateAt(index, { modelId: "", modelName: "" });
                        return;
                      }
                      updateAt(index, {
                        modelId: option.id,
                        modelName: option.label,
                      });
                    }}
                    placeholder={
                      item.manufacturerId ? copy.modelPh : copy.modelPhDisabled
                    }
                    emptyMessage={copy.modelEmpty}
                    light
                  />
                )}
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addAircraft}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-[#D3A74D] bg-[#FFF9EF] px-5 py-3 text-sm font-semibold text-[#07564F] transition hover:bg-[#D3A74D]/15 sm:w-auto"
      >
        <span aria-hidden>+</span>
        {value.length === 0 ? copy.add : copy.addAnother}
      </button>
    </div>
  );
}
