"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  buildFleetPayload,
  createEmptyAircraft,
  isAircraftComplete,
  type FleetAircraftDraft,
} from "@/lib/droneCatalog";
import {
  OPERATOR_ROLE_VALUE,
  ORG_TYPE_ENTITY,
  ORG_TYPE_INDIVIDUAL,
  clearOperatorDraft,
  emptyBasicInfo,
  emptyLicenseMeta,
  isValidEmail,
  isValidSaudiMobile,
  loadOperatorDraft,
  normalizeSaudiMobile,
  saveOperatorDraft,
  type OperatorBasicInfo,
  type OperatorJoinStep,
  type OperatorLicenseMeta,
} from "@/lib/operatorJoin";
import { useLocale } from "../LocaleProvider";
import { useSiteContent } from "../SiteContentProvider";
import { BasicInformationStep } from "./BasicInformationStep";
import { DroneFleetStep } from "./DroneFleetStep";
import { LicenseUploadStep } from "./LicenseUploadStep";
import { OperatorStepper } from "./OperatorStepper";
import { ReviewSubmitStep } from "./ReviewSubmitStep";
import { ojCard } from "./styles";

type SuccessState = { id?: string } | null;

function ensureFleetIds(fleet: FleetAircraftDraft[]): FleetAircraftDraft[] {
  return fleet.map((item) => ({
    ...createEmptyAircraft(),
    ...item,
    serialNumber: item.serialNumber ?? "",
    usageType: item.usageType ?? "",
  }));
}

export function OperatorRegistrationPage() {
  const { content } = useSiteContent();
  const { t } = useLocale();
  const oj = t.operatorJoin;
  const f = t.form;
  const fleetCopy = t.fleet;

  const cities = content.cities;
  const sectors = content.services.map((s) => s.title);
  const usageOptions = sectors;

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<OperatorJoinStep>(1);
  const [basic, setBasic] = useState<OperatorBasicInfo>(() =>
    emptyBasicInfo(cities[0] ?? ""),
  );
  const [license, setLicense] = useState<OperatorLicenseMeta>(emptyLicenseMeta);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [needsReupload, setNeedsReupload] = useState(false);
  const [fleet, setFleet] = useState<FleetAircraftDraft[]>([createEmptyAircraft()]);
  const [agreed, setAgreed] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [basicErrors, setBasicErrors] = useState<
    Partial<Record<keyof OperatorBasicInfo, string>>
  >({});
  const [licenseError, setLicenseError] = useState<string>();
  const [fleetError, setFleetError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [agreeError, setAgreeError] = useState<string>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessState>(null);

  useEffect(() => {
    const draft = loadOperatorDraft();
    if (draft) {
      setStep(draft.step);
      setBasic({
        ...emptyBasicInfo(cities[0] ?? ""),
        ...draft.basic,
      });
      setLicense({ ...emptyLicenseMeta(), ...draft.license });
      setNeedsReupload(Boolean(draft.license?.name));
      setFleet(
        draft.fleet?.length ? ensureFleetIds(draft.fleet) : [createEmptyAircraft()],
      );
      setAgreed(Boolean(draft.agreed));
    }
    setHydrated(true);
  }, [cities]);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = oj.leaveWarn;
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, oj.leaveWarn]);

  const markDirty = () => {
    setDirty(true);
    setDraftNote(null);
  };

  const persistDraft = (nextStep = step) => {
    saveOperatorDraft({
      step: nextStep,
      basic,
      license: {
        ...license,
        name: licenseFile?.name || license.name,
        size: licenseFile?.size || license.size,
        type: licenseFile?.type || license.type,
      },
      fleet,
      agreed,
      updatedAt: new Date().toISOString(),
    });
    setDirty(false);
    setDraftNote(oj.draftSaved);
  };

  const clearForm = () => {
    if (!window.confirm(oj.clearConfirm)) return;
    clearOperatorDraft();
    setStep(1);
    setBasic(emptyBasicInfo(cities[0] ?? ""));
    setLicense(emptyLicenseMeta());
    setLicenseFile(null);
    setNeedsReupload(false);
    setFleet([createEmptyAircraft()]);
    setAgreed(false);
    setBasicErrors({});
    setLicenseError(undefined);
    setFleetError(undefined);
    setFieldErrors({});
    setAgreeError(undefined);
    setSubmitError(null);
    setDraftNote(null);
    setDirty(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateBasic = () => {
    const errors: Partial<Record<keyof OperatorBasicInfo, string>> = {};
    if (!basic.fullName.trim()) errors.fullName = oj.errFullName;
    if (
      basic.organization !== ORG_TYPE_ENTITY &&
      basic.organization !== ORG_TYPE_INDIVIDUAL
    ) {
      errors.organization = oj.errOrganization;
    }
    if (!isValidSaudiMobile(basic.phone)) errors.phone = oj.errPhone;
    if (!isValidEmail(basic.email)) errors.email = oj.errEmail;
    if (!basic.operatingSector) errors.operatingSector = oj.errSector;
    setBasicErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLicense = () => {
    if (!licenseFile) {
      setLicenseError(oj.errLicenseFile);
      return false;
    }
    setLicenseError(undefined);
    return true;
  };

  const validateFleet = () => {
    const errors: Record<string, string> = {};
    if (fleet.length === 0) {
      setFleetError(fleetCopy.needOne);
      setFieldErrors({});
      return false;
    }
    for (const item of fleet) {
      if (item.isUnlisted) {
        if (!item.customManufacturer.trim()) {
          errors[`${item.localId}.customManufacturer`] = fleetCopy.enterManufacturer;
        }
        if (!item.customModel.trim()) {
          errors[`${item.localId}.customModel`] = fleetCopy.enterModel;
        }
      } else {
        if (!item.manufacturerId) {
          errors[`${item.localId}.manufacturer`] = fleetCopy.pickManufacturer;
        }
        if (!item.modelId) {
          errors[`${item.localId}.model`] = fleetCopy.pickModel;
        }
      }
      if (!item.usageType.trim()) {
        errors[`${item.localId}.usageType`] = fleetCopy.usageRequired;
      }
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFleetError(fleetCopy.completeAll);
      return false;
    }
    if (fleet.filter(isAircraftComplete).length < 1) {
      setFleetError(fleetCopy.needOne);
      return false;
    }
    // also require usage on complete check
    const missingUsage = fleet.some((a) => isAircraftComplete(a) && !a.usageType.trim());
    if (missingUsage) {
      setFleetError(fleetCopy.completeAll);
      return false;
    }
    setFleetError(undefined);
    return true;
  };

  const goNextFrom = (from: OperatorJoinStep) => {
    if (from === 1 && !validateBasic()) return;
    if (from === 2 && !validateLicense()) return;
    if (from === 3 && !validateFleet()) return;
    const next = (from + 1) as OperatorJoinStep;
    setStep(next);
    persistDraft(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async () => {
    setSubmitError(null);
    setAgreeError(undefined);
    if (!validateBasic() || !validateLicense() || !validateFleet()) {
      setSubmitError(f.submitFail);
      return;
    }
    if (!agreed) {
      setAgreeError(oj.errAgree);
      return;
    }
    if (submitting) return;

    const body = new FormData();
    body.set("role", OPERATOR_ROLE_VALUE);
    body.set("fullName", basic.fullName.trim());
    body.set("organization", basic.organization.trim());
    body.set("phone", normalizeSaudiMobile(basic.phone));
    body.set("email", basic.email.trim());
    body.set("city", basic.city);
    body.set("operatingSector", basic.operatingSector);
    body.set(
      "notes",
      [
        license.licenseNumber ? `رقم الرخصة: ${license.licenseNumber}` : "",
        license.expiryDate ? `انتهاء الرخصة: ${license.expiryDate}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
    );
    body.set("fleet", JSON.stringify(buildFleetPayload(fleet)));
    if (licenseFile) body.set("license", licenseFile);

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
      clearOperatorDraft();
      setDirty(false);
      setSuccess({ id });
    } catch {
      setSubmitError(f.networkFail);
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="py-16 text-center text-sm text-brand/60" aria-hidden>
        …
      </div>
    );
  }

  if (success) {
    return (
      <div className={`${ojCard} mx-auto max-w-lg text-center`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-ink">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
            <path d="M9.5 16.2 5.8 12.5l1.4-1.4 2.3 2.3 6.4-6.5 1.4 1.4-7.8 7.9z" />
          </svg>
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold text-brand">
          {oj.successTitle}
        </h2>
        <p className="mt-3 text-sm leading-7 text-brand/65">{oj.successBody}</p>
        {success.id ? (
          <p className="mt-4 text-sm font-semibold text-sand">
            {oj.requestId(success.id)}
          </p>
        ) : null}
        <Link
          href="/"
          className="mt-8 inline-flex rounded-2xl bg-sand px-6 py-3.5 text-sm font-bold text-brand"
        >
          {oj.backHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="join-operator-page grid items-start gap-4 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:gap-5">
      <OperatorStepper step={step} />

      <div className={ojCard}>
        {draftNote ? (
          <p className="mb-4 rounded-xl border border-brand/10 bg-[#e8f3f0] px-3 py-2 text-sm text-brand">
            {draftNote}
          </p>
        ) : null}

        {step === 1 ? (
          <BasicInformationStep
            value={basic}
            cities={cities}
            sectors={sectors}
            errors={basicErrors}
            onChange={(next) => {
              setBasic(next);
              markDirty();
            }}
            onNext={() => goNextFrom(1)}
            onSaveDraft={() => persistDraft(1)}
            onClear={clearForm}
          />
        ) : null}

        {step === 2 ? (
          <LicenseUploadStep
            meta={license}
            file={licenseFile}
            needsReupload={needsReupload && !licenseFile}
            error={licenseError}
            onMetaChange={(next) => {
              setLicense(next);
              markDirty();
            }}
            onFileChange={(file, err) => {
              setLicenseFile(file);
              setNeedsReupload(false);
              setLicenseError(err);
              markDirty();
            }}
            onPrev={() => setStep(1)}
            onNext={() => goNextFrom(2)}
            onSaveDraft={() => persistDraft(2)}
            onClear={clearForm}
          />
        ) : null}

        {step === 3 ? (
          <DroneFleetStep
            fleet={fleet}
            usageOptions={usageOptions}
            error={fleetError}
            fieldErrors={fieldErrors}
            onChange={(next) => {
              setFleet(next.length ? next : [createEmptyAircraft()]);
              setFleetError(undefined);
              setFieldErrors({});
              markDirty();
            }}
            onPrev={() => setStep(2)}
            onNext={() => goNextFrom(3)}
            onSaveDraft={() => persistDraft(3)}
            onClear={clearForm}
          />
        ) : null}

        {step === 4 ? (
          <ReviewSubmitStep
            basic={basic}
            license={license}
            file={licenseFile}
            fleet={fleet}
            agreed={agreed}
            agreeError={agreeError}
            submitError={submitError}
            submitting={submitting}
            onAgreeChange={(v) => {
              setAgreed(v);
              setAgreeError(undefined);
              markDirty();
            }}
            onEdit={(s) => setStep(s)}
            onPrev={() => setStep(3)}
            onSaveDraft={() => persistDraft(4)}
            onClear={clearForm}
            onSubmit={onSubmit}
          />
        ) : null}
      </div>
    </div>
  );
}
