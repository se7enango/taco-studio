import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://taco-studio.ai"),
  title: "Taco Studio | 사내망 온프레미스 AI 구축 & 맞춤 외주 개발",
  description:
    "100% 보안 폐쇄망 온프레미스 AI 어플라이언스 턴키 구축부터 고난도 소프트웨어 맞춤 외주 개발까지. 비개발자도 내일부터 즉시 쓰는 사내 AI 포털을 14일 안에 직접 납품합니다.",
  keywords: [
    "온프레미스 AI",
    "폐쇄망 AI",
    "사내 AI 구축",
    "로컬 LLM",
    "사내 챗봇",
    "RAG 구축",
    "AI 외주 개발",
    "소프트웨어 외주",
    "FDE",
    "Taco Studio",
  ],
  authors: [{ name: "Taco Studio" }],
  openGraph: {
    title: "Taco Studio | 사내망 온프레미스 AI 구축 & 맞춤 외주 개발",
    description:
      "사내 보안망을 위한 100% 에어갭 AI 턴키 구축 및 전담 FDE 외주 개발. 14일 완제품 납품.",
    url: "https://taco-studio.ai",
    siteName: "Taco Studio",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taco Studio | 엔터프라이즈 AI & 소프트웨어 FDE",
    description:
      "외부 클라우드 차단 기업을 위한 온프레미스 AI 인프라 구축 및 맞춤형 개발 스튜디오.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#08090c] text-slate-100 selection:bg-slate-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
