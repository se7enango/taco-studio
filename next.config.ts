import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// 정적 페이지라 nonce 방식(요청마다 렌더링)은 쓰지 않습니다. Next.js가 넣는 인라인 부트스트랩 스크립트(self.__next_f) 때문에
// script-src에 'unsafe-inline'이 필요합니다. 개발 서버는 React 디버깅에 eval을 씁니다.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // upgrade-insecure-requests는 넣지 않습니다. 모든 자원이 같은 출처('self')이고 HSTS가 HTTPS를 강제하므로 얻는 것이 없고,
  // HTTP로 띄운 로컬 빌드를 휴대폰에서 사내망 주소로 열면 CSS·JS가 https로 바뀌어 화면이 깨집니다.
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // next/image를 쓰지 않으므로 /_next/image 최적화 엔드포인트를 끕니다.
  images: { unoptimized: true },
  experimental: {
    // 문의 양식의 가장 큰 정상 요청은 10KB 안팎입니다. 기본값(1MB)보다 작게 잡아 악성 요청의 처리 비용을 줄입니다.
    serverActions: { bodySizeLimit: "64kb" },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
