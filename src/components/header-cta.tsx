"use client";

import { useEffect, useState } from "react";
import { ctaAttributes } from "@/lib/contact/cta";

/**
 * 상단 메뉴의 상담 요청 버튼. 첫 화면을 지나면 흰색 버튼으로 바뀌어 눈에 띄게 됩니다.
 * JavaScript가 없으면 외곽선 버튼으로 남습니다.
 */
export function HeaderCta({ href }: { href: string }) {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: "-64px 0px 0px 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={href}
      {...ctaAttributes({ cta: "header" })}
      className={`inline-flex h-11 items-center whitespace-nowrap rounded-sm px-4 text-sm font-semibold transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
        pastHero
          ? "border border-ink bg-ink text-canvas hover:bg-neutral-300"
          : "border border-line-strong text-ink hover:bg-ink hover:text-canvas"
      }`}
    >
      상담 요청
    </a>
  );
}
