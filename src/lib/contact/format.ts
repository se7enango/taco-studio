import { CTA_SOURCES, INQUIRY_TYPE_LABELS } from "@/content/site";
import { MIN_ELAPSED_MS, type InquiryInput } from "./schema";

export type Inquiry = InquiryInput & {
  id: string;
  receivedAt: string;
  /** 페이지를 연 뒤 제출까지 걸린 시간(ms) */
  elapsedMs: number;
};

/** Discord 메시지 본문과 임베드 설명의 길이 한도 */
export const DISCORD_CONTENT_LIMIT = 2000;
export const DISCORD_EMBED_LIMIT = 4096;

export function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function isSuspectedBot(inquiry: Pick<Inquiry, "elapsedMs">): boolean {
  return inquiry.elapsedMs < MIN_ELAPSED_MS;
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

function headerLines(inquiry: Inquiry): [string, string][] {
  const person = inquiry.title ? `${inquiry.name} / ${inquiry.title}` : inquiry.name;
  const lines: [string, string][] = [
    ["문의 분야", INQUIRY_TYPE_LABELS[inquiry.inquiryType].title],
    ["회사", inquiry.company],
    ["성함/직함", person],
    ["이메일", inquiry.email],
    ["연락처", inquiry.phone || "미기재 (이메일 회신)"],
    ["NDA 선체결", inquiry.nda ? "희망" : "아니오"],
    ["진입 경로", CTA_SOURCES[inquiry.source]],
    ["접수", formatKst(inquiry.receivedAt)],
  ];
  if (isSuspectedBot(inquiry)) {
    const seconds = (inquiry.elapsedMs / 1000).toFixed(1);
    lines.unshift(["확인 필요", `페이지를 연 지 ${seconds}초 만에 제출되었습니다 (자동 제출 의심)`]);
  }
  return lines;
}

function title(inquiry: Inquiry) {
  return `[Taco Studio 상담 요청] #${inquiry.id}`;
}

export function toSlackPayload(inquiry: Inquiry) {
  const body = [...headerLines(inquiry), ["내용", inquiry.message || "(없음)"]]
    .map(([label, value]) => `${label}: ${escapeSlack(value)}`)
    .join("\n");
  return {
    text: `${title(inquiry)}\n${body}`,
    unfurl_links: false,
    unfurl_media: false,
  };
}

/** 문의 내용은 본문(2,000자 한도) 대신 임베드(4,096자 한도)에 넣어 잘리지 않게 합니다. */
export function toDiscordPayload(inquiry: Inquiry) {
  const body = headerLines(inquiry)
    .map(([label, value]) => `${label}: ${escapeDiscord(value)}`)
    .join("\n");
  return {
    content: truncate(`${title(inquiry)}\n${body}`, DISCORD_CONTENT_LIMIT),
    embeds: [{ title: "내용", description: truncate(escapeDiscord(inquiry.message) || "(없음)", DISCORD_EMBED_LIMIT) }],
    allowed_mentions: { parse: [] as string[] },
  };
}
