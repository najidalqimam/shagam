"use client";

import { useRef, useState } from "react";
import {
  isValidEmail,
  isValidSaudiMobile,
  normalizeSaudiMobile,
} from "@/lib/operatorJoin";
import { useLocale } from "../LocaleProvider";
import { useSiteContent } from "../SiteContentProvider";
import { ojBtnGhost, ojBtnPrimary, ojCard } from "../operator-join/styles";
import {
  ClientContactSection,
  type ContactFields,
} from "./ClientContactSection";
import { RequestInfoSidebar } from "./RequestInfoSidebar";
import { RequestSuccessState } from "./RequestSuccessState";
import { ServiceDetailsSection } from "./ServiceDetailsSection";

const emptyContact = (city = ""): ContactFields => ({
  fullName: "",
  phone: "",
  email: "",
  city,
});

export function ServiceRequestPage() {
  const { content } = useSiteContent();
  const { t } = useLocale();
  const sr = t.serviceRequest;
  const f = t.form;
  const roleCustomer = f.roles.customer.value;
  const cities = content.cities;
  const serviceOptions = content.serviceOptions;

  const [contact, setContact] = useState<ContactFields>(() =>
    emptyContact(cities[0] ?? ""),
  );
  const [service, setService] = useState("");
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFields | "service" | "agree", string>>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null | undefined>(
    undefined,
  );

  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);

  const resetForm = () => {
    setContact(emptyContact(cities[0] ?? ""));
    setService("");
    setNotes("");
    setAgreed(false);
    setErrors({});
    setSubmitError(null);
  };

  const validate = () => {
    const next: Partial<
      Record<keyof ContactFields | "service" | "agree", string>
    > = {};
    if (!contact.fullName.trim()) next.fullName = sr.errFullName;
    if (!isValidSaudiMobile(contact.phone)) next.phone = sr.errPhone;
    if (!isValidEmail(contact.email)) next.email = sr.errEmail;
    if (!service) next.service = sr.errService;
    if (!agreed) next.agree = sr.errAgree;
    setErrors(next);

    if (next.fullName) fullNameRef.current?.focus();
    else if (next.phone) phoneRef.current?.focus();
    else if (next.email) emailRef.current?.focus();
    else if (next.service) serviceRef.current?.focus();

    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    setSubmitError(null);
    if (!validate()) return;
    if (submitting) return;

    const body = new FormData();
    body.set("role", roleCustomer);
    body.set("fullName", contact.fullName.trim());
    body.set("organization", "");
    body.set("phone", normalizeSaudiMobile(contact.phone));
    body.set("email", contact.email.trim());
    body.set("city", contact.city);
    body.set("service", service);
    body.set("notes", notes.trim());

    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", { method: "POST", body });
      if (!res.ok) {
        setSubmitError(f.submitFail);
        return;
      }
      let id: string | undefined;
      try {
        const json = (await res.json()) as { id?: string };
        id = json.id;
      } catch {
        /* optional */
      }
      resetForm();
      setSuccessId(id ?? null);
    } catch {
      setSubmitError(f.networkFail);
    } finally {
      setSubmitting(false);
    }
  };

  if (successId !== undefined) {
    return (
      <RequestSuccessState
        requestId={successId ?? undefined}
        onAnother={() => setSuccessId(undefined)}
      />
    );
  }

  return (
    <div className="request-service-page grid items-start gap-4 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-5">
      <RequestInfoSidebar />

      <div className={ojCard}>
        <ClientContactSection
          value={contact}
          cities={cities}
          errors={errors}
          fieldRefs={{
            fullName: fullNameRef,
            phone: phoneRef,
            email: emailRef,
          }}
          onChange={(next) => {
            setContact(next);
            setErrors((e) => ({
              ...e,
              fullName: undefined,
              phone: undefined,
              email: undefined,
            }));
          }}
        />

        <div className="mt-6">
          <ServiceDetailsSection
            service={service}
            notes={notes}
            serviceOptions={serviceOptions}
            serviceError={errors.service}
            serviceRef={serviceRef}
            onServiceChange={(v) => {
              setService(v);
              setErrors((e) => ({ ...e, service: undefined }));
            }}
            onNotesChange={setNotes}
            agreed={agreed}
            agreeError={errors.agree}
            onAgreeChange={(v) => {
              setAgreed(v);
              setErrors((e) => ({ ...e, agree: undefined }));
            }}
          />
        </div>

        <div className="mt-5 space-y-4">
          {submitError ? (
            <p
              role="alert"
              className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {submitError}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className={`${ojBtnGhost} w-full sm:w-auto`}
              onClick={() => {
                if (window.confirm(sr.clearConfirm)) resetForm();
              }}
            >
              {sr.clear}
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={onSubmit}
              className={`${ojBtnPrimary} w-full sm:min-w-[16rem] sm:w-auto`}
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
                  {sr.submitting}
                </>
              ) : (
                <>
                  {sr.submit}
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M3 10.5 16.5 4l-3.2 12.2-3.1-4.1L3 10.5zm7.4 1.2 1.7 2.2 1.6-6.1-3.3 3.9z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
