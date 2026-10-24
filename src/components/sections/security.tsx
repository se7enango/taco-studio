import { Fragment } from "react";
import { SECURITY } from "@/content/site";
import { Section } from "@/components/ui/section";
import { keepTogether } from "@/lib/typography";

function DataFlowDiagram() {
  const { diagram } = SECURITY;
  return (
    <figure className="mt-14">
      <div className="rounded-md border border-dashed border-line-strong p-5">
        <p className="text-[13px] font-semibold text-ink-muted">{diagram.boundary}</p>
        <ol className="mt-4 flex flex-col gap-3 md:flex-row md:items-stretch">
          {diagram.nodes.map((node, i) => (
            <Fragment key={node.label}>
              {i > 0 ? (
                <li aria-hidden="true" className="self-center font-mono text-ink-muted">
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:inline">→</span>
                </li>
              ) : null}
              <li className="flex flex-col justify-center rounded-sm border border-line bg-surface px-4 py-3 text-sm text-ink md:flex-1">
                {keepTogether(node.label)}
                {node.sub ? <span className="block text-[13px] text-ink-muted">{node.sub}</span> : null}
              </li>
            </Fragment>
          ))}
        </ol>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-muted">
        <span className="rounded-sm border border-dashed border-line px-4 py-3">{keepTogether(diagram.external)}</span>
        <span className="inline-flex items-center gap-2 text-[13px]">
          <span aria-hidden="true" className="font-mono">
            ✕
          </span>
          {diagram.externalLink}
        </span>
      </p>
      <figcaption className="mt-4 text-sm text-ink-muted">{diagram.caption}</figcaption>
    </figure>
  );
}

export function Security() {
  return (
    <Section id="security" eyebrow={SECURITY.eyebrow} title={SECURITY.title} lead={SECURITY.lead}>
      <dl className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
        {SECURITY.items.map((item) => (
          <div key={item.term}>
            <dt className="text-[13px] font-semibold text-ink-muted">{item.term}</dt>
            <dd className="mt-2 text-base leading-[1.75] text-ink-body">{keepTogether(item.description)}</dd>
          </div>
        ))}
      </dl>
      <DataFlowDiagram />
    </Section>
  );
}
