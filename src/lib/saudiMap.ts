/** Project Saudi Arabia GeoJSON rings into SVG path strings. */

export type LonLat = [number, number];

export const SAUDI_BOUNDS = {
  minLon: 34.4,
  maxLon: 55.8,
  minLat: 16.2,
  maxLat: 32.3,
};

const PAD = 56;
export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 980;

export function project([lon, lat]: LonLat): [number, number] {
  const { minLon, maxLon, minLat, maxLat } = SAUDI_BOUNDS;
  const x =
    PAD +
    ((lon - minLon) / (maxLon - minLon)) * (MAP_WIDTH - PAD * 2);
  // SVG y grows downward; north (higher lat) should be on top
  const y =
    PAD +
    ((maxLat - lat) / (maxLat - minLat)) * (MAP_HEIGHT - PAD * 2);
  return [x, y];
}

export function ringToPath(ring: LonLat[]): string {
  if (!ring.length) return "";
  return ring
    .map((pt, i) => {
      const [x, y] = project(pt);
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ")
    .concat(" Z");
}

export function geometryToPaths(geometry: {
  type: string;
  coordinates: unknown;
}): string[] {
  const paths: string[] = [];

  if (geometry.type === "Polygon") {
    for (const ring of geometry.coordinates as LonLat[][]) {
      paths.push(ringToPath(ring));
    }
  } else if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates as LonLat[][][]) {
      for (const ring of polygon) {
        paths.push(ringToPath(ring));
      }
    }
  }

  return paths.filter(Boolean);
}

/** Cities shown on the scroll story map (mission waypoints). */
export const STORY_CITIES = [
  { id: "jeddah", nameAr: "جدة", nameEn: "Jeddah", lon: 39.1925, lat: 21.4858 },
  { id: "riyadh", nameAr: "الرياض", nameEn: "Riyadh", lon: 46.6753, lat: 24.7136 },
  { id: "tabuk", nameAr: "تبوك", nameEn: "Tabuk", lon: 36.5559, lat: 28.3838 },
  { id: "abha", nameAr: "أبها", nameEn: "Abha", lon: 42.5053, lat: 18.2164 },
] as const;

export type StoryCity = {
  id: string;
  nameAr: string;
  nameEn: string;
  lon: number;
  lat: number;
  x: number;
  y: number;
};

export function getStoryCities(): StoryCity[] {
  return STORY_CITIES.map((c) => {
    const [x, y] = project([c.lon, c.lat]);
    return { ...c, x, y };
  });
}

/** Smooth quadratic path through projected city points (SVG viewBox space). */
export function buildStoryFlightPath(cities = getStoryCities()): string {
  if (cities.length < 2) return "";
  const pts = cities.map((c) => [c.x, c.y] as [number, number]);
  const [first, ...rest] = pts;
  let d = `M ${first[0].toFixed(2)} ${first[1].toFixed(2)}`;

  for (let i = 0; i < rest.length; i++) {
    const prev = i === 0 ? first : rest[i - 1];
    const curr = rest[i];
    const mx = (prev[0] + curr[0]) / 2;
    const my = (prev[1] + curr[1]) / 2;
    const dx = curr[0] - prev[0];
    const dy = curr[1] - prev[1];
    const len = Math.hypot(dx, dy) || 1;
    const side = i % 2 === 0 ? 1 : -1;
    const ox = (-dy / len) * len * 0.22 * side;
    const oy = (dx / len) * len * 0.22 * side;
    d += ` Q ${(mx + ox).toFixed(2)} ${(my + oy).toFixed(2)} ${curr[0].toFixed(2)} ${curr[1].toFixed(2)}`;
  }

  return d;
}

export const CITIES_GEO = [
  { id: "riyadh", nameAr: "الرياض", nameEn: "Riyadh", lon: 46.6753, lat: 24.7136 },
  { id: "jeddah", nameAr: "جدة", nameEn: "Jeddah", lon: 39.1925, lat: 21.4858 },
  { id: "dammam", nameAr: "الدمام", nameEn: "Dammam", lon: 50.1033, lat: 26.4207 },
  { id: "makkah", nameAr: "مكة", nameEn: "Makkah", lon: 39.8579, lat: 21.3891 },
  { id: "madinah", nameAr: "المدينة", nameEn: "Madinah", lon: 39.5692, lat: 24.5247 },
  { id: "abha", nameAr: "أبها", nameEn: "Abha", lon: 42.5053, lat: 18.2164 },
  { id: "tabuk", nameAr: "تبوك", nameEn: "Tabuk", lon: 36.5559, lat: 28.3838 },
  { id: "hail", nameAr: "حائل", nameEn: "Hail", lon: 41.69, lat: 27.5114 },
  { id: "najran", nameAr: "نجران", nameEn: "Najran", lon: 44.1277, lat: 17.565 },
  { id: "khobar", nameAr: "الخبر", nameEn: "Khobar", lon: 50.1971, lat: 26.2172 },
] as const;
