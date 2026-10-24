import { HEADLINE, HERO } from "@/content/site";
import { ButtonLink, TextLink } from "@/components/ui/links";
import { keepTogether } from "@/lib/typography";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="mx-auto flex max-w-5xl flex-col justify-between px-5 py-10 sm:px-6 md:min-h-[calc(100svh-4rem)] md:py-14"
    >
      <p className="text-[13px] font-medium text-ink-muted sm:text-sm">{keepTogether(HERO.label)}</p>

      {/* 태블릿 이상에서는 두 문장이 한 줄씩 들어가도록 컨테이너 폭에 비례해 크기를 정합니다.
          휴대폰에서는 그렇게 하면 본문과 크기 차이가 거의 없어지므로, 크기를 키우고 각 문장을 두 줄로 나눕니다. */}
      <div className="@container py-8 md:my-auto md:py-12">
        <h1
          id="hero-title"
          className="font-display text-[clamp(1.75rem,8.4vw,2.5rem)] font-normal leading-[1.3] tracking-tight text-ink md:text-[min(calc(100cqi/16.4),4.5rem)]"
        >
          <span className="block">{HEADLINE[0]}</span>
          <span className="mt-2 block text-ink-body">{HEADLINE[1]}</span>
        </h1>
      </div>

      {/* 요약과 버튼을 좌우로 나누는 것은 lg 이상에서만 합니다. 태블릿(768px)에서 나누면 요약이 네 줄, 안내문이 두 줄로 깨집니다. */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <p className="max-w-[34rem] text-base leading-[1.7] text-ink-body sm:text-lg lg:col-span-7">{keepTogether(HERO.summary)}</p>
        <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
          <ButtonLink cta="hero" className="w-full sm:w-auto sm:self-start lg:self-auto">
            {HERO.primaryCta}
          </ButtonLink>
          <TextLink href="#preview" arrow="down" className="self-start lg:self-end">
            {HERO.secondaryCta}
          </TextLink>
          <p className="text-[13px] text-ink-muted lg:text-right">{HERO.reassurance}</p>
        </div>
      </div>
    </section>
  );
}
