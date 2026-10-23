import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { About } from "@/components/sections/about";
import { Barriers } from "@/components/sections/barriers";
import { Commitments } from "@/components/sections/commitments";
import { ContactSection } from "@/components/sections/contact-section";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
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
        <About />
        <Barriers />
        <Services />
        <Process />
        <Security />
        <Commitments />
        <Faq />
        <ContactSection />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildJsonLd()) }} />
    </>
  );
}
