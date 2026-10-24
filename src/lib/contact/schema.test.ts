import { describe, expect, test } from "bun:test";
import { FIELD_LIMITS, parseInquiryForm, validateInquiry, type InquiryInput } from "./schema";

const valid: InquiryInput = {
  inquiryType: "onprem",
  company: "주식회사 테스트",
  name: "홍길동",
  title: "",
  email: "hong@test.co.kr",
  phone: "",
  message: "",
  nda: false,
  consent: true,
  source: "hero",
};

function form(entries: Record<string, string | Blob>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.set(key, value);
  return data;
}

describe("validateInquiry", () => {
  test("필수 항목만 채우면 통과한다", () => {
    expect(validateInquiry(valid)).toEqual({});
  });

  test("필수 항목과 동의가 없으면 각각 오류를 낸다", () => {
    const errors = validateInquiry({ ...valid, company: "", name: "", email: "", consent: false });
    expect(Object.keys(errors).sort()).toEqual(["company", "consent", "email", "name"]);
  });

  test("이메일 형식을 검사한다", () => {
    expect(validateInquiry({ ...valid, email: "hong@test" }).email).toContain("형식");
    expect(validateInquiry({ ...valid, email: "a b@test.com" }).email).toBeDefined();
  });

  test("연락처는 입력했을 때만 형식을 검사한다", () => {
    expect(validateInquiry({ ...valid, phone: "010-1234-5678" }).phone).toBeUndefined();
    expect(validateInquiry({ ...valid, phone: "전화주세요" }).phone).toBeDefined();
  });

  test("길이 제한을 넘으면 오류를 낸다", () => {
    const errors = validateInquiry({ ...valid, message: "가".repeat(FIELD_LIMITS.message + 1) });
    expect(errors.message).toBe("2,000자 이내로 입력해 주세요.");
  });
});

describe("parseInquiryForm", () => {
  test("문자열이 아닌 값과 알 수 없는 값은 안전한 기본값으로 바꾼다", () => {
    const { input, elapsedMs } = parseInquiryForm(
      form({
        company: new Blob(["x"]),
        inquiryType: "<script>",
        source: "evil",
        elapsedMs: "abc",
        consent: "yes",
      }),
    );
    expect(input.company).toBe("");
    expect(input.inquiryType).toBe("undecided");
    expect(input.source).toBe("direct");
    expect(input.consent).toBe(false);
    expect(elapsedMs).toBe(0);
  });

  test("값의 앞뒤 공백을 제거하고 체크박스를 boolean으로 바꾼다", () => {
    const { input, honeypot } = parseInquiryForm(
      form({ company: "  ACME  ", nda: "on", consent: "on", website: "spam", elapsedMs: "5000" }),
    );
    expect(input.company).toBe("ACME");
    expect(input.nda).toBe(true);
    expect(input.consent).toBe(true);
    expect(honeypot).toBe("spam");
  });
});

describe("전송 과정의 줄바꿈", () => {
  test("multipart 전송으로 CRLF가 되어도 화면과 같은 길이로 센다", async () => {
    const message = Array.from({ length: 40 }, () => "가".repeat(48)).join("\n"); // 1,959자, 줄바꿈 39개
    expect(message.length).toBeLessThanOrEqual(FIELD_LIMITS.message);
    const sent = form({ company: "ACME", name: "홍길동", email: "a@b.co.kr", consent: "on", message });
    const received = await new Request("http://localhost/", { method: "POST", body: sent }).formData();
    const { input } = parseInquiryForm(received);
    expect(input.message).toBe(message);
    expect(validateInquiry({ ...input, source: "direct" }).message).toBeUndefined();
  });
});
