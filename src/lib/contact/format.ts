import { CTA_SOURCES, INQUIRY_TYPE_LABELS } from "@/content/site";
import type { InquiryInput } from "./schema";

export type Inquiry = InquiryInput & { id: string; receivedAt: string };

/** Discord 메시지 한도(2,000자)를 넘지 않도록 문의 내용은 이 길이에서 자릅니다. */
export const DISCORD_MESSAGE_EXCERPT = 1200;
export const DISCORD_CONTENT_LIMIT = 2000;

export function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

/** 예: "2026-10-23 14:05 KST" */
export function formatKst(iso: string): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(iso))
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute} KST`;
}

/** Slack mrkdwn에서 `<!channel>`, `<@U123>`, 링크 문법이 동작하지 않도록 제어 문자를 이스케이프합니다. */
export function escapeSlack(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Discord 마크다운 문법 문자를 이스케이프합니다. 멘션은 allowed_mentions로 따로 막습니다. */
export function escapeDiscord(value: string): string {
  return value.replace(/[\\*_~`|>[\]()#-]/g, "\\$&");
}

function lines(inquiry: Inquiry, message: string): [string, string][] {
  const person = inquiry.title ? `${inquiry.name} / ${inquiry.title}` : inquiry.name;
  return [
    ["문의 분야", INQUIRY_TYPE_LABELS[inquiry.inquiryType].title],
    ["회사", inquiry.company],
    ["성함/직함", person],
    ["이메일", inquiry.email],
    ["연락처", inquiry.phone || "미기재 (이메일 회신)"],
    ["NDA 선체결", inquiry.nda ? "희망" : "아니오"],
    ["진입 경로", CTA_SOURCES[inquiry.source]],
    ["접수", formatKst(inquiry.receivedAt)],
    ["내용", message || "(없음)"],
  ];
}

export function toSlackPayload(inquiry: Inquiry) {
  const body = lines(inquiry, inquiry.message)
    .map(([label, value]) => `${label}: ${escapeSlack(value)}`)
    .join("\n");
  return {
    text: `[Taco Studio 상담 요청] #${inquiry.id}\n${body}`,
    unfurl_links: false,
    unfurl_media: false,
  };
}

export function toDiscordPayload(inquiry: Inquiry) {
  const body = lines(inquiry, truncate(inquiry.message, DISCORD_MESSAGE_EXCERPT))
    .map(([label, value]) => `${label}: ${escapeDiscord(value)}`)
    .join("\n");
  return {
    content: truncate(`[Taco Studio 상담 요청] #${inquiry.id}\n${body}`, DISCORD_CONTENT_LIMIT - 1),
    allowed_mentions: { parse: [] as string[] },
  };
}
