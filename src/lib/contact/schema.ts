/**
 * 상담 요청 입력값의 정규화와 검증.
 * 클라이언트(즉시 피드백)와 서버 액션(최종 판단)이 같은 규칙을 공유합니다. 외부 의존성은 없습니다.
 */

export const INQUIRY_TYPES = ["onprem", "custom", "undecided"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_SOURCES = [
  "header",
  "hero",
  "preview",
  "service-onprem",
  "service-custom",
  "services-undecided",
  "process",
  "security",
  "faq",
  "link",
  "direct",
] as const;
export type InquirySource = (typeof INQUIRY_SOURCES)[number];

export const FIELD_LIMITS = {
  company: 100,
  name: 50,
  title: 50,
  email: 254,
  phone: 20,
  message: 2000,
} as const;

/** 검증 오류를 표시하는 필드. 순서는 화면 순서와 같아야 첫 오류 필드로 포커스가 이동합니다. */
export const FIELD_ORDER = ["company", "name", "title", "email", "phone", "message", "consent"] as const;
export type FieldName = (typeof FIELD_ORDER)[number];
export type FieldErrors = Partial<Record<FieldName, string>>;

export type InquiryInput = {
  inquiryType: InquiryType;
  company: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  message: string;
  nda: boolean;
  consent: boolean;
  source: InquirySource;
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_PATTERN = /^[0-9+\-() ]{8,20}$/;

/**
 * 페이지를 연 뒤 이 시간 안에 제출되면 자동 제출을 의심합니다.
 * 사람일 수도 있으므로 버리지 않고, 알림에 '확인 필요' 표시를 붙여 전달합니다.
 */
export const MIN_ELAPSED_MS = 3000;

const MESSAGES = {
  companyRequired: "회사명 또는 기관명을 입력해 주세요.",
  nameRequired: "성함을 입력해 주세요.",
  emailRequired: "회신받으실 이메일을 입력해 주세요.",
  emailInvalid: "이메일 주소 형식을 확인해 주세요. 예: name@company.co.kr",
  phoneInvalid: "연락처는 숫자와 하이픈(-)으로 입력해 주세요.",
  consentRequired: "개인정보 수집·이용에 동의하셔야 접수할 수 있습니다.",
  tooLong: (max: number) => `${max.toLocaleString("ko-KR")}자 이내로 입력해 주세요.`,
};

function oneOf<T extends string>(value: string, allowed: readonly T[], fallback: T): T {
  return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export function toInquiryType(value: unknown): InquiryType {
  return oneOf(typeof value === "string" ? value : "", INQUIRY_TYPES, "undecided");
}

export function toInquirySource(value: unknown): InquirySource {
  return oneOf(typeof value === "string" ? value : "", INQUIRY_SOURCES, "direct");
}

export function validateInquiry(input: InquiryInput): FieldErrors {
  const errors: FieldErrors = {};

  // 길이를 먼저 봅니다. EMAIL_PATTERN은 입력 길이의 제곱에 비례해 느려지므로(1MB면 수 분), 한도 안의 값에만 적용합니다.
  for (const [field, max] of Object.entries(FIELD_LIMITS) as [keyof typeof FIELD_LIMITS, number][]) {
    if (input[field].length > max) errors[field] = MESSAGES.tooLong(max);
  }

  if (!input.company) errors.company = MESSAGES.companyRequired;
  if (!input.name) errors.name = MESSAGES.nameRequired;
  if (!input.email) errors.email = MESSAGES.emailRequired;
  else if (!errors.email && !EMAIL_PATTERN.test(input.email)) errors.email = MESSAGES.emailInvalid;
  if (input.phone && !errors.phone && !PHONE_PATTERN.test(input.phone)) errors.phone = MESSAGES.phoneInvalid;

  if (!input.consent) errors.consent = MESSAGES.consentRequired;
  return errors;
}

/** 글자 방향을 뒤집어 보이게 하는 제어 문자. 알림에서 이메일·이름을 다르게 보이게 하는 데 쓰일 수 있습니다. */
const BIDI_CONTROLS = /[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g;

/**
 * FormData 값은 문자열이 아닐 수도 있으므로(File 등) 문자열이 아니면 빈 값으로 취급합니다.
 * 전송 과정에서 줄바꿈이 CRLF로 바뀌므로, 브라우저와 같은 LF로 되돌린 뒤 길이를 셉니다.
 * 한 줄 입력란(회사·성함 등)은 줄바꿈을 공백으로 바꿔, 알림에 가짜 항목 줄을 끼워 넣지 못하게 합니다.
 */
function text(formData: FormData, key: string, multiline = false): string {
  const value = formData.get(key);
  if (typeof value !== "string") return "";
  const clean = value.replace(/\r\n?/g, "\n").replace(BIDI_CONTROLS, "");
  return (multiline ? clean : clean.replace(/\s+/g, " ")).trim();
}

export type ParsedInquiryForm = {
  input: InquiryInput;
  honeypot: string;
  elapsedMs: number;
};

export function parseInquiryForm(formData: FormData): ParsedInquiryForm {
  const elapsed = Number(text(formData, "elapsedMs"));
  return {
    input: {
      inquiryType: toInquiryType(text(formData, "inquiryType")),
      company: text(formData, "company"),
      name: text(formData, "name"),
      title: text(formData, "title"),
      email: text(formData, "email"),
      phone: text(formData, "phone"),
      message: text(formData, "message", true),
      nda: text(formData, "nda") === "on",
      consent: text(formData, "consent") === "on",
      source: toInquirySource(text(formData, "source")),
    },
    honeypot: text(formData, "website"),
    elapsedMs: Number.isFinite(elapsed) ? elapsed : 0,
  };
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
