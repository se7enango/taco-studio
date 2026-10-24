import { PROCESS } from "@/content/site";
import { TextLink } from "@/components/ui/links";
import { Indented, Section } from "@/components/ui/section";
import { keepTogether } from "@/lib/typography";

export function Process() {
  return (
    <Section id="process" eyebrow={PROCESS.eyebrow} title={PROCESS.title} lead={PROCESS.lead}>
      <ol className="mt-12 border-t border-line">
        {PROCESS.steps.map((step, i) => (
          <li key={step.title} className="border-b border-line py-6 md:grid md:grid-cols-12 md:gap-x-6">
            <span aria-hidden="true" className="block font-mono text-sm text-ink-muted md:col-span-3 md:pt-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="mt-1 max-w-[38rem] md:col-span-9 md:mt-0">
              <h3 className="text-lg font-semibold text-ink">{keepTogether(step.title)}</h3>
              {step.body ? <p className="mt-2 text-base leading-[1.75] text-ink-body">{keepTogether(step.body)}</p> : null}
              {step.tracks ? (
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                  {(["onprem", "custom"] as const).map((track) => (
                    <div key={track} className="contents">
                      <dt className="whitespace-nowrap pt-0.5 text-[13px] font-medium text-ink-muted">
                        {PROCESS.trackLabels[track]}
                      </dt>
                      <dd className="text-base leading-[1.75] text-ink-body">
                        {keepTogether(step.tracks[track])}
                        {track === "onprem" && step.onpremBadge ? (
                          <span className="ml-2 inline-block whitespace-nowrap rounded-xs border border-line-strong px-2 py-0.5 align-middle text-[12px] leading-normal text-ink-body">
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
