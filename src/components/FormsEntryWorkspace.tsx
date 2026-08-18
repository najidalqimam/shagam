"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { OperatorRegistrationPage } from "./operator-join/OperatorRegistrationPage";
import { RoleEntryShell } from "./RoleTypeSelector";
import { ServiceRequestPage } from "./service-request/ServiceRequestPage";
import { hydrateDroneCatalog } from "@/lib/droneCatalog";
import { useLocale } from "./LocaleProvider";

type Role = "customer" | "operator";

function roleFromPath(pathname: string): Role {
  return pathname.includes("join-operator") ? "operator" : "customer";
}

function hrefForRole(role: Role) {
  return role === "customer" ? "/request-service" : "/join-operator";
}

/** Keeps both forms mounted so role switching feels like one page. */
export function FormsEntryWorkspace() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLocale();
  const [, startTransition] = useTransition();
  const [role, setRole] = useState<Role>(() => roleFromPath(pathname));
  const [catalogReady, setCatalogReady] = useState(false);

  useEffect(() => {
    setRole(roleFromPath(pathname));
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.manufacturers) {
          hydrateDroneCatalog(data);
          setCatalogReady(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.title =
      role === "customer"
        ? locale === "ar"
          ? "اطلب خدمة درون | شاغم"
          : "Request a drone service | Shagam"
        : locale === "ar"
          ? "انضم كمشغّل | شاغم"
          : "Join as operator | Shagam";
  }, [role, locale]);

  const selectRole = (next: Role) => {
    if (next === role) return;
    setRole(next);
    startTransition(() => {
      router.replace(hrefForRole(next), { scroll: false });
    });
  };

  return (
    <RoleEntryShell active={role} onSelectRole={selectRole}>
      <div
        className={role === "customer" ? undefined : "hidden"}
        aria-hidden={role !== "customer"}
        {...(role !== "customer" ? { inert: true } : {})}
      >
        <ServiceRequestPage />
      </div>
      <div
        className={role === "operator" ? undefined : "hidden"}
        aria-hidden={role !== "operator"}
        {...(role !== "operator" ? { inert: true } : {})}
      >
        <OperatorRegistrationPage key={catalogReady ? "catalog" : "pending"} />
      </div>
    </RoleEntryShell>
  );
}
