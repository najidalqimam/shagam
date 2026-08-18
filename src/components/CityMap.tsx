"use client";

type CityMapProps = {
  className?: string;
};

/** Stylized aerial city plan — IoT Squared–style backdrop for the drone. */
export function CityMap({ className }: CityMapProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="mapFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8f2f4" stopOpacity="0" />
          <stop offset="35%" stopColor="#d5e8ec" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c5dde3" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="blockA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9ec5ce" />
          <stop offset="100%" stopColor="#7aadb8" />
        </linearGradient>
        <linearGradient id="blockB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b7d4db" />
          <stop offset="100%" stopColor="#8fb8c2" />
        </linearGradient>
        <linearGradient id="accentBlock" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2eb8b0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1a8a84" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <rect width="1200" height="800" fill="url(#mapFade)" />

      {/* Road grid */}
      {Array.from({ length: 18 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="40"
          y1={80 + i * 38}
          x2="1160"
          y2={80 + i * 38}
          stroke="#9eb8c0"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 22 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={60 + i * 50}
          y1="60"
          x2={60 + i * 50}
          y2="760"
          stroke="#9eb8c0"
          strokeOpacity="0.28"
          strokeWidth="1"
        />
      ))}

      {/* Arterial roads */}
      <path
        d="M80 420 C 280 400, 420 480, 620 440 S 980 360, 1120 400"
        stroke="#7a9aa3"
        strokeOpacity="0.45"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M320 100 C 340 260, 300 420, 360 700"
        stroke="#7a9aa3"
        strokeOpacity="0.35"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M780 80 C 760 280, 820 460, 790 740"
        stroke="#7a9aa3"
        strokeOpacity="0.32"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Building blocks */}
      <g opacity="0.75">
        <rect x="120" y="140" width="70" height="48" rx="2" fill="url(#blockA)" />
        <rect x="210" y="160" width="52" height="90" rx="2" fill="url(#blockB)" />
        <rect x="280" y="130" width="88" height="40" rx="2" fill="url(#blockA)" />
        <rect x="150" y="250" width="110" height="56" rx="2" fill="url(#blockB)" />
        <rect x="400" y="180" width="64" height="120" rx="2" fill="url(#accentBlock)" />
        <rect x="490" y="200" width="96" height="44" rx="2" fill="url(#blockA)" />
        <rect x="520" y="270" width="48" height="78" rx="2" fill="url(#blockB)" />
        <rect x="610" y="150" width="130" height="52" rx="2" fill="url(#blockA)" />
        <rect x="760" y="170" width="58" height="100" rx="2" fill="url(#blockB)" />
        <rect x="840" y="140" width="90" height="42" rx="2" fill="url(#accentBlock)" />
        <rect x="950" y="190" width="70" height="86" rx="2" fill="url(#blockA)" />

        <rect x="180" y="480" width="100" height="50" rx="2" fill="url(#blockB)" />
        <rect x="300" y="520" width="60" height="110" rx="2" fill="url(#blockA)" />
        <rect x="390" y="500" width="120" height="46" rx="2" fill="url(#accentBlock)" />
        <rect x="540" y="540" width="72" height="88" rx="2" fill="url(#blockB)" />
        <rect x="640" y="490" width="110" height="54" rx="2" fill="url(#blockA)" />
        <rect x="780" y="530" width="56" height="96" rx="2" fill="url(#blockB)" />
        <rect x="860" y="500" width="130" height="48" rx="2" fill="url(#blockA)" />
        <rect x="1010" y="540" width="66" height="78" rx="2" fill="url(#accentBlock)" />

        <rect x="430" y="340" width="80" height="60" rx="2" fill="url(#blockA)" />
        <rect x="680" y="320" width="95" height="42" rx="2" fill="url(#blockB)" />
        <rect x="900" y="360" width="55" height="70" rx="2" fill="url(#blockA)" />
      </g>

      {/* Soft district washes */}
      <ellipse cx="480" cy="360" rx="180" ry="90" fill="#2eb8b0" fillOpacity="0.06" />
      <ellipse cx="860" cy="480" rx="140" ry="70" fill="#1a8a84" fillOpacity="0.05" />
    </svg>
  );
}
