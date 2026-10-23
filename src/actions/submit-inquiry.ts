"use server";

import { truncate, type Inquiry } from "@/lib/contact/format";
import { notify } from "@/lib/contact/notify";
import { hasErrors, MIN_ELAPSED_MS, parseInquiryForm, validateInquiry, type FieldErrors } from "@/lib/contact/schema";

export type SubmitResult =
  | { status: "success"; inquiryId: string }
  | { status: "invalid"; fieldErrors: FieldErrors }
  | { status: "failed" };

/** 로그 한 줄이 너무 길어지지 않도록 문의 내용은 잘라서 남깁니다. */
function logRecord(inquiry: Inquiry) {
  return JSON.stringify({ ...inquiry, message: truncate(inquiry.message, 1000) });
}

/**
 * 상담 요청 접수.
 * Next.js가 Origin 검사(CSRF)와 요청 크기 제한(1MB)을 기본으로 적용합니다.
 */
export async function submitInquiry(formData: FormData): Promise<SubmitResult> {
  const { input, honeypot, elapsedMs } = parseInquiryForm(formData);

  // 봇으로 보이는 요청은 성공처럼 응답하고 아무것도 보내지 않습니다(봇이 우회 방법을 학습하지 못하도록).
  if (honeypot || elapsedMs < MIN_ELAPSED_MS) {
    console.info("INQUIRY_DROPPED", honeypot ? "honeypot" : `elapsed=${elapsedMs}`);
    return { status: "success", inquiryId: "0" };
  }

  const fieldErrors = validateInquiry(input);
  if (hasErrors(fieldErrors)) return { status: "invalid", fieldErrors };

  const inquiry: Inquiry = { ...input, id: crypto.randomUUID().slice(0, 8), receivedAt: new Date().toISOString() };
  const result = await notify(inquiry);

  if (result.attempted === 0) {
    // 알림 채널이 없으면 Vercel 런타임 로그가 유일한 기록입니다. README의 출시 체크리스트를 참고하세요.
    console.warn("INQUIRY_LOG_ONLY", logRecord(inquiry));
    return { status: "success", inquiryId: inquiry.id };
  }

  if (result.delivered.length === 0) {
    console.error("LEAD_NOT_DELIVERED", JSON.stringify(result.failed), logRecord(inquiry));
    return { status: "failed" };
  }

  console.info(
    JSON.stringify({
      evt: "INQUIRY_DELIVERED",
      id: inquiry.id,
      type: inquiry.inquiryType,
      source: inquiry.source,
      channels: result.delivered,
      failed: result.failed,
    }),
  );
  return { status: "success", inquiryId: inquiry.id };
}
