import { FOOTER, SITE } from "@/content/site";
import { keepTogether } from "@/lib/typography";
import { PrivacyPolicy } from "./privacy-policy";

export function SiteFooter() {
  const business = Object.entries(SITE.business).filter(([, value]) => value);

  return (
    <footer className="border-t border-line py-12 text-[13px] text-ink-muted">
      <div className="mx-auto max-w-5xl space-y-4 px-5 sm:px-6">
        <div className="space-y-1">
          <p className="font-serif text-base font-semibold text-ink">
            {SITE.name} <span className="font-normal text-ink-muted">· {SITE.domain}</span>
          </p>
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
    </footer>
  );
}
