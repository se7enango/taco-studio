import { PREVIEW } from "@/content/site";
import { Arrow, TextLink } from "@/components/ui/links";
import { Indented, labelClass, Section } from "@/components/ui/section";
import { keepTogether } from "@/lib/typography";

/**
 * 납품하는 사내 AI 포털의 화면 예시. 그림이 아니라 HTML로 그려 글자가 선명하고 화면 낭독기도 읽을 수 있습니다.
 * 실제로 입력할 수 있는 것처럼 보이지 않도록 입력창과 버튼은 만들지 않습니다.
 */
function PortalMock() {
  const { mock } = PREVIEW;
  return (
    <figure aria-labelledby="preview-caption">
      <div className="overflow-hidden rounded-md border border-line-strong/60 bg-surface">
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
          <span className="text-sm font-semibold text-ink">{mock.app}</span>
          <span className="rounded-xs border border-line-strong px-2 py-0.5 text-[12px] leading-normal text-ink-muted">
            {mock.badge}
          </span>
        </div>

        <div className="space-y-5 px-4 py-5 sm:px-6 sm:py-6">
          <p className="ml-auto w-fit max-w-[85%] rounded-md bg-line px-4 py-2.5 text-[15px] leading-[1.6] text-ink">
            {keepTogether(mock.question)}
          </p>
          <p className="max-w-[36rem] text-[15px] leading-[1.75] text-ink-body">{keepTogether(mock.answer)}</p>

          {mock.sources.length > 0 ? (
            <div className="border-t border-line pt-4">
              <p className={labelClass}>
                {mock.sourcesTitle} {mock.sources.length}건
              </p>
              <ul role="list" className="mt-2 grid gap-2 sm:grid-cols-2">
                {mock.sources.map((source) => (
                  <li key={source.title} className="rounded-sm border border-line px-3 py-2.5 text-[13px] leading-[1.5]">
                    <span className="block text-[14px] text-ink">{source.title}</span>
                    <span className="text-ink-muted">{source.section}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div
          aria-hidden="true"
          className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-[14px] text-[#8f8f8f] sm:px-5"
        >
          <span>{mock.input}</span>
          <span className="grid size-7 place-items-center rounded-xs border border-line-strong text-ink-muted">
            <Arrow />
          </span>
        </div>
      </div>
      <figcaption id="preview-caption" className="mt-3 text-[13px] leading-[1.6] text-ink-muted">
        {keepTogether(PREVIEW.caption)}
      </figcaption>
    </figure>
  );
}

export function Preview() {
  return (
    <Section id="preview" aliases={["about"]} eyebrow={PREVIEW.eyebrow} title={PREVIEW.title} lead={PREVIEW.lead}>
      <Indented className="mt-12">
        <PortalMock />

        <dl className="mt-12 grid border-t border-line sm:grid-cols-3 sm:gap-x-6">
          {PREVIEW.facts.map((fact) => (
            <div key={fact.term} className="border-b border-line py-5 last:border-b-0 sm:border-b-0">
              <dt className={labelClass}>{fact.term}</dt>
              <dd className="mt-1 text-xl font-semibold leading-snug text-ink">{fact.value}</dd>
              <dd className="mt-1 text-[13px] leading-[1.6] text-ink-muted">{keepTogether(fact.description)}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 max-w-[38rem] text-[15px] leading-[1.75] text-ink-body">{keepTogether(PREVIEW.note)}</p>
        <TextLink cta="preview" inquiry="onprem" className="mt-4">
          {PREVIEW.cta}
        </TextLink>
      </Indented>
    </Section>
  );
}
