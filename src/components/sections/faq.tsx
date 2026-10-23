import { FAQ } from "@/content/site";
import { TextLink } from "@/components/ui/links";
import { Indented, Section } from "@/components/ui/section";

export function Faq() {
  return (
    <Section id="faq" eyebrow={FAQ.eyebrow} title={FAQ.title}>
      <Indented>
        {FAQ.groups.map((group) => (
          <div key={group.heading}>
            <h3 className="mt-10 text-[13px] font-semibold text-ink-muted">{group.heading}</h3>
            <div className="mt-2 max-w-3xl border-t border-line">
              {group.items.map((item) => (
                <details key={item.question} open={item.defaultOpen} className="group border-b border-line">
                  <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 rounded-xs py-4 text-[17px] font-medium leading-normal text-ink outline-hidden focus-visible:ring-2 focus-visible:ring-ink">
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="shrink-0 font-mono text-ink-muted">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <p className="max-w-[38rem] pb-5 text-base leading-[1.75] text-ink-body">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
        <p className="mt-10 text-[15px] text-ink-body">{FAQ.closing}</p>
        <TextLink cta="faq" className="mt-1">
          {FAQ.cta}
        </TextLink>
      </Indented>
    </Section>
  );
}
