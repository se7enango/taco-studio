import { toDiscordPayload, toSlackPayload, type Inquiry } from "./format";

export const NOTIFY_TIMEOUT_MS = 5000;

export type Channel = {
  name: "slack" | "discord";
  url: string;
  payload: (inquiry: Inquiry) => unknown;
};

export type NotifyResult = {
  attempted: number;
  delivered: string[];
  failed: { channel: string; reason: string }[];
};

/** 환경 변수에 설정된 알림 채널. 둘 다 설정되어 있으면 둘 다 보냅니다. */
export function configuredChannels(env: Record<string, string | undefined> = process.env): Channel[] {
  const channels: Channel[] = [];
  if (env.SLACK_WEBHOOK_URL) channels.push({ name: "slack", url: env.SLACK_WEBHOOK_URL, payload: toSlackPayload });
  if (env.DISCORD_WEBHOOK_URL) channels.push({ name: "discord", url: env.DISCORD_WEBHOOK_URL, payload: toDiscordPayload });
  return channels;
}

async function send(channel: Channel, inquiry: Inquiry): Promise<void> {
  const res = await fetch(channel.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(channel.payload(inquiry)),
    signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function notify(inquiry: Inquiry, channels: Channel[] = configuredChannels()): Promise<NotifyResult> {
  const results = await Promise.allSettled(channels.map((channel) => send(channel, inquiry)));
  const result: NotifyResult = { attempted: channels.length, delivered: [], failed: [] };
  results.forEach((outcome, i) => {
    const channel = channels[i].name;
    if (outcome.status === "fulfilled") result.delivered.push(channel);
    else result.failed.push({ channel, reason: outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason) });
  });
  return result;
}
