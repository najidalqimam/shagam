"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

export type RevealVariant = "up" | "down" | "left" | "right" | "fade" | "scale";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  /** When true, stays visible after first reveal (default). */
  once?: boolean;
};

/** Lightweight scroll reveal — CSS only, no animation library. */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.shown = "true";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${shown ? "reveal-shown" : ""} ${className ?? ""}`}
      data-shown={shown ? "true" : undefined}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Delay between children in seconds. */
  interval?: number;
  variant?: RevealVariant;
};

/** Reveals children in sequence when the group enters the viewport. */
export function Stagger({
  children,
  className,
  interval = 0.07,
  variant = "up",
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.shown = "true";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`stagger ${shown ? "stagger-shown" : ""} ${className ?? ""}`}
      data-shown={shown ? "true" : undefined}
    >
      {Children.map(children, (child, i) => (
        <div
          className={`reveal reveal-${variant} ${shown ? "reveal-shown" : ""}`}
          style={
            {
              transitionDelay: `${i * interval}s`,
            } as CSSProperties
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
}
