"use client";

import { useEffect, useRef, useState, useTransition, type InputHTMLAttributes, type SubmitEvent } from "react";
import { submitInquiry, type SubmitResult } from "@/actions/submit-inquiry";
import { FORM, INQUIRY_TYPE_LABELS, PRIVACY, SITE } from "@/content/site";
import {
  FIELD_LIMITS,
  FIELD_ORDER,
  hasErrors,
  INQUIRY_TYPES,
  toInquirySource,
  toInquiryType,
  validateInquiry,
  type FieldErrors,
  type InquiryInput,
  type InquirySource,
  type InquiryType,
} from "@/lib/contact/schema";
import { describedBy, Field, FieldError, fieldId, inputClass } from "./field";
import { SuccessPanel } from "./success-panel";

type Values = Omit<InquiryInput, "source">;
type TextField = "company" | "name" | "title" | "email" | "phone" | "message";
type Result = SubmitResult | { status: "network" };

const EMPTY: Omit<Values, "inquiryType"> = {
  company: "",
  name: "",
  title: "",
  email: "",
  phone: "",
  message: "",
  nda: false,
  consent: false,
};

function trimmed(values: Values, source: InquirySource): InquiryInput {
  return {
    ...values,
    company: values.company.trim(),
    name: values.name.trim(),
    title: values.title.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    message: values.message.trim(),
    source,
  };
}

function focusFirstError(errors: FieldErrors) {
  const first = FIELD_ORDER.find((field) => errors[field]);
  if (first) document.getElementById(fieldId(first))?.focus();
}

export function ContactForm() {
  const [values, setValues] = useState<Values>({ inquiryType: "undecided", ...EMPTY });
  const [source, setSource] = useState<InquirySource>("direct");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();

    // 공유 링크(?type=onprem#contact)로 들어오면 문의 분야를 미리 골라 둡니다.
    const type = new URLSearchParams(window.location.search).get("type");
    const linkedType = type ? toInquiryType(type) : null;
    const applyLink = () => {
      if (!linkedType) return;
      setValues((v) => ({ ...v, inquiryType: linkedType }));
      setSource("link");
    };
    const frame = requestAnimationFrame(applyLink);

    // 페이지 곳곳의 상담 요청 링크(data-cta)를 누르면 진입 경로와 문의 분야를 기록합니다.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[data-cta]");
      if (!link) return;
      setSource(toInquirySource(link.dataset.cta));
      const inquiry = link.dataset.inquiry;
      if (inquiry) setValues((v) => ({ ...v, inquiryType: toInquiryType(inquiry) }));
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // 오류는 제출할 때만 새로 표시하고, 입력을 고치는 즉시 지웁니다.
  // 포커스를 잃을 때 검사하면 제출 버튼을 누르는 순간 레이아웃이 밀려 클릭이 사라지기 때문입니다.
  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (!attempted) return;
    const stillInvalid = validateInquiry(trimmed(next, source));
    setErrors((current) => {
      const kept: FieldErrors = {};
      for (const field of FIELD_ORDER) if (current[field] && stillInvalid[field]) kept[field] = stillInvalid[field];
      return kept;
    });
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    const input = trimmed(values, source);
    const clientErrors = validateInquiry(input);
    setAttempted(true);
    setErrors(clientErrors);
    if (hasErrors(clientErrors)) {
      setResult(null);
      focusFirstError(clientErrors);
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("source", source);
    formData.set("elapsedMs", String(Date.now() - mountedAt.current));

    startTransition(async () => {
      try {
        const response = await submitInquiry(formData);
        setResult(response);
        if (response.status === "invalid") {
          setErrors(response.fieldErrors);
          focusFirstError(response.fieldErrors);
        }
      } catch {
        setResult({ status: "network" });
      }
    });
  };

  const reset = () => {
    setValues((v) => ({ inquiryType: v.inquiryType, ...EMPTY }));
    setErrors({});
    setAttempted(false);
    setResult(null);
    setConsentOpen(false);
  };

  if (result?.status === "success") {
    return (
      <SuccessPanel
        inquiryId={result.inquiryId}
        name={values.name.trim()}
        email={values.email.trim()}
        nda={values.nda}
        onReset={reset}
      />
    );
  }

  const errorCount = Object.keys(errors).length;
  const failure = result?.status === "failed" ? FORM.failed : result?.status === "network" ? FORM.network : null;

  const textInput = (name: Exclude<TextField, "message">, extra: InputHTMLAttributes<HTMLInputElement>) => {
    const config = FORM.fields[name];
    const hint = "hint" in config ? config.hint : undefined;
    return (
      <Field name={name} label={config.label} hint={hint} error={errors[name]}>
        <input
          {...describedBy(name, { hint: !!hint, error: errors[name] })}
          value={values[name]}
          onChange={(e) => update(name, e.target.value)}
          placeholder={config.placeholder}
          maxLength={FIELD_LIMITS[name]}
          className={`${inputClass} h-12`}
          {...extra}
        />
      </Field>
    );
  };

  return (
    <form noValidate aria-labelledby="contact-title" onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-ink-muted">{FORM.intro}</p>

      <div aria-live="polite" className="empty:hidden">
        {attempted && errorCount > 0 ? (
          <p className="rounded-sm border border-danger/40 p-4 text-sm text-ink-body">{FORM.errorSummary(errorCount)}</p>
        ) : null}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">{FORM.typeLegend}</legend>
        <div className="grid gap-2">
          {INQUIRY_TYPES.map((type: InquiryType) => (
            <label
              key={type}
              className="flex cursor-pointer items-start gap-3 rounded-sm border border-line-strong p-4 transition-colors hover:border-ink-muted has-checked:border-ink has-checked:ring-1 has-checked:ring-ink has-focus-visible:ring-2 has-focus-visible:ring-ink has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-surface"
            >
              <input
                type="radio"
                name="inquiryType"
                value={type}
                checked={values.inquiryType === type}
                onChange={() => update("inquiryType", type)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="mt-1 grid size-4 shrink-0 place-items-center rounded-full border border-line-strong peer-checked:border-ink peer-checked:[&>span]:block"
              >
                <span className="hidden size-2 rounded-full bg-ink" />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-ink">{INQUIRY_TYPE_LABELS[type].title}</span>
                <span className="mt-0.5 block text-[13px] text-ink-muted">{INQUIRY_TYPE_LABELS[type].description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {textInput("company", { type: "text", required: true, autoComplete: "organization", enterKeyHint: "next" })}

      <div className="grid gap-6 sm:grid-cols-2">
        {textInput("name", { type: "text", required: true, autoComplete: "name", enterKeyHint: "next" })}
        {textInput("title", { type: "text", autoComplete: "organization-title", enterKeyHint: "next" })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {textInput("email", { type: "email", required: true, inputMode: "email", autoComplete: "email", spellCheck: false })}
        {textInput("phone", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
      </div>

      <Field
        name="message"
        label={FORM.fields.message.label}
        hint={FORM.fields.message.hint}
        error={errors.message}
        aside={
          <span aria-hidden="true" className="shrink-0 font-mono">
            {values.message.length.toLocaleString("ko-KR")} / {FIELD_LIMITS.message.toLocaleString("ko-KR")}
          </span>
        }
      >
        <textarea
          {...describedBy("message", { hint: true, error: errors.message })}
          rows={5}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder={FORM.messagePlaceholders[values.inquiryType]}
          maxLength={FIELD_LIMITS.message}
          className={`${inputClass} min-h-36 py-3 leading-[1.7]`}
        />
      </Field>

      <div className="space-y-3">
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-[1.6] text-ink-body">
          <input
            type="checkbox"
            name="nda"
            checked={values.nda}
            onChange={(e) => update("nda", e.target.checked)}
            className="mt-0.5 size-5 shrink-0 accent-white"
          />
          <span>{FORM.fields.nda.label}</span>
        </label>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-x-4">
            <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-[1.6] text-ink">
              <input
                {...describedBy("consent", { error: errors.consent })}
                type="checkbox"
                required
                checked={values.consent}
                onChange={(e) => update("consent", e.target.checked)}
                      className="mt-0.5 size-5 shrink-0 accent-white"
              />
              <span>{FORM.fields.consent.label}</span>
            </label>
            <button
              type="button"
              aria-expanded={consentOpen}
              aria-controls="consent-panel"
              onClick={() => setConsentOpen((open) => !open)}
              className="min-h-11 rounded-xs text-sm text-ink-muted underline underline-offset-4 hover:text-ink outline-hidden focus-visible:ring-2 focus-visible:ring-ink"
            >
              {FORM.fields.consent.toggle}
            </button>
          </div>
          <FieldError name="consent" error={errors.consent} />
          <div
            id="consent-panel"
            hidden={!consentOpen}
            className="mt-2 space-y-1 rounded-sm border border-line p-4 text-[13px] leading-[1.7] text-ink-body"
          >
            <p>
              수집 항목: (필수) {PRIVACY.required} / (선택) {PRIVACY.optional}
            </p>
            <p>이용 목적: {PRIVACY.purpose}</p>
            <p>보유 기간: {PRIVACY.retention}</p>
            <p>처리 위탁·국외 이전: {PRIVACY.processors}</p>
            <p>{PRIVACY.refusal}</p>
            <a
              href="#privacy"
              onClick={() => {
                const policy = document.getElementById("privacy");
                if (policy instanceof HTMLDetailsElement) policy.open = true;
              }}
              className="inline-block pt-1 text-ink underline underline-offset-4"
            >
              개인정보처리방침 전문 보기
            </a>
          </div>
        </div>
      </div>

      {/* 봇 차단용 필드. 사람에게는 보이지 않습니다. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          웹사이트
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {failure ? (
        <div role="alert" className="rounded-sm border border-danger/40 bg-canvas p-4 text-sm leading-[1.7] text-ink-body">
          <p>{failure}</p>
          {SITE.contactEmail ? <p className="mt-1">{FORM.fallbackEmail(SITE.contactEmail)}</p> : null}
        </div>
      ) : null}

      <div className="space-y-3">
        <button
          type="submit"
          aria-disabled={isPending}
          aria-busy={isPending}
          className="inline-flex h-12 w-full items-center justify-center rounded-sm bg-ink text-[15px] font-semibold text-canvas transition-colors hover:bg-neutral-300 aria-disabled:cursor-wait aria-disabled:opacity-70 outline-hidden focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          {isPending ? FORM.submitting : FORM.submit}
        </button>
        <p className="text-center text-[13px] text-ink-muted">{FORM.submitNote}</p>
      </div>
    </form>
  );
}
