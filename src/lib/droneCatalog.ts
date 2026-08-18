import catalogJson from "@/data/droneCatalog.json";

export type DroneModelRef = {
  id: string;
  name: string;
};

export type ManufacturerRef = {
  id: string;
  name: string;
  models: DroneModelRef[];
};

export type DroneCatalog = {
  version: number;
  generatedAt: string;
  source: string;
  manufacturers: ManufacturerRef[];
};

export const droneCatalog = catalogJson as DroneCatalog;

export function normalizeCatalogQuery(value: string): string {
  return value
    .replace(/\u00a0/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .normalize("NFKC");
}

export function matchesQuery(name: string, query: string): boolean {
  const q = normalizeCatalogQuery(query);
  if (!q) return true;
  return normalizeCatalogQuery(name).includes(q);
}

/** Cap results for combobox performance. */
export const CATALOG_RESULT_LIMIT = 50;

/** Sentinel id for "Other" manufacturer — free-text company + model. */
export const OTHER_MANUFACTURER_ID = "__other__";

export function searchManufacturers(
  query: string,
  limit = CATALOG_RESULT_LIMIT,
): ManufacturerRef[] {
  const results: ManufacturerRef[] = [];
  for (const mfr of droneCatalog.manufacturers) {
    if (!matchesQuery(mfr.name, query)) continue;
    results.push(mfr);
    if (results.length >= limit) break;
  }
  return results;
}

export function getManufacturerById(id: string): ManufacturerRef | undefined {
  return droneCatalog.manufacturers.find((m) => m.id === id);
}

export function searchModelsForManufacturer(
  manufacturerId: string,
  query: string,
  limit = CATALOG_RESULT_LIMIT,
): DroneModelRef[] {
  const mfr = getManufacturerById(manufacturerId);
  if (!mfr) return [];
  const results: DroneModelRef[] = [];
  for (const model of mfr.models) {
    if (!matchesQuery(model.name, query)) continue;
    results.push(model);
    if (results.length >= limit) break;
  }
  return results;
}

export function modelBelongsToManufacturer(
  manufacturerId: string,
  modelId: string,
): boolean {
  const mfr = getManufacturerById(manufacturerId);
  return !!mfr?.models.some((m) => m.id === modelId);
}

export type FleetAircraftDraft = {
  localId: string;
  manufacturerId: string;
  modelId: string;
  manufacturerName: string;
  modelName: string;
  isUnlisted: boolean;
  customManufacturer: string;
  customModel: string;
  serialNumber: string;
  usageType: string;
};

export function createEmptyAircraft(): FleetAircraftDraft {
  return {
    localId: `ac_${Math.random().toString(36).slice(2, 10)}`,
    manufacturerId: "",
    modelId: "",
    manufacturerName: "",
    modelName: "",
    isUnlisted: false,
    customManufacturer: "",
    customModel: "",
    serialNumber: "",
    usageType: "",
  };
}

export function isAircraftComplete(item: FleetAircraftDraft): boolean {
  if (item.isUnlisted) {
    return (
      item.customManufacturer.trim().length > 0 &&
      item.customModel.trim().length > 0
    );
  }
  return (
    !!item.manufacturerId &&
    !!item.modelId &&
    modelBelongsToManufacturer(item.manufacturerId, item.modelId)
  );
}

export type FleetAircraftPayload =
  | {
      isUnlistedAircraft: false;
      manufacturerId: string;
      modelId: string;
      manufacturerName: string;
      modelName: string;
      serialNumber?: string;
      usageType?: string;
    }
  | {
      isUnlistedAircraft: true;
      manufacturerName: string;
      modelName: string;
      serialNumber?: string;
      usageType?: string;
    };

export function buildFleetPayload(items: FleetAircraftDraft[]): {
  fleetCount: number;
  aircraftCount: number;
  aircraft: FleetAircraftPayload[];
} {
  const aircraft: FleetAircraftPayload[] = items
    .filter(isAircraftComplete)
    .map((item) => {
      const extras = {
        ...(item.serialNumber.trim()
          ? { serialNumber: item.serialNumber.trim() }
          : {}),
        ...(item.usageType.trim() ? { usageType: item.usageType.trim() } : {}),
      };
      if (item.isUnlisted) {
        return {
          isUnlistedAircraft: true as const,
          manufacturerName: item.customManufacturer.trim(),
          modelName: item.customModel.trim(),
          ...extras,
        };
      }
      return {
        isUnlistedAircraft: false as const,
        manufacturerId: item.manufacturerId,
        modelId: item.modelId,
        manufacturerName: item.manufacturerName,
        modelName: item.modelName,
        ...extras,
      };
    });

  return {
    fleetCount: aircraft.length,
    aircraftCount: aircraft.length,
    aircraft,
  };
}
