import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import { submitInquiry } from "./submit-inquiry";

function form(extra: Record<string, string> = {}) {
  const data = new FormData();
  const base = { company: "ACME", name: "홍길동", email: "a@b.co.kr", consent: "on", elapsedMs: "10000", ...extra };
  for (const [key, value] of Object.entries(base)) data.set(key, value);
  return data;
}

const originalFetch = globalThis.fetch;
const env = { ...process.env };
let fetchCalls: string[] = [];
const logs: { warn: unknown[][]; error: unknown[][]; info: unknown[][] } = { warn: [], error: [], info: [] };

function respond(handler: (url: string) => Response) {
  globalThis.fetch = mock(async (input: string | URL | Request) => {
    fetchCalls.push(String(input));
    return handler(String(input));
  }) as unknown as typeof fetch;
}

beforeEach(() => {
  fetchCalls = [];
  logs.warn = []; logs.error = []; logs.info = [];
  delete process.env.SLACK_WEBHOOK_URL;
  delete process.env.DISCORD_WEBHOOK_URL;
  spyOn(console, "warn").mockImplementation((...a) => void logs.warn.push(a));
  spyOn(console, "error").mockImplementation((...a) => void logs.error.push(a));
  spyOn(console, "info").mockImplementation((...a) => void logs.info.push(a));
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env = { ...env };
  mock.restore();
});

describe("submitInquiry", () => {
  test("검증에 실패하면 알림을 보내지 않고 필드 오류를 돌려준다", async () => {
    respond(() => new Response("ok"));
    process.env.SLACK_WEBHOOK_URL = "https://slack.test";
    const result = await submitInquiry(form({ email: "nope", consent: "" }));
    expect(result).toEqual({ status: "invalid", fieldErrors: expect.objectContaining({ email: expect.any(String), consent: expect.any(String) }) });
    expect(fetchCalls).toEqual([]);
  });

  test("허니팟이 채워지면 성공처럼 응답하지만 알림은 보내지 않는다", async () => {
    respond(() => new Response("ok"));
    process.env.SLACK_WEBHOOK_URL = "https://slack.test";
    const result = await submitInquiry(form({ website: "http://spam" }));
    expect(result.status).toBe("success");
    expect(fetchCalls).toEqual([]);
    expect(logs.warn[0][0]).toBe("INQUIRY_DROPPED_HONEYPOT");
  });

  test("채널이 없으면 로그에만 남기고 성공으로 처리한다", async () => {
    respond(() => { throw new Error("should not be called"); });
    const result = await submitInquiry(form());
    expect(result).toEqual({ status: "success", inquiryId: expect.stringMatching(/^[0-9a-f]{8}$/) });
    expect(logs.warn[0][0]).toBe("INQUIRY_LOG_ONLY");
    expect(JSON.parse(String(logs.warn[0][1]))).toMatchObject({ company: "ACME", email: "a@b.co.kr" });
  });

  test("설정된 채널이 모두 실패하면 failed를 돌려주고 문의 내용을 오류 로그에 남긴다", async () => {
    respond(() => new Response("", { status: 500 }));
    process.env.SLACK_WEBHOOK_URL = "https://slack.test";
    process.env.DISCORD_WEBHOOK_URL = "https://discord.test";
    expect(await submitInquiry(form())).toEqual({ status: "failed" });
    expect(logs.error[0][0]).toBe("LEAD_NOT_DELIVERED");
    expect(String(logs.error[0][2])).toContain("ACME");
  });

  test("한 채널만 성공해도 성공이다", async () => {
    respond((url) => (url.includes("slack") ? new Response("ok") : new Response("", { status: 500 })));
    process.env.SLACK_WEBHOOK_URL = "https://slack.test";
    process.env.DISCORD_WEBHOOK_URL = "https://discord.test";
    const result = await submitInquiry(form({ source: "hero", inquiryType: "onprem" }));
    expect(result.status).toBe("success");
    expect(JSON.parse(String(logs.info[0][0]))).toMatchObject({ evt: "INQUIRY_DELIVERED", channels: ["slack"], source: "hero", type: "onprem", suspectedBot: false });
  });
});
