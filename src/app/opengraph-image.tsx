import { ImageResponse } from "next/og";
import { HEADLINE, SITE } from "@/content/site";

export const alt = `${SITE.name} — ${HEADLINE.join(" ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const FOOTNOTE = `${SITE.name} · ${SITE.tagline}`;

/**
 * 이미지에 들어가는 글자만 담은 Noto Serif KR 조각을 빌드 시점에 받아 옵니다.
 * 서버에서 요청하면 Google Fonts가 satori가 읽을 수 있는 TTF로 응답합니다.
 */
async function loadKoreanFont(text: string): Promise<ArrayBuffer | null> {
  try {
    // 응답이 없어도 빌드가 멈추지 않도록 시간 제한을 둡니다.
    const signal = AbortSignal.timeout(10_000);
    const cssRes = await fetch(
      `https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400&text=${encodeURIComponent(text)}`,
      { signal },
    );
    if (!cssRes.ok) return null;
    const url = (await cssRes.text()).match(/src: url\((https:\/\/fonts\.gstatic\.com\/.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const fontRes = await fetch(url, { signal });
    return fontRes.ok ? await fontRes.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const font = await loadKoreanFont([...HEADLINE, FOOTNOTE].join(""));

  // 폰트를 받지 못하면 빌드가 깨지지 않도록 라틴 문자만으로 된 이미지를 만듭니다.
  const lines = font ? HEADLINE : [SITE.name, SITE.domain];
  const footnote = font ? FOOTNOTE : "On-premise AI · Custom software";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "88px 96px",
          background: "#0a0a0a",
          fontFamily: font ? "Noto Serif KR" : "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 72 }}>
          <div style={{ fontSize: 64, lineHeight: 1.3, color: "#fafafa", letterSpacing: "-0.02em" }}>{lines[0]}</div>
          <div style={{ fontSize: 64, lineHeight: 1.3, color: "#d4d4d4", letterSpacing: "-0.02em" }}>{lines[1]}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a3a3a3" }}>{footnote}</div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Noto Serif KR", data: font, weight: 400, style: "normal" }] : undefined,
    },
  );
}
