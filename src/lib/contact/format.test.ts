import { describe, expect, test } from "bun:test";
import { DISCORD_CONTENT_LIMIT, DISCORD_EMBED_LIMIT, formatKst, toDiscordPayload, toSlackPayload, type Inquiry } from "./format";

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
  elapsedMs: 42_000,
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
    expect(payload.embeds[0].description).toContain("\\*\\*굵게\\*\\*");
  });

  test("가장 긴 입력에서도 한도를 넘지 않고, 2,000자 문의 내용을 자르지 않는다", () => {
    const message = "#".repeat(1999) + "끝";
    const long: Inquiry = {
      ...inquiry,
      company: "*".repeat(100),
      name: "_".repeat(50),
      title: "~".repeat(50),
      email: `${"a".repeat(240)}@b.co`,
      phone: "0".repeat(20),
      message,
    };
    const payload = toDiscordPayload(long);
    expect(payload.content.length).toBeLessThanOrEqual(DISCORD_CONTENT_LIMIT);
    expect(payload.embeds[0].description.length).toBeLessThanOrEqual(DISCORD_EMBED_LIMIT);
    expect(payload.embeds[0].description.endsWith("끝")).toBe(true);
  });
});

describe("자동 제출 의심", () => {
  test("너무 빨리 제출된 문의는 버리지 않고 확인 필요 표시를 붙인다", () => {
    const fast = { ...inquiry, elapsedMs: 1200 };
    expect(toSlackPayload(fast).text).toContain("확인 필요: 페이지를 연 지 1.2초 만에 제출되었습니다");
    expect(toDiscordPayload(fast).content).toContain("확인 필요");
    expect(toSlackPayload(inquiry).text).not.toContain("확인 필요");
  });
});
