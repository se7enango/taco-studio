import { toInquirySource, toInquiryType, type InquiryInput } from "@/lib/contact/schema";
import { selectType, setChecked } from "./form-dom";

/** 사이트가 새로 배포되어 이 화면에서 보낼 수 없을 때, 새로고침해도 입력이 남도록 잠시 보관합니다. */
const DRAFT_KEY = "taco-inquiry-draft";
const TEXT_FIELDS = ["company", "name", "title", "email", "phone", "message"] as const;

export type Draft = Partial<InquiryInput> & { elapsedMs?: number };

/** 저장소 값은 손댈 수 있으므로 모양을 확인해, 맞는 값만 남깁니다. */
export function parseDraft(raw: string | null): Draft | null {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof value !== "object" || value === null) return null;
  const record = value as Record<string, unknown>;
  const draft: Draft = {};
  for (const name of TEXT_FIELDS) if (typeof record[name] === "string") draft[name] = record[name];
  if (typeof record.nda === "boolean") draft.nda = record.nda;
  if (typeof record.consent === "boolean") draft.consent = record.consent;
  if (record.inquiryType !== undefined) draft.inquiryType = toInquiryType(record.inquiryType);
  if (record.source !== undefined) draft.source = toInquirySource(record.source);
  if (typeof record.elapsedMs === "number") draft.elapsedMs = record.elapsedMs;
  return draft;
}

/** 저장소를 쓸 수 없는 환경(사이트 데이터 차단 등)에서는 false를 돌려줍니다. */
export function saveDraft(draft: Draft): boolean {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function takeDraft(): Draft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    sessionStorage.removeItem(DRAFT_KEY);
    return parseDraft(raw);
  } catch {
    return null;
  }
}

export function restoreDraft(form: HTMLFormElement, draft: Draft) {
  for (const name of TEXT_FIELDS) {
    const field = form.elements.namedItem(name);
    const value = draft[name];
    if (value !== undefined && (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) {
      field.value = value;
    }
  }
  setChecked(form, "nda", draft.nda === true);
  setChecked(form, "consent", draft.consent === true);
  if (draft.inquiryType) selectType(form, draft.inquiryType);
}
