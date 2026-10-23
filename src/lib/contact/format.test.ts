import { describe, expect, test } from "bun:test";
import { DISCORD_CONTENT_LIMIT, formatKst, toDiscordPayload, toSlackPayload, type Inquiry } from "./format";

const inquiry: Inquiry = {
  id: "abcd1234",
  receivedAt: "2026-10-23T05:05:00.000Z",
  inquiryType: "custom",
  company: "<!channel> ACME",
  name: "@everyone",
  title: "팀장",
  email: "a@b.co",
  phone: "",
  message: "**굵게** <https://evil.example|클릭>",
  nda: true,
  consent: true,
  source: "service-custom",
};

describe("formatKst", () => {
  test("한국 시간으로 표시한다", () => {
    expect(formatKst(inquiry.receivedAt)).toBe("2026-10-23 14:05 KST");
  });
});

describe("toSlackPayload", () => {
  test("Slack 멘션과 링크 문법을 무력화한다", () => {
    const { text } = toSlackPayload(inquiry);
    expect(text).not.toContain("<!channel>");
    expect(text).toContain("&lt;!channel&gt; ACME");
    expect(text).not.toContain("<https://");
    expect(text).toContain("문의 분야: 맞춤 소프트웨어·AI 개발");
    expect(text).toContain("진입 경로: 서비스 B 카드");
    expect(text).toContain("연락처: 미기재 (이메일 회신)");
    expect(text).toContain("NDA 선체결: 희망");
  });
});

describe("toDiscordPayload", () => {
  test("멘션을 막고 마크다운을 이스케이프한다", () => {
    const payload = toDiscordPayload(inquiry);
    expect(payload.allowed_mentions).toEqual({ parse: [] });
    expect(payload.content).toContain("\\*\\*굵게\\*\\*");
  });

  test("가장 긴 입력에서도 2,000자를 넘지 않는다", () => {
    const long: Inquiry = {
      ...inquiry,
      company: "*".repeat(100),
      name: "_".repeat(50),
      title: "~".repeat(50),
      email: `${"a".repeat(240)}@b.co`,
      phone: "0".repeat(20),
      message: "#".repeat(2000),
    };
    expect(toDiscordPayload(long).content.length).toBeLessThanOrEqual(DISCORD_CONTENT_LIMIT);
  });
});
