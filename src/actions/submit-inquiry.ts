"use server";

import { isSuspectedBot, type Inquiry } from "@/lib/contact/format";
import { notify } from "@/lib/contact/notify";
import { hasErrors, parseInquiryForm, validateInquiry, type FieldErrors } from "@/lib/contact/schema";

export type SubmitResult =
  | { status: "success"; inquiryId: string }
  | { status: "invalid"; fieldErrors: FieldErrors }
  | { status: "failed" };

function newId() {
  return crypto.randomUUID().slice(0, 8);
}

/**
 * 상담 요청 접수.
 * Next.js의 Origin 검사는 다른 사이트의 브라우저가 대신 보내는 요청(CSRF)을 막을 뿐, 스크립트로 직접 보내는 요청은 막지 못합니다.
 * 대량 전송은 호스팅 단의 요청 수 제한으로 막습니다(README 참고).
 */
export async function submitInquiry(formData: FormData): Promise<SubmitResult> {
  const { input, honeypot, elapsedMs } = parseInquiryForm(formData);
  const id = newId();

  const fieldErrors = validateInquiry(input);
  if (hasErrors(fieldErrors)) return { status: "invalid", fieldErrors };

  const inquiry: Inquiry = { ...input, id, receivedAt: new Date().toISOString(), elapsedMs };
  const record = JSON.stringify(inquiry);

  // 사람에게 보이지 않는 필드가 채워졌다면 봇으로 보고 알림을 보내지 않습니다.
  // 응답은 정상 접수와 똑같이 돌려주고(봇이 우회 방법을 학습하지 못하도록), 혹시 모를 오탐에 대비해 기록은 남깁니다.
  if (honeypot) {
    console.warn("INQUIRY_DROPPED_HONEYPOT", record);
    return { status: "success", inquiryId: id };
  }

  const result = await notify(inquiry);

  if (result.attempted === 0) {
    // 알림 채널이 없으면 런타임 로그가 유일한 기록입니다. README의 출시 체크리스트를 참고하세요.
    console.warn("INQUIRY_LOG_ONLY", record);
    return { status: "success", inquiryId: id };
  }

  if (result.delivered.length === 0) {
    console.error("LEAD_NOT_DELIVERED", JSON.stringify(result.failed), record);
    return { status: "failed" };
  }

  console.info(
    JSON.stringify({
      evt: "INQUIRY_DELIVERED",
      id,
      type: inquiry.inquiryType,
      source: inquiry.source,
      suspectedBot: isSuspectedBot(inquiry),
      channels: result.delivered,
      failed: result.failed,
    }),
  );
  return { status: "success", inquiryId: id };
}
