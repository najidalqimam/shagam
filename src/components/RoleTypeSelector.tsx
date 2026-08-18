"use client";

import type { ReactNode } from "react";
import { useLocale } from "./LocaleProvider";

export type EntryRole = "customer" | "operator";

function CheckBadge() {
  return (
    <span className="absolute end-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-sand text-brand">
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
        <path d="M8.1 13.6 4.8 10.3l1.2-1.2 2.1 2.1 5-5.1 1.2 1.2-6.2 6.3z" />
      </svg>
    </span>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
        active ? "bg-brand text-ink" : "bg-brand/10 text-brand"
      }`}
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1.5c-3.3 0-6 2-6 4.5V17h12v-1c0-2.5-2.7-4.5-6-4.5z" />
      </svg>
    </span>
  );
}

function DroneIcon({ active }: { active: boolean }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
        active ? "bg-brand text-ink" : "bg-brand/10 text-brand"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M4 8h4M16 8h4M4 16h4M16 16h4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

const activeCard =
  "relative flex min-h-[5.5rem] w-full items-center rounded-2xl border-2 border-sand bg-sand/10 p-4 text-start";
const idleCard =
  "relative flex min-h-[5.5rem] w-full items-center rounded-2xl border border-brand/15 bg-white p-4 text-start transition hover:border-brand/30 hover:bg-brand/[0.02]";

export function RoleTypeSelector({
  active,
  onSelectRole,
}: {
  active: EntryRole;
  onSelectRole: (role: EntryRole) => void;
}) {
  const { t } = useLocale();
  const oj = t.operatorJoin;
  const customerActive = active === "customer";
  const operatorActive = active === "operator";

  return (
    <div className="grid gap-3 sm:grid-cols-2" role="tablist" aria-label={t.entry.rolesAria}>
      {customerActive ? (
        <div className={activeCard} role="tab" aria-selected="true">
          <CheckBadge />
          <div className="flex items-center gap-3">
            <UserIcon active />
            <div>
              <p className="font-display font-bold text-brand">{oj.roleCustomerTitle}</p>
              <p className="mt-1 text-xs text-brand/65">{oj.roleCustomerHint}</p>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          role="tab"
          aria-selected="false"
          className={idleCard}
          onClick={() => onSelectRole("customer")}
        >
          <div className="flex items-center gap-3">
            <UserIcon active={false} />
            <div>
              <p className="font-display font-bold text-brand">{oj.roleCustomerTitle}</p>
              <p className="mt-1 text-xs text-brand/65">{oj.roleCustomerHint}</p>
            </div>
          </div>
        </button>
      )}

      {operatorActive ? (
        <div className={activeCard} role="tab" aria-selected="true">
          <CheckBadge />
          <div className="flex items-center gap-3">
            <DroneIcon active />
            <div>
              <p className="font-display font-bold text-brand">{oj.roleOperatorTitle}</p>
              <p className="mt-1 text-xs text-brand/65">{oj.roleOperatorHint}</p>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          role="tab"
          aria-selected="false"
          className={idleCard}
          onClick={() => onSelectRole("operator")}
        >
          <div className="flex items-center gap-3">
            <DroneIcon active={false} />
            <div>
              <p className="font-display font-bold text-brand">{oj.roleOperatorTitle}</p>
              <p className="mt-1 text-xs text-brand/65">{oj.roleOperatorHint}</p>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

/** Shared chrome so customer/operator feel like one page */
export function RoleEntryShell({
  active,
  onSelectRole,
  children,
}: {
  active: EntryRole;
  onSelectRole: (role: EntryRole) => void;
  children: ReactNode;
}) {
  const { t } = useLocale();

  return (
    <div className="bg-[#eef3f2] pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] pt-28 lg:pb-16 lg:pt-32">
      <div className="section-pad mx-auto max-w-[1240px]">
        <div className="mb-6 max-w-2xl sm:mb-8">
          <h1 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-bold text-brand">
            {t.entry.pageTitle}
          </h1>
          <p className="mt-3 text-base leading-8 text-brand/65">{t.entry.pageSubtitle}</p>
        </div>

        <div className="mb-6 sm:mb-8">
          <RoleTypeSelector active={active} onSelectRole={onSelectRole} />
        </div>

        {children}
      </div>
    </div>
  );
}
