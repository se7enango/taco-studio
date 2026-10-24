import { SERVICES, type ServiceCard } from "@/content/site";
import { Arrow, ButtonLink, TextLink } from "@/components/ui/links";
import { Eyebrow, Indented, labelClass, Section } from "@/components/ui/section";
import { keepTogether } from "@/lib/typography";

function BulletList({ items }: { items: string[] }) {
  return (
    <ul role="list" className="mt-3 list-disc space-y-1.5 pl-[1.1em] marker:text-line-strong">
      {items.map((item) => (
        <li key={item} className="text-balance pl-1 text-[15px] leading-[1.7] text-ink-body">
          {keepTogether(item)}
        </li>
      ))}
    </ul>
  );
}

/**
 * 두 카드를 나란히 놓을 때(lg 이상) 카드 안의 여섯 줄(구분·제목·요약·대상·범위·조건)이
 * 서로 같은 높이에서 시작하도록 부모 그리드의 행을 나눠 씁니다(subgrid).
 */
function Card({ card }: { card: ServiceCard }) {
  const titleId = `service-${card.id}-title`;
  return (
    <article
      aria-labelledby={titleId}
      className="flex flex-col rounded-md border border-line bg-surface p-5 sm:p-6 md:p-8 lg:row-span-6 lg:grid lg:grid-rows-subgrid lg:gap-y-0"
    >
      <Eyebrow>{card.code}</Eyebrow>
      <h3 id={titleId} className="mt-2 font-display text-2xl font-medium leading-snug text-ink">
        {keepTogether(card.title)}
      </h3>
      <p className="mt-3 text-base leading-[1.7] text-ink-body">{keepTogether(card.summary)}</p>

      <div className="mt-8">
        <h4 className={labelClass}>{card.fitTitle}</h4>
        <BulletList items={card.fit} />
      </div>

      <div className="mt-8">
        <h4 className={labelClass}>{card.scopeTitle}</h4>
        <BulletList items={card.scope} />
      </div>

      <div className="mt-auto pt-8 lg:mt-0 lg:self-end">
        <dl className="grid grid-cols-[4.5rem_1fr] items-baseline gap-y-2 border-t border-line pt-4">
          {card.terms.map((row) => (
            <div key={row.term} className="contents">
              <dt className={labelClass}>{row.term}</dt>
              <dd className="text-[15px] leading-[1.6] text-ink">{keepTogether(row.value)}</dd>
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
    <Section
      id="services"
      aliases={["engagements", "thesis", "barriers"]}
      eyebrow={SERVICES.eyebrow}
      title={SERVICES.title}
      lead={SERVICES.lead}
    >
      <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-y-0">
        {SERVICES.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      <Indented className="mt-10">
        <p className="text-[15px] leading-[1.7] text-ink-body">{keepTogether(SERVICES.undecided)}</p>
        <TextLink cta="services-undecided" inquiry="undecided" className="mt-2">
          {SERVICES.undecidedCta}
        </TextLink>
      </Indented>
    </Section>
  );
}
