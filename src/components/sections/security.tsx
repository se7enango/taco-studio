import { Fragment } from "react";
import { SECURITY } from "@/content/site";
import { CrossIcon } from "@/components/ui/icons";
import { Arrow, TextLink } from "@/components/ui/links";
import { Indented, labelClass, Section } from "@/components/ui/section";
import { keepTogether } from "@/lib/typography";

function DataFlowDiagram() {
  const { diagram } = SECURITY;
  return (
    <figure>
      <div className="rounded-md border border-line-strong p-5">
        <p className={labelClass}>{diagram.boundary}</p>
        <ol className="mt-4 flex flex-col gap-3 md:flex-row md:items-stretch">
          {diagram.nodes.map((node, i) => (
            <Fragment key={node.label}>
              {i > 0 ? (
                <li aria-hidden="true" className="self-center text-ink-muted">
                  <span className="md:hidden">
                    <Arrow direction="down" />
                  </span>
                  <span className="hidden md:inline">
                    <Arrow />
                  </span>
                </li>
              ) : null}
              {/* keepTogether가 돌려주는 조각이 각각 세로 flex 항목이 되지 않도록 한 span으로 감쌉니다. */}
              <li className="flex flex-col justify-center rounded-sm border border-line bg-surface px-4 py-3 text-sm text-ink md:flex-1">
                <span>{keepTogether(node.label)}</span>
                {node.sub ? <span className="block text-[13px] text-ink-muted">{node.sub}</span> : null}
              </li>
            </Fragment>
          ))}
        </ol>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
        <span className="rounded-sm border border-dashed border-line-strong px-4 py-3">{keepTogether(diagram.external)}</span>
        <span className="inline-flex items-center gap-2 text-[13px]">
          <CrossIcon />
          {diagram.externalLink}
        </span>
      </p>
      <figcaption className="mt-4 text-[13px] text-ink-muted">{diagram.caption}</figcaption>
    </figure>
  );
}

export function Security() {
  return (
    <Section id="security" eyebrow={SECURITY.eyebrow} title={SECURITY.title} lead={SECURITY.lead}>
      <Indented className="mt-12">
        <DataFlowDiagram />
        <dl className="mt-12 grid gap-x-10 gap-y-8 lg:grid-cols-2">
          {SECURITY.items.map((item) => (
            <div key={item.term}>
              <dt className={labelClass}>{item.term}</dt>
              <dd className="mt-2 text-base leading-[1.75] text-ink-body">{keepTogether(item.description)}</dd>
            </div>
          ))}
        </dl>
        <TextLink cta="security" nda className="mt-10">
          {SECURITY.cta}
        </TextLink>
      </Indented>
    </Section>
  );
}
