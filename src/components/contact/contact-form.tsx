"use client";

import { useEffect, useRef, useState, useTransition, type ChangeEvent, type InputHTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, type SubmitEvent } from "react";
import { submitInquiry } from "@/actions/submit-inquiry";
import { FORM, SITE } from "@/content/site";
import {
  FIELD_LIMITS,
  FIELD_ORDER,
  hasErrors,
  parseInquiryForm,
  toInquiryType,
  validateInquiry,
  type FieldErrors,
  type InquiryInput,
  type InquirySource,
  type InquiryType,
} from "@/lib/contact/schema";
import { keepTogether } from "@/lib/typography";
import { ConsentField } from "./consent-field";
import { restoreDraft, saveDraft, takeDraft } from "./draft";
import { checkboxClass, describedBy, Field, fieldId, inputClass } from "./field";
import { checkedType, focusFirstError, selectType } from "./form-dom";
import { InquiryTypeField } from "./inquiry-type-field";
import { classifySubmitError, failureMessage, type FormResult } from "./submission";
import { SuccessPanel } from "./success-panel";
import { useCtaWiring } from "./use-cta-wiring";

type TextField = "company" | "name" | "title" | "email" | "phone";

/** 한 줄 입력란에서 휴대폰 키보드의 '다음'(Enter)을 누르면 옮겨 갈 칸. 화면 순서와 같습니다. */
const NEXT_FIELD: Record<TextField, TextField | "message"> = { company: "name", name: "title", title: "email", email: "phone", phone: "message" };

/**
 * 상담 요청 양식.
 * 입력값은 React 상태가 아니라 DOM이 가지고 있습니다(비제어 입력). 그래서 스크립트가 늦게 뜨는 동안 입력한 내용,
 * 브라우저가 복원·자동 완성한 내용도 그대로 제출되며, 제출할 때는 서버와 같은 파서로 FormData를 읽어 검사합니다.
 */
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [ready, setReady] = useState(false);
  const [inquiryType, setInquiryType] = useState<InquiryType>("undecided");
  const [messageLength, setMessageLength] = useState(0);
  const [source, setSource] = useState<InquirySource>("direct");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [result, setResult] = useState<FormResult | null>(null);
  const [submitted, setSubmitted] = useState<InquiryInput | null>(null);
  const [isPending, startTransition] = useTransition();
  const focusAfterReset = useRef(false);
  /** 새로고침 전 화면에서 이미 머문 시간. 복원한 입력을 바로 다시 보내도 자동 제출로 의심받지 않게 합니다. */
  const elapsedBeforeReload = useRef(0);

  useCtaWiring(formRef, setSource, setInquiryType);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const form = formRef.current;
      if (!form) return;

      const draft = takeDraft();
      if (draft) {
        restoreDraft(form, draft);
        if (draft.source) setSource(draft.source);
        elapsedBeforeReload.current = draft.elapsedMs ?? 0;
      }

      // 공유 링크(?type=onprem#contact)로 들어오면, 방문자가 이미 고르지 않았을 때만 문의 분야를 골라 둡니다.
      const linked = new URLSearchParams(window.location.search).get("type");
      if (linked && !draft && checkedType(form) === "undecided") {
        selectType(form, toInquiryType(linked));
        setSource("link");
      }

      // 스크립트가 뜨기 전에 입력·선택한 내용을 화면 상태에 반영합니다.
      setInquiryType(checkedType(form));
      const message = form.elements.namedItem("message");
      if (message instanceof HTMLTextAreaElement) setMessageLength(message.value.length);
      setReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // '다른 문의 남기기' 뒤 다시 나타난 양식으로 포커스를 옮깁니다.
  useEffect(() => {
    if (result || !focusAfterReset.current) return;
    focusAfterReset.current = false;
    formRef.current?.querySelector<HTMLInputElement>('input[name="inquiryType"]:checked')?.focus();
  }, [result]);

  // 오류는 제출할 때만 새로 표시하고, 입력을 고치는 즉시 지웁니다.
  // 포커스를 잃을 때 검사하면 제출 버튼을 누르는 순간 레이아웃이 밀려 클릭이 사라지기 때문입니다.
  const handleChange = (event: ChangeEvent<HTMLFormElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    if (target.name === "inquiryType") setInquiryType(toInquiryType(target.value));
    if (target.name === "message") setMessageLength(target.value.length);
    if (!attempted) return;
    const stillInvalid = validateInquiry({ ...parseInquiryForm(new FormData(event.currentTarget)).input, source });
    setErrors((current) => {
      const kept: FieldErrors = {};
      for (const field of FIELD_ORDER) if (current[field] && stillInvalid[field]) kept[field] = stillInvalid[field];
      return kept;
    });
  };

  // 휴대폰 키보드의 '다음' 키는 Enter로 전달되어, 그대로 두면 첫 칸만 채운 양식이 제출됩니다.
  // 한 줄 입력란에서는 다음 칸으로 옮기고, 제출은 버튼으로만 합니다. 한글 조합 중인 Enter는 건드리지 않습니다.
  const handleKeyDown = (event: ReactKeyboardEvent<HTMLFormElement>) => {
    const target = event.target;
    if (event.key !== "Enter" || event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (!(target instanceof HTMLInputElement) || !Object.hasOwn(NEXT_FIELD, target.name)) return;
    event.preventDefault();
    document.getElementById(fieldId(NEXT_FIELD[target.name as TextField]))?.focus();
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending || !ready) return;

    const formData = new FormData(event.currentTarget);
    const input = { ...parseInquiryForm(formData).input, source };
    const clientErrors = validateInquiry(input);
    setAttempted(true);
    setSubmitCount((count) => count + 1);
    setErrors(clientErrors);
    if (hasErrors(clientErrors)) {
      setResult(null);
      focusFirstError(clientErrors);
      return;
    }

    // 페이지를 열기 시작한 시점부터 잰 시간. 자동 제출 의심 여부를 판단하는 데만 씁니다.
    const elapsedMs = Math.round(elapsedBeforeReload.current + performance.now());
    formData.set("source", source);
    formData.set("elapsedMs", String(elapsedMs));

    startTransition(async () => {
      try {
        const response = await submitInquiry(formData);
        if (response.status === "success") setSubmitted(input);
        if (response.status === "invalid") {
          setErrors(response.fieldErrors);
          focusFirstError(response.fieldErrors);
        }
        setResult(response);
      } catch (error) {
        const kind = classifySubmitError(error, navigator.onLine);
        setResult(kind === "stale" ? { status: "stale", saved: saveDraft({ ...input, elapsedMs }) } : { status: kind });
      }
    });
  };

  const reset = () => {
    focusAfterReset.current = true;
    setErrors({});
    setAttempted(false);
    setResult(null);
    setSubmitted(null);
    setMessageLength(0);
  };

  if (result?.status === "success" && submitted) {
    return (
      <SuccessPanel inquiryId={result.inquiryId} name={submitted.name} email={submitted.email} nda={submitted.nda} onReset={reset} />
    );
  }

  const errorCount = Object.keys(errors).length;
  const failure = failureMessage(result);

  const textInput = (name: TextField, extra: InputHTMLAttributes<HTMLInputElement>) => {
    const config = FORM.fields[name];
    const hint = "hint" in config ? config.hint : undefined;
    return (
      <Field name={name} label={config.label} hint={hint} error={errors[name]}>
        <input
          {...describedBy(name, { hint: !!hint, error: errors[name] })}
          placeholder={config.placeholder}
          maxLength={FIELD_LIMITS[name]}
          className={`${inputClass} h-12`}
          {...extra}
        />
      </Field>
    );
  };

  return (
    <form ref={formRef} method="post" noValidate aria-labelledby="contact-title" onSubmit={handleSubmit} onChange={handleChange} onKeyDown={handleKeyDown} className="space-y-6">
      <p className="text-sm text-ink-muted">{keepTogether(FORM.intro)}</p>

      <div aria-live="polite" className="empty:sr-only">
        {attempted && errorCount > 0 ? (
          <p key={submitCount} className="rounded-sm border border-danger/40 p-4 text-sm text-ink-body">
            {FORM.errorSummary(errorCount)}
          </p>
        ) : null}
      </div>

      <InquiryTypeField defaultValue={inquiryType} />

      {textInput("company", { type: "text", required: true, autoComplete: "organization", enterKeyHint: "next" })}
      <div className="grid gap-6 sm:grid-cols-2">
        {textInput("name", { type: "text", required: true, autoComplete: "name", enterKeyHint: "next" })}
        {textInput("title", { type: "text", autoComplete: "organization-title", enterKeyHint: "next" })}
      </div>
      {/* 회신 주소는 보내기 전에 끝까지 확인할 수 있도록 한 줄 전체를 씁니다. 연락처는 성함 칸과 같은 폭입니다. */}
      {textInput("email", { type: "email", required: true, inputMode: "email", autoComplete: "email", spellCheck: false, enterKeyHint: "next" })}

      <div className="grid gap-6 sm:grid-cols-2">
        {textInput("phone", { type: "tel", inputMode: "tel", autoComplete: "tel", enterKeyHint: "next" })}
      </div>

      <Field
        name="message"
        label={FORM.fields.message.label}
        hint={FORM.fields.message.hint}
        error={errors.message}
        aside={
          <span aria-hidden="true" className="shrink-0 font-mono">
            {messageLength.toLocaleString("ko-KR")} / {FIELD_LIMITS.message.toLocaleString("ko-KR")}
          </span>
        }
      >
        <textarea
          {...describedBy("message", { hint: true, error: errors.message })}
          rows={5}
          placeholder={FORM.messagePlaceholders[inquiryType]}
          maxLength={FIELD_LIMITS.message}
          className={`${inputClass} min-h-36 py-3 leading-[1.7]`}
        />
      </Field>

      <div className="space-y-3">
        <label className="group/cb flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-[1.6] text-ink-body">
          <input type="checkbox" name="nda" className={`mt-0.5 ${checkboxClass}`} />
          <span>{FORM.fields.nda.label}</span>
        </label>
        <ConsentField error={errors.consent} />
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
          {result?.status === "stale" ? (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 inline-flex h-11 items-center rounded-sm border border-line-strong px-4 text-sm font-semibold text-ink hover:bg-ink hover:text-canvas outline-hidden focus-visible:ring-2 focus-visible:ring-ink"
            >
              {FORM.reload}
            </button>
          ) : null}
          {SITE.contactEmail ? <p className="mt-1">{FORM.fallbackEmail(SITE.contactEmail)}</p> : null}
        </div>
      ) : null}

      <div className="space-y-3">
        {/* 스크립트가 준비되기 전에는 비활성화합니다. 그 전에 제출되면 서버 액션이 아니라 페이지로 POST되어 문의가 사라집니다.
            form의 method="post"는 그래도 제출됐을 때 입력 내용이 주소창·방문 기록에 남지 않게 하는 이중 장치입니다. */}
        <button
          type="submit"
          disabled={!ready}
          aria-disabled={isPending || undefined}
          aria-busy={isPending || undefined}
          className="inline-flex h-12 w-full items-center justify-center rounded-sm bg-ink text-[15px] font-semibold text-canvas transition-colors hover:bg-neutral-300 disabled:cursor-wait disabled:opacity-70 aria-disabled:cursor-wait aria-disabled:opacity-70 outline-hidden focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          {isPending ? FORM.submitting : FORM.submit}
        </button>
        <p className="text-center text-[13px] text-ink-muted">{FORM.submitNote}</p>
      </div>
    </form>
  );
}
