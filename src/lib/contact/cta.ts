import { toInquirySource, toInquiryType, type InquirySource, type InquiryType } from "./schema";

/**
 * 상담 요청 링크가 문의 양식에 전하는 정보.
 * 링크(ui/links.tsx, header-cta.tsx)는 data-* 속성으로 싣고, 문의 양식이 클릭을 받아 읽습니다.
 */
export type CtaIntent = {
  /** 문의 알림의 '진입 경로' */
  cta?: InquirySource;
  /** 문의 양식의 '문의 분야'를 이 값으로 바꿉니다. */
  inquiry?: InquiryType;
  /** 'NDA 먼저 체결' 체크박스를 켭니다(끄지는 않습니다). */
  nda?: boolean;
};

export const CTA_SELECTOR = "a[data-cta]";

export function ctaAttributes({ cta, inquiry, nda }: CtaIntent) {
  return { "data-cta": cta, "data-inquiry": inquiry, "data-nda": nda ? "true" : undefined };
}

export function readCtaIntent(dataset: DOMStringMap): { source: InquirySource; inquiry?: InquiryType; nda: boolean } {
  return {
    source: toInquirySource(dataset.cta),
    inquiry: dataset.inquiry ? toInquiryType(dataset.inquiry) : undefined,
    nda: dataset.nda === "true",
  };
}
