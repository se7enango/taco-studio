import { FAQ } from "@/content/site";
import { DisclosureIcon } from "@/components/ui/icons";
import { TextLink } from "@/components/ui/links";
import { Indented, labelClass, Section } from "@/components/ui/section";
import { keepTogether } from "@/lib/typography";

export function Faq() {
  return (
    <Section id="faq" eyebrow={FAQ.eyebrow} title={FAQ.title}>
      <Indented>
        {FAQ.groups.map((group) => (
          <div key={group.heading}>
            <h3 className={`mt-12 ${labelClass}`}>{group.heading}</h3>
            <div className="mt-2 max-w-3xl border-t border-line">
              {group.items.map((item) => (
                <details key={item.question} open={item.defaultOpen} className="group border-b border-line">
                  {/* 질문이 두 줄이 되어도 +/−가 첫 줄 가운데에 오도록, 아이콘 상자를 한 줄 높이(1.5em)로 둡니다. */}
                  <summary className="group/q -mx-2 flex min-h-14 cursor-pointer items-start justify-between gap-4 rounded-xs px-2 py-4 text-[17px] font-medium leading-normal text-ink outline-hidden focus-visible:ring-2 focus-visible:ring-ink">
                    <span className="text-balance">{keepTogether(item.question)}</span>
                    <DisclosureIcon className="h-[1.5em] transition-colors group-hover/q:text-ink" />
                  </summary>
                  <p className="max-w-[38rem] pb-5 text-base leading-[1.75] text-ink-body">{keepTogether(item.answer)}</p>
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
