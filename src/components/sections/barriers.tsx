import { BARRIERS } from "@/content/site";
import { TextLink } from "@/components/ui/links";
import { Eyebrow, Indented, Section } from "@/components/ui/section";
import { keepTogether } from "@/lib/typography";

export function Barriers() {
  return (
    <Section id="barriers" aliases={["thesis"]} eyebrow={BARRIERS.eyebrow} title={BARRIERS.title}>
      <div className="mt-6">
        {BARRIERS.items.map((item) => (
          <article
            key={item.code}
            className="border-b border-line py-10 last:border-b-0 md:grid md:grid-cols-12 md:gap-x-6"
          >
            <div className="mb-4 md:col-span-3 md:mb-0">
              <Eyebrow>{item.code}</Eyebrow>
              <p className="mt-1 text-[13px] font-medium text-ink-muted">{item.label}</p>
            </div>
            <div className="max-w-[38rem] md:col-span-9">
              <h3 className="text-lg font-semibold leading-normal text-ink md:text-xl">{keepTogether(item.title)}</h3>
              <p className="mt-3 text-base leading-[1.75] text-ink-muted">{keepTogether(item.problem)}</p>
              <p className="mt-3 flex gap-3 text-base leading-[1.75] text-ink-body">
                <span aria-hidden="true" className="shrink-0 font-mono text-ink-muted">
                  →
                </span>
                <span>{keepTogether(item.solution)}</span>
              </p>
            </div>
          </article>
        ))}
      </div>
      <Indented className="mt-6">
        <TextLink cta="barriers" inquiry="undecided">
          {keepTogether(BARRIERS.cta)}
        </TextLink>
      </Indented>
    </Section>
  );
}
