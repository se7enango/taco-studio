import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Newsreader, Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { META, SITE } from "@/content/site";
import "./globals.css";

// 한글 폰트는 Google Fonts가 유니코드 범위별로 잘라 제공하므로, 페이지에 쓰인 조각만 내려받습니다.
// 조각이 많아 미리 불러오기(preload)는 하지 않습니다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// 제목용 명조는 제목에 쓰인 글자만 담은 파일(scripts/subset-display-font.ts로 생성)을 먼저 쓰고,
// 제목을 고쳐 빠진 글자가 생기면 아래 전체 폰트에서 그 글자가 든 조각만 받아 씁니다.
const displaySerif = localFont({
  src: "./fonts/noto-serif-kr-display.woff2",
  variable: "--font-display-serif",
  weight: "400 500",
  display: "swap",
});

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

// 첫 화면에는 모노 글자가 거의 없으므로 미리 불러오지 않습니다.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const verificationOther = SITE.verification.naver ? { "naver-site-verification": SITE.verification.naver } : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: META.title,
  description: META.description,
  keywords: META.keywords,
  authors: [{ name: SITE.name }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: META.title,
    description: META.ogDescription,
    url: "/",
    siteName: SITE.name,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: META.title,
    description: META.ogDescription,
  },
  ...(SITE.verification.google || verificationOther
    ? { verification: { google: SITE.verification.google, other: verificationOther } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${displaySerif.variable} ${notoSerifKr.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-canvas"
        >
          본문 바로가기
        </a>
        {children}
      </body>
    </html>
  );
}
