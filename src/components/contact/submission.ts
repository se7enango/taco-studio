import { unstable_isUnrecognizedActionError } from "next/navigation";
import type { SubmitResult } from "@/actions/submit-inquiry";
import { FORM } from "@/content/site";

export type FormResult = SubmitResult | { status: "network" } | { status: "stale"; saved: boolean };

/**
 * 서버 액션 호출이 예외로 끝난 이유. fetch 자체가 실패한 경우만 연결 문제로 안내하고,
 * 요청 제한(429)·서버 오류는 일반 실패로 봅니다.
 */
export function classifySubmitError(error: unknown, online: boolean): "stale" | "network" | "failed" {
  if (unstable_isUnrecognizedActionError(error)) return "stale";
  if (error instanceof TypeError || !online) return "network";
  return "failed";
}

export function failureMessage(result: FormResult | null): string | null {
  switch (result?.status) {
    case "failed":
      return FORM.failed;
    case "network":
      return FORM.network;
    case "stale":
      return result.saved ? FORM.stale : FORM.staleUnsaved;
    default:
      return null;
  }
}
