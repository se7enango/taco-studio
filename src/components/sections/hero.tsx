import { HEADLINE, HERO } from "@/content/site";
import { ButtonLink, TextLink } from "@/components/ui/links";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-5xl flex-col justify-between px-5 py-10 sm:px-6 md:min-h-[calc(100svh-4rem)] md:py-14"
    >
      <p className="text-[13px] font-medium text-ink-muted sm:text-sm">{HERO.label}</p>

      {/* 제목 두 줄은 어떤 화면 폭에서도 줄바꿈 없이 유지되도록 컨테이너 폭에 비례해 크기를 정합니다. */}
      <div className="@container my-auto py-12">
        <h1
          id="hero-title"
          className="font-display text-[min(calc(100cqi/16.4),4.5rem)] font-normal leading-[1.3] tracking-tight text-ink"
        >
          <span className="block whitespace-nowrap">{HEADLINE[0]}</span>
          <span className="mt-2 block whitespace-nowrap text-ink-body">{HEADLINE[1]}</span>
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <p className="max-w-[34rem] text-base leading-[1.7] text-ink-body sm:text-lg md:col-span-7">{HERO.summary}</p>
        <div className="flex flex-col gap-3 md:col-span-5 md:items-end">
          <ButtonLink cta="hero" className="w-full md:w-auto">
            {HERO.primaryCta}
          </ButtonLink>
          <TextLink href="#services" arrow="down" className="self-start md:self-end">
            {HERO.secondaryCta}
          </TextLink>
          <p className="text-[13px] text-ink-muted md:text-right">{HERO.reassurance}</p>
        </div>
      </div>
    </section>
  );
}
