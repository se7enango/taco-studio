import type { ReactNode } from "react";
import { keepTogether } from "@/lib/typography";

/** 모노 라벨. 라틴 문자 전용입니다(JetBrains Mono에는 한글 글리프가 없습니다). */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p lang="en" className={`font-mono text-xs uppercase tracking-[0.14em] text-ink-muted ${className}`}>
      {children}
    </p>
  );
}

/** 섹션 머리 아래의 본문을 오른쪽 9칸(제목 열)에 맞춰 배치합니다. */
export function Indented({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`md:grid md:grid-cols-12 md:gap-x-6 ${className}`}>
      <div className="md:col-span-9 md:col-start-4">{children}</div>
    </div>
  );
}

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  /** 예전 앵커(#thesis 등)로 들어오는 링크가 계속 동작하도록 남겨 두는 별칭 id */
  aliases?: string[];
  children: ReactNode;
};

export function Section({ id, eyebrow, title, lead, aliases = [], children }: SectionProps) {
  const titleId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={titleId} className="border-t border-line py-20 md:py-28">
      {aliases.map((alias) => (
        <span key={alias} id={alias} aria-hidden="true" />
      ))}
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="md:grid md:grid-cols-12 md:gap-x-6">
          <Eyebrow className="mb-3 md:col-span-3 md:mb-0 md:pt-2">{eyebrow}</Eyebrow>
          <div className="md:col-span-9">
            <h2
              id={titleId}
              className="font-display text-[clamp(1.625rem,1.2rem+1.6vw,2.25rem)] font-medium leading-[1.35] tracking-[-0.015em] text-ink"
            >
              {keepTogether(title)}
            </h2>
            {lead ? <p className="mt-5 max-w-[38rem] text-lg leading-[1.7] text-ink-body">{keepTogether(lead)}</p> : null}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
