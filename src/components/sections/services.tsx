import { SERVICES, type ServiceCard } from "@/content/site";
import { Arrow, ButtonLink, TextLink } from "@/components/ui/links";
import { Eyebrow, Indented, Section } from "@/components/ui/section";

function DashList({ items }: { items: string[] }) {
  return (
    <ul role="list" className="mt-3 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-[1.7] text-ink-body">
          <span aria-hidden="true" className="shrink-0 text-ink-muted">
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Card({ card }: { card: ServiceCard }) {
  const titleId = `service-${card.id}-title`;
  return (
    <article aria-labelledby={titleId} className="flex flex-col rounded-md border border-line bg-surface p-5 sm:p-6 md:p-8">
      <Eyebrow>{card.code}</Eyebrow>
      <h3 id={titleId} className="mt-3 font-display text-2xl font-medium leading-snug text-ink">
        {card.title}
      </h3>
      <p className="mt-3 text-base leading-[1.7] text-ink-body">{card.summary}</p>

      <h4 className="mt-8 text-[13px] font-semibold text-ink-muted">{card.fitTitle}</h4>
      <DashList items={card.fit} />

      <h4 className="mt-8 text-[13px] font-semibold text-ink-muted">{card.scopeTitle}</h4>
      <DashList items={card.scope} />

      <div className="mt-auto pt-8">
        <dl className="grid grid-cols-[4.5rem_1fr] gap-y-2 border-t border-line pt-4">
          {card.terms.map((row) => (
            <div key={row.term} className="contents">
              <dt className="text-[13px] leading-[1.7] text-ink-muted">{row.term}</dt>
              <dd className="text-[15px] leading-[1.6] text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
        <ButtonLink variant="outline" cta={`service-${card.id}`} inquiry={card.id} className="mt-6 w-full">
          {card.cta}
          <Arrow />
        </ButtonLink>
      </div>
    </article>
  );
}

export function Services() {
  return (
    <Section id="services" aliases={["engagements"]} eyebrow={SERVICES.eyebrow} title={SERVICES.title} lead={SERVICES.lead}>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {SERVICES.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <Indented className="mt-10">
        <p className="text-[15px] leading-[1.7] text-ink-body">{SERVICES.undecided}</p>
        <TextLink cta="services-undecided" inquiry="undecided" className="mt-2">
          {SERVICES.undecidedCta}
        </TextLink>
      </Indented>
    </Section>
  );
}
