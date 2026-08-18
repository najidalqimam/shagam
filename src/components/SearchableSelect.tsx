"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type SearchableOption = {
  id: string;
  label: string;
};

type SearchableSelectProps = {
  label: string;
  value: SearchableOption | null;
  loadOptions: (query: string) => SearchableOption[];
  onChange: (option: SearchableOption | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  emptyMessage?: string;
  resultLimit?: number;
  /** Light surface styles for forms on pale backgrounds. */
  light?: boolean;
  /** Denser control height for compact forms. */
  compact?: boolean;
};

export function SearchableSelect({
  label,
  value,
  loadOptions,
  onChange,
  placeholder = "ابحث…",
  disabled = false,
  error,
  emptyMessage = "لا توجد نتائج",
  resultLimit = 50,
  light = false,
  compact = false,
}: SearchableSelectProps) {
  const listId = useId();
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);

  const options = useMemo(() => loadOptions(query), [loadOptions, query]);
  const truncated = options.length >= resultLimit;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const select = (option: SearchableOption) => {
    onChange(option);
    setQuery("");
    setOpen(false);
    setHighlight(0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, Math.max(options.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && options[highlight]) select(options[highlight]);
      else setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const shell = light
    ? `flex items-center gap-2 rounded-xl border bg-[#F2F8F6] px-3 transition ${
        compact ? "h-10 py-0" : "py-3"
      } ${
        disabled
          ? "cursor-not-allowed border-[#07564F]/10 opacity-55"
          : error
            ? "border-red-500/70"
            : open
              ? "border-[#D3A74D] bg-white ring-2 ring-[#D3A74D]/25"
              : "border-[#07564F]/15 focus-within:border-[#D3A74D] focus-within:bg-white"
      }`
    : `flex items-center gap-2 border bg-bg-elevated px-3 py-2.5 transition ${
        disabled
          ? "cursor-not-allowed border-line opacity-55"
          : error
            ? "border-red-500/70"
            : open
              ? "border-sand"
              : "border-line focus-within:border-sand"
      }`;

  return (
    <div ref={rootRef} className={`relative flex flex-col ${compact ? "gap-1.5" : "gap-2"} text-sm`}>
      <label
        htmlFor={inputId}
        className={
          light
            ? compact
              ? "text-[0.8125rem] font-semibold text-[#07564F]"
              : "font-medium text-[#07564F]"
            : "text-ink-muted"
        }
      >
        {label}
      </label>
      <div className={shell}>
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-disabled={disabled}
          disabled={disabled}
          autoComplete="off"
          placeholder={value ? value.label : placeholder}
          value={open ? query : value?.label ?? ""}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(0);
            setOpen(true);
            if (value) onChange(null);
          }}
          onFocus={() => {
            if (!disabled) {
              setOpen(true);
              setQuery("");
              setHighlight(0);
            }
          }}
          onKeyDown={onKeyDown}
          className={`min-w-0 flex-1 bg-transparent outline-none ${
            light
              ? "text-[#07564F] placeholder:text-[#07564F]/40"
              : "text-ink placeholder:text-ink-muted/70"
          }`}
        />
        {value && !disabled && (
          <button
            type="button"
            aria-label="مسح الاختيار"
            className={
              light
                ? "shrink-0 text-[#4d6f6a] transition hover:text-[#07564F]"
                : "shrink-0 text-ink-muted transition hover:text-ink"
            }
            onClick={() => {
              onChange(null);
              setQuery("");
              setOpen(true);
            }}
          >
            ×
          </button>
        )}
      </div>

      {open && !disabled && (
        <ul
          id={listId}
          role="listbox"
          className={`absolute inset-x-0 top-full z-30 mt-1 max-h-56 overflow-auto border shadow-[0_12px_28px_rgba(7,86,79,0.12)] ${
            light
              ? "rounded-xl border-[#07564F]/12 bg-white"
              : "border-line bg-bg-elevated"
          }`}
        >
          {options.length === 0 ? (
            <li
              className={`px-3 py-3 ${light ? "text-[#4d6f6a]" : "text-ink-muted"}`}
            >
              {emptyMessage}
            </li>
          ) : (
            options.map((option, i) => {
              const active = i === highlight;
              const selected = value?.id === option.id;
              return (
                <li key={option.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    className={`flex w-full px-3 py-2.5 text-start transition ${
                      active || selected
                        ? "bg-[#07564F] text-white"
                        : light
                          ? "text-[#07564F] hover:bg-[#F2F8F6]"
                          : "text-ink hover:bg-[#F2F8F6]"
                    }`}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => select(option)}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })
          )}
          {truncated && options.length > 0 && (
            <li
              className={`border-t px-3 py-2 text-xs ${
                light
                  ? "border-[#07564F]/10 text-[#4d6f6a]"
                  : "border-line text-ink-muted"
              }`}
            >
              عُرضت أول النتائج — حدّد البحث لتصفية أدق
            </li>
          )}
        </ul>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
