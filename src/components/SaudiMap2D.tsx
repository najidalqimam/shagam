"use client";

import {
  buildStoryFlightPath,
  geometryToPaths,
  getStoryCities,
  MAP_HEIGHT,
  MAP_WIDTH,
} from "@/lib/saudiMap";
import { DroneIcon } from "./DroneIcon";
import { useLocale } from "./LocaleProvider";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type { MutableRefObject } from "react";

export type SaudiMap2DHandle = {
  setProgress: (progress: number) => void;
};

type SaudiMap2DProps = {
  progressRef: MutableRefObject<number>;
  stageIndex?: number;
  reducedMotion?: boolean;
};

type GeoFeatureCollection = {
  features: Array<{
    geometry: {
      type: string;
      coordinates: unknown;
    };
  }>;
};

function buildDotGrid(): string {
  const dots: string[] = [];
  const step = 36;
  for (let y = 60; y < MAP_HEIGHT - 40; y += step) {
    for (let x = 60; x < MAP_WIDTH - 40; x += step) {
      dots.push(`M ${x} ${y} l 0.01 0`);
    }
  }
  return dots.join(" ");
}

export const SaudiMap2D = forwardRef<SaudiMap2DHandle, SaudiMap2DProps>(
  function SaudiMap2D(
    { progressRef, stageIndex = 0, reducedMotion = false },
    ref,
  ) {
    const { locale, t } = useLocale();
    const [paths, setPaths] = useState<string[]>([]);
    const [inView, setInView] = useState(true);
    const rootRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const traveledRef = useRef<SVGPathElement>(null);
    const droneRef = useRef<HTMLDivElement>(null);
    const lastP = useRef(-1);
    const pathLen = useRef(0);

    const cities = useMemo(() => getStoryCities(), []);
    const flightD = useMemo(() => buildStoryFlightPath(cities), [cities]);
    const dotGrid = useMemo(() => buildDotGrid(), []);
    const cityLabel = (city: (typeof cities)[number]) =>
      locale === "en" ? city.nameEn : city.nameAr;

    const measurePath = useCallback(() => {
      const path = pathRef.current;
      if (!path) return 0;
      const len = path.getTotalLength();
      pathLen.current = len;
      return len;
    }, []);

    const apply = useCallback(
      (p: number) => {
        const clamped = Math.min(1, Math.max(0, p));
        if (Math.abs(clamped - lastP.current) < 0.0008) return;

        const pathEl = pathRef.current;
        const drone = droneRef.current;
        if (!pathEl || !drone) return;

        let len = pathLen.current;
        if (len <= 1) len = measurePath();
        if (len <= 1) return;

        if (traveledRef.current) {
          traveledRef.current.style.strokeDasharray = `${len}`;
          traveledRef.current.style.strokeDashoffset = `${len * (1 - clamped)}`;
        }

        const dist = clamped * len;
        const pt = pathEl.getPointAtLength(dist);
        const lookAt = Math.min(len, dist + Math.max(2, len * 0.01));
        const look = pathEl.getPointAtLength(lookAt);
        const angle =
          (Math.atan2(look.y - pt.y, look.x - pt.x) * 180) / Math.PI;
        const lean = Math.max(-28, Math.min(28, angle * 0.22));

        drone.style.left = `${(pt.x / MAP_WIDTH) * 100}%`;
        drone.style.top = `${(pt.y / MAP_HEIGHT) * 100}%`;
        drone.style.transform = `translate3d(-50%, -50%, 0) rotate(${lean}deg)`;
        lastP.current = clamped;
      },
      [measurePath],
    );

    useImperativeHandle(ref, () => ({ setProgress: apply }), [apply]);

    useEffect(() => {
      let alive = true;
      fetch("/saudi.geojson")
        .then((r) => r.json())
        .then((data: GeoFeatureCollection) => {
          if (!alive) return;
          const geometry = data.features[0]?.geometry;
          if (geometry) setPaths(geometryToPaths(geometry));
        })
        .catch(() => undefined);
      return () => {
        alive = false;
      };
    }, []);

    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { threshold: 0.05, rootMargin: "80px 0px" },
      );
      io.observe(el);
      return () => io.disconnect();
    }, []);

    useEffect(() => {
      const id = requestAnimationFrame(() => {
        measurePath();
        apply(progressRef.current);
      });
      return () => cancelAnimationFrame(id);
    }, [flightD, paths, apply, measurePath, progressRef]);

    // Apply only when ScrollTrigger pushes progress — no idle rAF poll.

    const activeCity = Math.min(cities.length - 1, Math.max(0, stageIndex));

    return (
      <div
        ref={rootRef}
        className="relative flex h-full w-full items-center justify-center overflow-hidden"
      >
        <div
          className="relative w-full"
          style={{
            maxWidth: "min(100%, 560px)",
            aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}`,
          }}
        >
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={t.mapAria}
          >
            <defs>
              <clipPath id="ksaClip">
                {paths.map((d, i) => (
                  <path key={`clip-${i}`} d={d} />
                ))}
              </clipPath>
              <radialGradient id="ksaSoftFill" cx="50%" cy="45%" r="65%">
                <stop offset="0%" stopColor="rgba(7,86,79,0.07)" />
                <stop offset="100%" stopColor="rgba(7,86,79,0.02)" />
              </radialGradient>
            </defs>

            {paths.map((d, i) => (
              <path
                key={`fill-${i}`}
                d={d}
                fill="url(#ksaSoftFill)"
                stroke="none"
              />
            ))}

            <g clipPath="url(#ksaClip)" opacity="0.28">
              <path
                d={dotGrid}
                stroke="rgba(7,86,79,0.35)"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            <g clipPath="url(#ksaClip)" opacity="0.14">
              <path
                d={`M 120 220 Q 380 180 620 260 T 880 300 M 160 380 Q 420 340 680 420 T 900 480 M 200 560 Q 460 520 700 600 T 880 680`}
                fill="none"
                stroke="#07564F"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {paths.map((d, i) => (
              <path
                key={`stroke-${i}`}
                d={d}
                fill="none"
                stroke="#07564F"
                strokeWidth="2.4"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ))}

            <path
              d={flightD}
              fill="none"
              stroke="rgba(7,86,79,0.22)"
              strokeWidth="2.6"
              strokeDasharray="7 9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              ref={traveledRef}
              d={flightD}
              fill="none"
              stroke="#07564F"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />

            <path
              ref={pathRef}
              d={flightD}
              fill="none"
              stroke="rgba(7,86,79,0.001)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {cities.map((city, i) => {
              const active = i === activeCity;
              return (
                <g key={city.id} transform={`translate(${city.x} ${city.y})`}>
                  {active && !reducedMotion && (
                    <circle
                      r="10"
                      fill="#D9A52E"
                      className={inView ? "map-city-pulse" : undefined}
                    />
                  )}
                  {active && (
                    <circle
                      r="14"
                      fill="none"
                      stroke="rgba(217,165,46,0.45)"
                      strokeWidth="1.5"
                    />
                  )}
                  <circle
                    r={active ? 5.5 : 4}
                    fill={active ? "#D9A52E" : "#07564F"}
                  />
                  <text
                    y="-16"
                    textAnchor="middle"
                    fill={active ? "#07564F" : "rgba(7,86,79,0.72)"}
                    fontSize="15"
                    fontFamily="IBM Plex Sans, IBM Plex Sans Arabic, sans-serif"
                    fontWeight={active ? 700 : 600}
                  >
                    {cityLabel(city)}
                  </text>
                </g>
              );
            })}
          </svg>

          <div
            ref={droneRef}
            className="pointer-events-none absolute z-10"
            style={{
              left: `${(cities[0].x / MAP_WIDTH) * 100}%`,
              top: `${(cities[0].y / MAP_HEIGHT) * 100}%`,
              width: "min(104px, 19%)",
              height: "min(104px, 19%)",
              transform: "translate3d(-50%, -50%, 0)",
            }}
          >
            <DroneIcon
              animate={inView && !reducedMotion}
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    );
  },
);
