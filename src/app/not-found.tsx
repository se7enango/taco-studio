import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/links";
import { pageColumn, SectionLead, SectionTitle } from "@/components/ui/section";
import { NOT_FOUND, SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `${NOT_FOUND.title} | ${SITE.name}`,
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader base="/" />
      <main id="main" tabIndex={-1} className="outline-hidden">
        <section
          aria-labelledby="not-found-title"
          className={`${pageColumn} flex min-h-[60svh] flex-col justify-center py-20`}
        >
          <p lang="en" className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            404
          </p>
          <SectionTitle as="h1" id="not-found-title" className="mt-3">
            {NOT_FOUND.title}
          </SectionTitle>
          <SectionLead>{NOT_FOUND.body}</SectionLead>
          <div data-print="hide" className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/">{NOT_FOUND.home}</ButtonLink>
            <ButtonLink href="/#contact" variant="outline">
              {NOT_FOUND.contact}
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
