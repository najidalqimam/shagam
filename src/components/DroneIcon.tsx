"use client";

type DroneIconProps = {
  className?: string;
  /** Pause continuous bob when section is off-screen. */
  animate?: boolean;
};

/** Lightweight SVG drone — position/rotation owned by parent. */
export function DroneIcon({ className, animate = true }: DroneIconProps) {
  const motors = [
    [46, 46],
    [154, 46],
    [46, 154],
    [154, 154],
  ] as const;

  return (
    <div
      className={`${animate ? "drone-float" : ""} ${className ?? ""}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 200 200"
        className="h-full w-full drop-shadow-[0_10px_18px_rgba(7,86,79,0.28)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft gold glow under the craft */}
        <ellipse
          cx="100"
          cy="168"
          rx="42"
          ry="10"
          fill="rgba(217,165,46,0.28)"
        />
        <ellipse
          cx="100"
          cy="164"
          rx="28"
          ry="6"
          fill="rgba(7,86,79,0.14)"
        />

        <g stroke="#d7e4e1" strokeWidth="7" strokeLinecap="round">
          <line x1="100" y1="100" x2="46" y2="46" />
          <line x1="100" y1="100" x2="154" y2="46" />
          <line x1="100" y1="100" x2="46" y2="154" />
          <line x1="100" y1="100" x2="154" y2="154" />
        </g>
        <g stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round">
          <line x1="100" y1="100" x2="46" y2="46" />
          <line x1="100" y1="100" x2="154" y2="46" />
          <line x1="100" y1="100" x2="46" y2="154" />
          <line x1="100" y1="100" x2="154" y2="154" />
        </g>

        <rect
          x="82"
          y="82"
          width="36"
          height="36"
          rx="8"
          fill="#ffffff"
          stroke="#07564F"
          strokeWidth="1.6"
        />
        <circle cx="100" cy="100" r="4" fill="#D9A52E" />

        {motors.map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            <circle r="15" fill="#07564F" />
            <circle
              className={
                animate
                  ? i % 2 === 0
                    ? "drone-rotor-disc"
                    : "drone-rotor-disc-alt"
                  : undefined
              }
              r="15"
              fill="none"
              stroke="#D9A52E"
              strokeWidth="2.2"
              strokeDasharray="9 28"
              strokeLinecap="round"
            />
            <circle r="4.5" fill="#ffffff" />
          </g>
        ))}
      </svg>
    </div>
  );
}
