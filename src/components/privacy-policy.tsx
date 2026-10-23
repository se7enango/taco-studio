import { FOOTER, PRIVACY, SITE } from "@/content/site";

/** 값이 비어 있는 항목은 출력하지 않습니다. */
function compact<T>(items: (T | false | undefined)[]): T[] {
  return items.filter(Boolean) as T[];
}

export function PrivacyPolicy() {
  const rightsContact = PRIVACY.contact ?? SITE.contactEmail;
  const sections = compact<[string, string]>([
    ["처리 목적", PRIVACY.purpose],
    ["처리 항목", `(필수) ${PRIVACY.required} / (선택) ${PRIVACY.optional}`],
    ["보유 기간과 파기", PRIVACY.retention],
    ["처리 위탁·국외 이전", PRIVACY.processors],
    !!rightsContact && ["정보주체의 권리", `개인정보의 열람·정정·삭제·처리정지를 요청하실 수 있습니다. 문의: ${rightsContact}`],
    !!PRIVACY.officer && ["개인정보 보호책임자", PRIVACY.officer],
    !!PRIVACY.effectiveDate && ["시행일", PRIVACY.effectiveDate],
  ]);

  return (
    <details id="privacy" className="group">
      <summary className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xs text-ink-body underline decoration-line-strong underline-offset-4 outline-hidden hover:decoration-ink focus-visible:ring-2 focus-visible:ring-ink">
        {FOOTER.privacyTitle}
        <span aria-hidden="true" className="font-mono text-ink-muted group-open:hidden">
          +
        </span>
        <span aria-hidden="true" className="hidden font-mono text-ink-muted group-open:inline">
          −
        </span>
      </summary>
      <ol className="mt-4 max-w-2xl space-y-3 text-[13px] leading-[1.8] text-ink-body">
        {sections.map(([title, body], i) => (
          <li key={title}>
            <span className="font-semibold text-ink">
              {i + 1}. {title}
            </span>
            <br />
            {body}
          </li>
        ))}
      </ol>
    </details>
  );
}
