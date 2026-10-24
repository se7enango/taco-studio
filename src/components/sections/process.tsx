import { PROCESS } from "@/content/site";
import { TextLink } from "@/components/ui/links";
import { Indented, Section } from "@/components/ui/section";
import { keepTogether } from "@/lib/typography";

/**
 * 다섯 단계. 넓은 화면(lg 이상)에서는 가로 다섯 칸, 그보다 좁으면 번호 열과 본문 열로 된 세로 목록입니다.
 * 세로 목록에서는 번호와 단계 이름의 글자 바닥선을 맞춥니다.
 */
export function Process() {
  return (
    <Section id="process" eyebrow={PROCESS.eyebrow} title={PROCESS.title} lead={PROCESS.lead}>
      <ol className="mt-12 border-t border-line lg:grid lg:grid-cols-5 lg:gap-x-6 lg:border-t-0">
        {PROCESS.steps.map((step, i) => (
          <li
            key={step.title}
            className="grid grid-cols-[2.5rem_1fr] items-baseline border-b border-line py-5 md:grid-cols-12 md:gap-x-6 lg:block lg:border-b-0 lg:border-t lg:pt-5 lg:pb-0"
          >
            <span aria-hidden="true" className="font-mono text-[13px] text-ink-muted md:col-span-3 lg:block">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="md:col-span-9 lg:mt-3">
              <h3 className="text-base font-semibold leading-[1.6] text-ink">{keepTogether(step.title)}</h3>
              {step.body ? (
                <p className="mt-1 max-w-[38rem] text-[15px] leading-[1.7] text-ink-body lg:text-[14px]">
                  {keepTogether(step.body)}
                </p>
              ) : null}
              {step.tracks ? (
                <dl className="mt-1 grid grid-cols-[1.25rem_1fr] items-baseline gap-y-1.5 text-[15px] leading-[1.7] lg:text-[14px]">
                  {(["onprem", "custom"] as const).map((track) => (
                    <div key={track} className="contents">
                      <dt className="font-mono text-[12px] text-ink-muted">
                        <span aria-hidden="true">{PROCESS.trackCodes[track]}</span>
                        <span className="sr-only">{PROCESS.trackLabels[track]}</span>
                      </dt>
                      <dd className="text-ink-body">
                        {keepTogether(step.tracks[track])}
                        {track === "onprem" && step.onpremBadge ? (
                          <span className="ml-1.5 inline-block whitespace-nowrap rounded-xs border border-line-strong px-1.5 align-[0.1em] text-[12px] leading-[1.6] text-ink-body">
                            {step.onpremBadge}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <Indented className="mt-8">
        <p className="max-w-[38rem] text-sm leading-[1.7] text-ink-muted">{keepTogether(PROCESS.note)}</p>
        <TextLink cta="process" className="mt-4">
          {PROCESS.cta}
        </TextLink>
      </Indented>
    </Section>
  );
}
