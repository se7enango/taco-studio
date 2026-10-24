import { FOOTER, SITE } from "@/content/site";
import { keepTogether } from "@/lib/typography";
import { PrivacyPolicy } from "./privacy-policy";

/** 섹션과 같은 3/9칸 격자에 놓아, 본문 글자가 섹션 제목과 같은 세로선에서 시작하게 합니다. */
export function SiteFooter() {
  const business = Object.entries(SITE.business).filter(([, value]) => value);

  return (
    <footer className="border-t border-line py-12 text-[13px] text-ink-muted">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 md:grid md:grid-cols-12 md:items-baseline md:gap-x-6">
        <p className="font-serif text-base font-semibold text-ink md:col-span-3">
          {SITE.name}
          <span className="ml-2 font-sans text-[13px] font-normal text-ink-muted md:ml-0 md:block">{SITE.domain}</span>
        </p>
        <div className="mt-3 space-y-4 md:col-span-9 md:mt-0">
          <div className="space-y-1">
            <p>{keepTogether(SITE.tagline)}</p>
            <p>{keepTogether(FOOTER.confidentiality)}</p>
          </div>
          {business.length > 0 || SITE.contactEmail ? (
            <ul role="list" className="flex flex-wrap gap-x-3 gap-y-1">
              {business.map(([key, value]) => (
                <li key={key}>
                  {key} {value}
                </li>
              ))}
              {SITE.contactEmail ? (
                <li>
                  이메일{" "}
                  <a href={`mailto:${SITE.contactEmail}`} className="underline underline-offset-4 hover:text-ink">
                    {SITE.contactEmail}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
          <PrivacyPolicy />
          <p>
            © {SITE.copyrightYear} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
