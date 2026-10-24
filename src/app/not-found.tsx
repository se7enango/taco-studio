import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/links";
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
          className="mx-auto flex min-h-[60svh] max-w-5xl flex-col justify-center px-5 py-20 sm:px-6"
        >
          <p lang="en" className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            404
          </p>
          <h1
            id="not-found-title"
            className="mt-3 font-display text-[clamp(1.625rem,1.2rem+1.6vw,2.25rem)] font-medium leading-[1.35] text-ink"
          >
            {NOT_FOUND.title}
          </h1>
          <p className="mt-5 max-w-[38rem] text-lg leading-[1.7] text-ink-body">
            {NOT_FOUND.body}
          </p>
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
