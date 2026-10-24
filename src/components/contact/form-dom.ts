import { FIELD_ORDER, toInquiryType, type FieldErrors, type InquiryType } from "@/lib/contact/schema";
import { fieldId } from "./field";

/** 문의 양식의 비제어 입력을 DOM에서 직접 읽고 바꾸는 도우미 */

export function checkedType(form: HTMLFormElement | null): InquiryType {
  return toInquiryType(new FormData(form ?? undefined).get("inquiryType"));
}

export function selectType(form: HTMLFormElement | null, type: InquiryType) {
  const radio = form?.querySelector<HTMLInputElement>(`input[name="inquiryType"][value="${type}"]`);
  if (radio) radio.checked = true;
}

export function setChecked(form: HTMLFormElement | null, name: "nda" | "consent", checked: boolean) {
  const box = form?.elements.namedItem(name);
  if (box instanceof HTMLInputElement) box.checked = checked;
}

export function focusFirstError(errors: FieldErrors) {
  const first = FIELD_ORDER.find((field) => errors[field]);
  if (first) document.getElementById(fieldId(first))?.focus();
}
