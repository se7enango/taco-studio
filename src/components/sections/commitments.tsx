import { COMMITMENTS } from "@/content/site";
import { Section } from "@/components/ui/section";
import { keepTogether } from "@/lib/typography";

export function Commitments() {
  return (
    <Section id="commitments" eyebrow={COMMITMENTS.eyebrow} title={COMMITMENTS.title} lead={COMMITMENTS.lead}>
      <div className="mt-12 grid gap-12 md:grid-cols-2">
        {COMMITMENTS.columns.map((column, i) => (
          <div key={column.heading}>
            <h3
              className={`font-display text-3xl font-normal md:text-4xl ${i === 0 ? "text-ink" : "text-ink-body"}`}
            >
              {column.heading}
            </h3>
            <ul role="list" className="mt-4 border-t border-line">
              {column.items.map((item) => (
                <li key={item} className="flex gap-3 border-b border-line py-4 text-base leading-[1.75] text-ink-body">
                  <span aria-hidden="true" className="shrink-0 text-ink-muted">
                    —
                  </span>
                  <span>{keepTogether(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
