import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ContactSection } from "@/components/sections/contact-section";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Preview } from "@/components/sections/preview";
import { Process } from "@/components/sections/process";
import { Security } from "@/components/sections/security";
import { Services } from "@/components/sections/services";
import { buildJsonLd, serializeJsonLd } from "@/lib/json-ld";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-hidden">
        <Hero />
        <Preview />
        <Services />
        <Process />
        <Security />
        <Faq />
        <ContactSection />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJsonLd()) }} />
    </>
  );
}
