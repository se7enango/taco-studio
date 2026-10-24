import { useEffect, type RefObject } from "react";
import { CTA_SELECTOR, readCtaIntent } from "@/lib/contact/cta";
import type { InquirySource, InquiryType } from "@/lib/contact/schema";
import { checkedType, selectType, setChecked } from "./form-dom";

/**
 * 페이지 곳곳의 상담 요청 링크(data-cta)를 누르면 진입 경로와 문의 분야를 양식에 반영합니다.
 * '아직 정하지 않음' 링크는 방문자가 이미 고른 분야를 덮어쓰지 않고, NDA 링크는 체크박스를 켜기만 합니다.
 */
export function useCtaWiring(
  formRef: RefObject<HTMLFormElement | null>,
  onSource: (source: InquirySource) => void,
  onType: (type: InquiryType) => void,
) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>(CTA_SELECTOR) : null;
      if (!link) return;
      const intent = readCtaIntent(link.dataset);
      onSource(intent.source);
      if (intent.nda) setChecked(formRef.current, "nda", true);
      if (!intent.inquiry) return;
      if (intent.inquiry === "undecided" && checkedType(formRef.current) !== "undecided") return;
      selectType(formRef.current, intent.inquiry);
      onType(intent.inquiry);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [formRef, onSource, onType]);
}
