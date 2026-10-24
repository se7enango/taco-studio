"use client";

import { unstable_isUnrecognizedActionError } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type SubmitEvent,
} from "react";
import { submitInquiry, type SubmitResult } from "@/actions/submit-inquiry";
import { FORM, INQUIRY_TYPE_LABELS, PRIVACY, SITE } from "@/content/site";
import {
  FIELD_LIMITS,
  FIELD_ORDER,
  hasErrors,
  INQUIRY_TYPES,
  parseInquiryForm,
  toInquirySource,
  toInquiryType,
  validateInquiry,
  type FieldErrors,
  type InquiryInput,
  type InquirySource,
  type InquiryType,
} from "@/lib/contact/schema";
import { keepTogether } from "@/lib/typography";
import { describedBy, Field, FieldError, fieldId, inputClass } from "./field";
import { SuccessPanel } from "./success-panel";

type Result = SubmitResult | { status: "network" } | { status: "stale"; saved: boolean };
type Draft = Partial<InquiryInput> & { elapsedMs?: number };
type TextField = "company" | "name" | "title" | "email" | "phone";

/** 한 줄 입력란에서 휴대폰 키보드의 '다음'(Enter)을 누르면 옮겨 갈 칸. 화면 순서와 같습니다. */
const NEXT_FIELD: Record<TextField, string> = { company: "name", name: "title", title: "email", email: "phone", phone: "message" };

/** 사이트가 새로 배포되어 이 화면에서 보낼 수 없을 때, 새로고침해도 입력이 남도록 잠시 보관합니다. */
const DRAFT_KEY = "taco-inquiry-draft";

/** 저장소를 쓸 수 없는 환경(사이트 데이터 차단 등)에서는 false를 돌려줍니다. */
function saveDraft(draft: Draft): boolean {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

function takeDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    sessionStorage.removeItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function checkedType(form: HTMLFormElement | null): InquiryType {
  return toInquiryType(new FormData(form ?? undefined).get("inquiryType"));
}

function selectType(form: HTMLFormElement | null, type: InquiryType) {
  const radio = form?.querySelector<HTMLInputElement>(`input[name="inquiryType"][value="${type}"]`);
  if (radio) radio.checked = true;
}

function restoreDraft(form: HTMLFormElement, draft: Draft) {
  for (const name of ["company", "name", "title", "email", "phone", "message"] as const) {
    const field = form.elements.namedItem(name);
    const value = draft[name];
    if (typeof value === "string" && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
      field.value = value;
    }
  }
  for (const name of ["nda", "consent"] as const) {
    const box = form.elements.namedItem(name);
    if (box instanceof HTMLInputElement) box.checked = draft[name] === true;
  }
  if (draft.inquiryType) selectType(form, toInquiryType(draft.inquiryType));
}

function focusFirstError(errors: FieldErrors) {
  const first = FIELD_ORDER.find((field) => errors[field]);
  if (first) document.getElementById(fieldId(first))?.focus();
}

/** 어두운 배경에서 기본 체크박스(accent-color)가 회색 사각형으로 보여 비활성처럼 보이므로 직접 그립니다. 고대비 모드에서는 기본 모양으로 돌아갑니다. */
const checkboxClass =
  "grid size-5 shrink-0 cursor-pointer appearance-none place-content-center rounded-xs border border-line-strong bg-canvas transition-colors checked:border-ink checked:bg-ink before:size-3 before:scale-0 before:bg-canvas before:transition-transform before:content-[''] before:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0%,43%_62%)] checked:before:scale-100 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface aria-invalid:border-danger forced-colors:appearance-auto";

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
  const [result, setResult] = useState<Result | null>(null);
  const [submitted, setSubmitted] = useState<InquiryInput | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const focusAfterReset = useRef(false);
  /** 새로고침 전 화면에서 이미 머문 시간. 복원한 입력을 바로 다시 보내도 자동 제출로 의심받지 않게 합니다. */
  const elapsedBeforeReload = useRef(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const form = formRef.current;
      if (!form) return;

      const draft = takeDraft();
      if (draft) {
        restoreDraft(form, draft);
        if (draft.source) setSource(toInquirySource(draft.source));
        elapsedBeforeReload.current = typeof draft.elapsedMs === "number" ? draft.elapsedMs : 0;
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

    // 페이지 곳곳의 상담 요청 링크(data-cta)를 누르면 진입 경로와 문의 분야를 기록합니다.
    // '아직 정하지 않음' 링크는 방문자가 이미 고른 분야를 덮어쓰지 않습니다.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[data-cta]");
      if (!link) return;
      setSource(toInquirySource(link.dataset.cta));
      // 'NDA부터 체결하기' 링크는 체크박스를 켜 둡니다(끄지는 않습니다).
      if (link.dataset.nda) {
        const box = formRef.current?.elements.namedItem("nda");
        if (box instanceof HTMLInputElement) box.checked = true;
      }
      if (!link.dataset.inquiry) return;
      const next = toInquiryType(link.dataset.inquiry);
      if (next === "undecided" && checkedType(formRef.current) !== "undecided") return;
      selectType(formRef.current, next);
      setInquiryType(next);
    };
    document.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
    };
  }, []);

  // '다른 문의 남기기' 뒤 다시 나타난 양식으로 포커스를 옮깁니다.
  useEffect(() => {
    if (result || !focusAfterReset.current) return;
    focusAfterReset.current = false;
    formRef.current?.querySelector<HTMLInputElement>('input[name="inquiryType"]:checked')?.focus();
  }, [result]);

  const readInput = (): InquiryInput => ({
    ...parseInquiryForm(new FormData(formRef.current ?? undefined)).input,
    source,
  });

  // 오류는 제출할 때만 새로 표시하고, 입력을 고치는 즉시 지웁니다.
  // 포커스를 잃을 때 검사하면 제출 버튼을 누르는 순간 레이아웃이 밀려 클릭이 사라지기 때문입니다.
  const handleChange = (event: ChangeEvent<HTMLFormElement>) => {
    const target = event.target as unknown as HTMLInputElement | HTMLTextAreaElement;
    if (target.name === "inquiryType") setInquiryType(toInquiryType(target.value));
    if (target.name === "message") setMessageLength(target.value.length);
    if (!attempted) return;
    const stillInvalid = validateInquiry(readInput());
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
        if (unstable_isUnrecognizedActionError(error)) {
          setResult({ status: "stale", saved: saveDraft({ ...input, elapsedMs }) });
        } else if (error instanceof TypeError || !navigator.onLine) {
          // fetch 자체가 실패한 경우만 연결 문제로 안내합니다. 요청 제한(429)·서버 오류는 일반 실패로 봅니다.
          setResult({ status: "network" });
        } else {
          setResult({ status: "failed" });
        }
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
    setConsentOpen(false);
  };

  if (result?.status === "success" && submitted) {
    return (
      <SuccessPanel
        inquiryId={result.inquiryId}
        name={submitted.name}
        email={submitted.email}
        nda={submitted.nda}
        onReset={reset}
      />
    );
  }

  const errorCount = Object.keys(errors).length;
  const failure =
    result?.status === "failed"
      ? FORM.failed
      : result?.status === "network"
        ? FORM.network
        : result?.status === "stale"
          ? result.saved
            ? FORM.stale
            : FORM.staleUnsaved
          : null;

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
    <form
      ref={formRef}
      method="post"
      noValidate
      aria-labelledby="contact-title"
      onSubmit={handleSubmit}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="space-y-6"
    >
      <p className="text-sm text-ink-muted">{keepTogether(FORM.intro)}</p>

      <div aria-live="polite" className="empty:sr-only">
        {attempted && errorCount > 0 ? (
          <p key={submitCount} className="rounded-sm border border-danger/40 p-4 text-sm text-ink-body">
            {FORM.errorSummary(errorCount)}
          </p>
        ) : null}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">{FORM.typeLegend}</legend>
        <div className="grid gap-2">
          {INQUIRY_TYPES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-start gap-3 rounded-sm border border-line-strong p-4 transition-colors hover:border-ink-muted has-checked:border-ink has-checked:ring-1 has-checked:ring-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-transparent has-focus-visible:ring-2 has-focus-visible:ring-ink has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-surface forced-colors:has-checked:border-[Highlight]"
            >
              <input
                type="radio"
                name="inquiryType"
                value={type}
                defaultChecked={inquiryType === type}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="mt-1 grid size-4 shrink-0 place-items-center rounded-full border border-line-strong peer-checked:border-ink peer-checked:[&>span]:block"
              >
                <span className="hidden size-2 rounded-full bg-ink forced-colors:bg-[CanvasText]" />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-ink">
                  {keepTogether(INQUIRY_TYPE_LABELS[type].title)}
                </span>
                <span className="mt-0.5 block text-[13px] text-ink-muted">
                  {keepTogether(INQUIRY_TYPE_LABELS[type].description)}
                </span>
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
        <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-[1.6] text-ink-body">
          <input type="checkbox" name="nda" className={`mt-0.5 ${checkboxClass}`} />
          <span>{FORM.fields.nda.label}</span>
        </label>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-x-4">
            <label className="flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-[1.6] text-ink">
              <input
                {...describedBy("consent", { error: errors.consent })}
                type="checkbox"
                required
                className={`mt-0.5 ${checkboxClass}`}
              />
              <span>{FORM.fields.consent.label}</span>
            </label>
            <button
              type="button"
              aria-expanded={consentOpen}
              aria-controls="consent-panel"
              onClick={() => setConsentOpen((open) => !open)}
              className="group ml-8 inline-flex min-h-11 items-start pt-0.5 text-sm leading-[1.6] text-ink-muted underline underline-offset-4 hover:text-ink outline-hidden"
            >
              {/* 포커스 표시는 44px 누름 영역이 아니라 글자에 맞춰 그립니다. */}
              <span className="-mx-1.5 rounded-xs px-1.5 group-focus-visible:ring-2 group-focus-visible:ring-ink">
                {FORM.fields.consent.toggle}
              </span>
            </button>
          </div>
          <FieldError name="consent" error={errors.consent} />
          <div
            id="consent-panel"
            hidden={!consentOpen}
            className="mt-2 space-y-1 rounded-sm border border-line p-4 text-[13px] leading-[1.7] text-ink-body"
          >
            <p>{keepTogether(`수집 항목: (필수) ${PRIVACY.required} / (선택) ${PRIVACY.optional}`)}</p>
            <p>{keepTogether(`이용 목적: ${PRIVACY.purpose}`)}</p>
            <p>{keepTogether(`보유 기간: ${PRIVACY.retention}`)}</p>
            <p>{keepTogether(`처리 위탁·국외 이전: ${PRIVACY.processors}`)}</p>
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
