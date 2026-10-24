"use client";

import { useEffect, useRef } from "react";
import { FORM } from "@/content/site";
import { keepTogether } from "@/lib/typography";

type Props = {
  inquiryId: string;
  name: string;
  email: string;
  nda: boolean;
  onReset: () => void;
};

export function SuccessPanel({ inquiryId, name, email, nda, onReset }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    const smooth = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" });
  }, []);

  return (
    <div role="status" className="space-y-5">
      <h3 ref={headingRef} tabIndex={-1} className="font-display text-2xl text-ink outline-hidden">
        {FORM.success.title}
      </h3>
      <p className="text-base leading-[1.75] text-ink-body">{FORM.success.body(name, email)}</p>
      <ol className="space-y-2 text-[15px] leading-[1.7] text-ink-body">
        {FORM.success.steps(nda).map((step, i) => (
          <li key={step} className="flex gap-3">
            <span aria-hidden="true" className="shrink-0 font-mono text-ink-muted">
              {i + 1}.
            </span>
            <span>{keepTogether(step)}</span>
          </li>
        ))}
      </ol>
      <div className="space-y-1 text-[13px] text-ink-muted">
        <p>{FORM.success.spam}</p>
        {inquiryId !== "0" ? (
          <p>
            {FORM.success.reference} <span className="font-mono text-ink-body">{inquiryId}</span>
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex h-12 items-center justify-center rounded-sm border border-line-strong px-6 text-[15px] font-semibold text-ink transition-colors hover:bg-ink hover:text-canvas outline-hidden focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {FORM.success.again}
      </button>
    </div>
  );
}
