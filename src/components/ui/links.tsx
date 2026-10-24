import type { ReactNode } from "react";
import { ctaAttributes, type CtaIntent } from "@/lib/contact/cta";

type CtaProps = CtaIntent & {
  href?: string;
  className?: string;
  children: ReactNode;
};

export function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    // 모노 글꼴(라틴 전용)에는 화살표가 없어 OS마다 다른 글꼴로 그려지므로, 본문 글꼴(Noto Sans KR)로 그립니다.
    <span aria-hidden="true">
      {direction === "right" ? "→" : "↓"}
    </span>
  );
}

const focusRing =
  "outline-hidden focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

export function TextLink({
  href = "#contact",
  cta,
  inquiry,
  nda,
  arrow = "right",
  className = "",
  children,
}: CtaProps & { arrow?: "right" | "down" }) {
  return (
    <a
      href={href}
      {...ctaAttributes({ cta, inquiry, nda })}
      className={`inline-flex min-h-11 items-center text-[15px] font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink ${focusRing} rounded-xs ${className}`}
    >
      {/* 줄이 바뀌어도 화살표가 마지막 단어 옆에 붙어 있도록 한 덩어리로 감쌉니다. */}
      <span>
        {children}
        {"\u00a0"}
        <Arrow direction={arrow} />
      </span>
    </a>
  );
}

export function ButtonLink({
  href = "#contact",
  cta,
  inquiry,
  variant = "solid",
  className = "",
  children,
}: CtaProps & { variant?: "solid" | "outline" }) {
  const look =
    variant === "solid"
      ? "bg-ink text-canvas hover:bg-neutral-300"
      : "border border-line-strong text-ink hover:bg-ink hover:text-canvas";
  return (
    <a
      href={href}
      {...ctaAttributes({ cta, inquiry })}
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-sm px-6 text-[15px] font-semibold transition-colors ${look} ${focusRing} ${className}`}
    >
      {children}
    </a>
  );
}
