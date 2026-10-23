import { NAV, SITE } from "@/content/site";
import { HeaderCta } from "./header-cta";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-6 md:h-16">
        <a
          href="#top"
          aria-label={`${SITE.name} 맨 위로`}
          className="whitespace-nowrap rounded-xs font-serif text-lg font-semibold tracking-tight text-ink outline-hidden focus-visible:ring-2 focus-visible:ring-ink sm:text-xl"
        >
          {SITE.name}
        </a>
        <div className="flex items-center gap-6">
          <nav aria-label="주요 메뉴" className="hidden md:block">
            <ul role="list" className="flex gap-6 text-sm text-ink-muted">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-xs py-2 transition-colors hover:text-ink outline-hidden focus-visible:text-ink focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <HeaderCta />
        </div>
      </div>
    </header>
  );
}
