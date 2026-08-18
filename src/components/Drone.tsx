"use client";

type DroneProps = {
  className?: string;
};

/**
 * Isometric white quadcopter with teal ring guards —
 * closer to IoT Squared’s polished product look.
 */
export function Drone({ className }: DroneProps) {
  const motors = [
    { x: -78, y: -52, alt: false },
    { x: 78, y: -52, alt: true },
    { x: -78, y: 48, alt: true },
    { x: 78, y: 48, alt: false },
  ] as const;

  return (
    <div className={`drone-rig relative ${className ?? ""}`} aria-hidden>
      <div className="pointer-events-none absolute left-1/2 top-[40%] h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(46,184,176,0.32)_0%,transparent_68%)] blur-lg" />

      <svg
        viewBox="0 0 360 300"
        className="relative z-10 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bodyTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f4f7f9" />
            <stop offset="100%" stopColor="#d5dee5" />
          </linearGradient>
          <linearGradient id="bodySide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8d3db" />
            <stop offset="100%" stopColor="#95a6b2" />
          </linearGradient>
          <linearGradient id="armMetal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f8fafb" />
            <stop offset="100%" stopColor="#aebbc4" />
          </linearGradient>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7aefe6" />
            <stop offset="45%" stopColor="#2eb8b0" />
            <stop offset="100%" stopColor="#187872" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#9eefea" />
            <stop offset="55%" stopColor="#2eb8b0" />
            <stop offset="100%" stopColor="#145e59" />
          </linearGradient>
          <radialGradient id="rotorWash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2eb8b0" stopOpacity="0.05" />
            <stop offset="60%" stopColor="#2eb8b0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2eb8b0" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="armShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#16343c" floodOpacity="0.2" />
          </filter>
        </defs>

        <g transform="translate(180 145)">
          {/* Legs */}
          <g strokeLinecap="round">
            <path d="M-24 34 L-38 58" stroke="#84949e" strokeWidth="4" />
            <path d="M24 34 L38 58" stroke="#84949e" strokeWidth="4" />
            <path d="M-46 58 H-28" stroke="#b4c0c8" strokeWidth="3.5" />
            <path d="M28 58 H46" stroke="#b4c0c8" strokeWidth="3.5" />
          </g>

          {/* Arms from body to motors */}
          {motors.map((m) => (
            <line
              key={`arm-${m.x}-${m.y}`}
              x1={m.x * 0.22}
              y1={m.y * 0.15}
              x2={m.x}
              y2={m.y}
              stroke="url(#armMetal)"
              strokeWidth="11"
              strokeLinecap="round"
              filter="url(#armShadow)"
            />
          ))}
          {motors.map((m) => (
            <line
              key={`arm-hi-${m.x}-${m.y}`}
              x1={m.x * 0.22}
              y1={m.y * 0.15 - 1}
              x2={m.x}
              y2={m.y - 1}
              stroke="#ffffff"
              strokeOpacity="0.45"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}

          {/* Motors + rings */}
          {motors.map((m) => (
            <g key={`motor-${m.x}-${m.y}`} transform={`translate(${m.x} ${m.y})`}>
              <ellipse cx="0" cy="4" rx="36" ry="14" fill="#1c3344" fillOpacity="0.08" />

              <ellipse
                cx="0"
                cy="0"
                rx="38"
                ry="22"
                fill="url(#rotorWash)"
                className={m.alt ? "drone-rotor-disc drone-rotor-disc-alt" : "drone-rotor-disc"}
              />

              <g className={m.alt ? "drone-rotor drone-rotor-alt" : "drone-rotor"}>
                <ellipse cx="0" cy="0" rx="32" ry="4.5" fill="#2eb8b0" fillOpacity="0.5" />
                <ellipse cx="0" cy="0" rx="4.5" ry="32" fill="#1a8a84" fillOpacity="0.35" />
              </g>

              <ellipse
                cx="0"
                cy="0"
                rx="38"
                ry="22"
                stroke="url(#ringGrad)"
                strokeWidth="4"
                fill="none"
                filter="url(#glow)"
              />
              <ellipse
                cx="0"
                cy="0"
                rx="38"
                ry="22"
                stroke="#ffffff"
                strokeOpacity="0.4"
                strokeWidth="1.2"
                fill="none"
              />

              {/* Hub */}
              <ellipse cx="0" cy="3" rx="11" ry="7" fill="#8e9eaa" />
              <ellipse cx="0" cy="0" rx="11" ry="7" fill="#f7fafb" />
              <ellipse cx="0" cy="0" rx="11" ry="7" stroke="#c5d0d8" strokeWidth="1" />
              <ellipse cx="0" cy="-1" rx="5" ry="3.2" fill="#2eb8b0" filter="url(#glow)" />
              <ellipse cx="-2" cy="-2.5" rx="2.2" ry="1.2" fill="#ffffff" fillOpacity="0.75" />
            </g>
          ))}

          {/* Body */}
          <g filter="url(#armShadow)">
            <path d="M-36 6 L-36 34 L0 50 L36 34 L36 6 L0 20 Z" fill="url(#bodySide)" />
            <path d="M-36 6 L0 -12 L36 6 L0 20 Z" fill="url(#bodyTop)" />
            <path d="M-36 6 L0 20 L36 6" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="1.4" />
            <path d="M0 20 L0 50" stroke="#7f919c" strokeOpacity="0.28" strokeWidth="1" />
            {/* Panel lines */}
            <path d="M-18 -1 L-10 8" stroke="#c5d0d8" strokeWidth="1" strokeOpacity="0.7" />
            <path d="M18 -1 L10 8" stroke="#c5d0d8" strokeWidth="1" strokeOpacity="0.7" />
          </g>

          {/* Canopy / sensor dome */}
          <ellipse cx="0" cy="4" rx="17" ry="11" fill="url(#glassGrad)" filter="url(#glow)" />
          <ellipse cx="-5" cy="0" rx="6" ry="3.5" fill="#ffffff" fillOpacity="0.5" />
          <ellipse cx="4" cy="6" rx="3.5" ry="2" fill="#0a3330" fillOpacity="0.3" />

          {/* LEDs */}
          <circle cx="-20" cy="10" r="2.6" fill="#2eb8b0" filter="url(#glow)" />
          <circle cx="20" cy="10" r="2.6" fill="#e85a4f" filter="url(#glow)" />

          {/* Antenna */}
          <line x1="14" y1="-8" x2="24" y2="-28" stroke="#b7c4cd" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="24" cy="-28" r="3" fill="#2eb8b0" filter="url(#glow)" />
        </g>
      </svg>
    </div>
  );
}
