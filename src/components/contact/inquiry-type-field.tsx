import { FORM, INQUIRY_TYPE_LABELS } from "@/content/site";
import { INQUIRY_TYPES, type InquiryType } from "@/lib/contact/schema";
import { keepTogether } from "@/lib/typography";

/** 문의 분야 라디오. 선택 상태는 DOM이 가지며, defaultValue는 다시 그려질 때의 초기값입니다. */
export function InquiryTypeField({ defaultValue }: { defaultValue: InquiryType }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-ink">{FORM.typeLegend}</legend>
      <div className="grid gap-2">
        {INQUIRY_TYPES.map((type) => (
          <label
            key={type}
            className="flex cursor-pointer items-start gap-3 rounded-sm border border-line-strong p-4 transition-colors hover:border-ink-muted has-checked:border-ink has-checked:ring-1 has-checked:ring-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-transparent has-focus-visible:ring-2 has-focus-visible:ring-ink has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-surface forced-colors:has-checked:border-[Highlight]"
          >
            <input type="radio" name="inquiryType" value={type} defaultChecked={defaultValue === type} className="peer sr-only" />
            <span
              aria-hidden="true"
              className="mt-1 grid size-4 shrink-0 place-items-center rounded-full border border-line-strong peer-checked:border-ink peer-checked:[&>span]:block"
            >
              <span className="hidden size-2 rounded-full bg-ink forced-colors:bg-[CanvasText]" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold text-ink">{keepTogether(INQUIRY_TYPE_LABELS[type].title)}</span>
              <span className="mt-0.5 block text-[13px] text-ink-muted">{keepTogether(INQUIRY_TYPE_LABELS[type].description)}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
