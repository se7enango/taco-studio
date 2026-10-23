import { afterEach, describe, expect, mock, test } from "bun:test";
import type { Inquiry } from "./format";
import { configuredChannels, notify, type Channel } from "./notify";

const inquiry: Inquiry = {
  id: "abcd1234",
  receivedAt: "2026-10-23T05:05:00.000Z",
  inquiryType: "onprem",
  company: "ACME",
  name: "홍길동",
  title: "",
  email: "a@b.co",
  phone: "",
  message: "",
  nda: false,
  consent: true,
  source: "hero",
};

const channel = (name: Channel["name"], url: string): Channel => ({ name, url, payload: () => ({}) });
const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function mockFetch(handler: (url: string) => Promise<Response>) {
  globalThis.fetch = mock((input: string | URL | Request) => handler(String(input))) as unknown as typeof fetch;
}

describe("configuredChannels", () => {
  test("설정된 채널만, 둘 다 있으면 둘 다 반환한다", () => {
    expect(configuredChannels({})).toEqual([]);
    expect(configuredChannels({ SLACK_WEBHOOK_URL: "s", DISCORD_WEBHOOK_URL: "d" }).map((c) => c.name)).toEqual([
      "slack",
      "discord",
    ]);
  });
});

describe("notify", () => {
  test("HTTP 오류 응답은 실패로 센다", async () => {
    mockFetch(async () => new Response("bad", { status: 400 }));
    const result = await notify(inquiry, [channel("slack", "https://slack.test")]);
    expect(result.delivered).toEqual([]);
    expect(result.failed[0]).toEqual({ channel: "slack", reason: "HTTP 400" });
  });

  test("네트워크 오류는 실패로 센다", async () => {
    mockFetch(async () => {
      throw new DOMException("timed out", "TimeoutError");
    });
    const result = await notify(inquiry, [channel("discord", "https://discord.test")]);
    expect(result.failed.map((f) => f.channel)).toEqual(["discord"]);
  });

  test("한 채널만 성공해도 전달된 것으로 본다", async () => {
    mockFetch(async (url) => (url.includes("slack") ? new Response("ok") : new Response("", { status: 500 })));
    const result = await notify(inquiry, [channel("slack", "https://slack.test"), channel("discord", "https://discord.test")]);
    expect(result).toMatchObject({ attempted: 2, delivered: ["slack"] });
    expect(result.failed.map((f) => f.channel)).toEqual(["discord"]);
  });

  test("채널이 없으면 아무것도 보내지 않는다", async () => {
    mockFetch(async () => {
      throw new Error("should not be called");
    });
    expect(await notify(inquiry, [])).toEqual({ attempted: 0, delivered: [], failed: [] });
  });
});
