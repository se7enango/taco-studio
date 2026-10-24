import { NAV, SITE } from "@/content/site";
import { HeaderCta } from "./header-cta";

/** base: 첫 화면이 아닌 페이지(404 등)에서는 "/"를 넘겨 첫 화면의 섹션으로 이동하게 합니다. */
export function SiteHeader({ base = "" }: { base?: "" | "/" }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-5 sm:px-6 md:h-16">
        <a
          href={base || "#top"}
          aria-label={base ? `${SITE.name} 첫 화면으로` : `${SITE.name} 맨 위로`}
          className="-mx-1.5 whitespace-nowrap rounded-xs px-1.5 font-serif text-lg font-semibold tracking-tight text-ink outline-hidden focus-visible:ring-2 focus-visible:ring-ink sm:text-xl"
        >
          {SITE.name}
        </a>
        <div className="flex items-center gap-6">
          <nav aria-label="주요 메뉴" className="hidden md:block">
            <ul role="list" className="flex gap-6 text-sm text-ink-muted">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={`${base}${item.href}`}
                    className="-mx-1.5 rounded-xs px-1.5 py-2 transition-colors hover:text-ink outline-hidden focus-visible:text-ink focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <HeaderCta href={`${base}#contact`} />
        </div>
      </div>
    </header>
  );
}
