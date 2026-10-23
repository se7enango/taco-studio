import { ABOUT } from "@/content/site";
import { Section } from "@/components/ui/section";

export function About() {
  return (
    <Section id="about" eyebrow={ABOUT.eyebrow} title={ABOUT.title} lead={ABOUT.lead}>
      <dl className="mt-14 grid grid-cols-2 border-y border-line md:grid-cols-4">
        {ABOUT.stats.map((stat) => (
          <div key={stat.term} className="flex flex-col py-6 pr-4">
            <dt className="mt-1 text-sm font-medium text-ink">{stat.term}</dt>
            <dd className="order-first font-serif text-[1.75rem] leading-tight text-ink sm:text-[2rem]">
              {stat.prefix ? <span className="mr-1 font-sans text-base text-ink-muted">{stat.prefix}</span> : null}
              {stat.value}
            </dd>
            <dd className="mt-1 text-[13px] leading-snug text-ink-muted">{stat.description}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
