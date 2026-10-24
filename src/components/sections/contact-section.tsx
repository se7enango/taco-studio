import { CONTACT, FORM, SITE } from "@/content/site";
import { ContactForm } from "@/components/contact/contact-form";
import { Eyebrow, labelClass } from "@/components/ui/section";
import { keepTogether } from "@/lib/typography";

function Aside() {
  return (
    <div className="space-y-8 text-[15px] leading-[1.7] text-ink-body">
      <div>
        <h3 className={labelClass}>{CONTACT.stepsTitle}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-[1.25em] marker:text-[13px] marker:text-ink-muted">
          {CONTACT.steps.map((step) => (
            <li key={step} className="pl-1">
              {keepTogether(step)}
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h3 className={labelClass}>{CONTACT.reassuranceTitle}</h3>
        <ul role="list" className="mt-3 list-disc space-y-2 pl-[1.25em] marker:text-line-strong">
          {CONTACT.reassurance.map((item) => (
            <li key={item} className="pl-1">
              {keepTogether(item)}
            </li>
          ))}
        </ul>
      </div>
      {SITE.contactEmail ? (
        <p>
          {CONTACT.emailAlternative}{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="text-ink underline underline-offset-4">
            {SITE.contactEmail}
          </a>
        </p>
      ) : null}
    </div>
  );
}

/** 양식이 좁아지지 않도록, 왼쪽 설명과 오른쪽 양식을 나란히 두는 것은 lg(1024px) 이상에서만 합니다. */
export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line py-20 md:py-28">
      <span id="consult-c" aria-hidden="true" />
      <div className="mx-auto grid max-w-5xl gap-y-10 px-5 sm:px-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-10">
        <div className="lg:col-span-5 lg:row-start-1">
          <Eyebrow className="mb-3">{CONTACT.eyebrow}</Eyebrow>
          <h2
            id="contact-title"
            className="font-display text-[clamp(1.625rem,1.2rem+1.6vw,2.25rem)] font-medium leading-[1.35] tracking-[-0.015em] text-ink"
          >
            {CONTACT.title}
          </h2>
          <p className="mt-5 max-w-[38rem] text-lg leading-[1.7] text-ink-body">{keepTogether(CONTACT.lead)}</p>
        </div>

        <div
          data-print="form-card"
          className="rounded-md border border-line bg-surface p-5 sm:p-6 md:p-8 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-start"
        >
          <noscript>
            <p className="mb-6 rounded-sm border border-line p-4 text-sm text-ink-body">
              {FORM.noscript}
              {SITE.contactEmail ? ` ${CONTACT.emailAlternative} ${SITE.contactEmail}` : null}
            </p>
          </noscript>
          <ContactForm />
        </div>

        <div className="lg:col-span-5 lg:row-start-2">
          <Aside />
        </div>
      </div>
    </section>
  );
}
