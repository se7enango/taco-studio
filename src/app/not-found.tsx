import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/links";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `페이지를 찾을 수 없습니다 | ${SITE.name}`,
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
            페이지를 찾을 수 없습니다
          </h1>
          <p className="mt-5 max-w-[38rem] text-lg leading-[1.7] text-ink-body">
            주소가 바뀌었거나 없는 페이지입니다. 첫 화면에서 서비스를 살펴보시거나 바로 상담을 요청해 주세요.
          </p>
          <div data-print="hide" className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/">첫 화면으로</ButtonLink>
            <ButtonLink href="/#contact" variant="outline">
              상담 요청
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
