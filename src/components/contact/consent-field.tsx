"use client";

import { useState } from "react";
import { FORM, PRIVACY } from "@/content/site";
import { keepTogether } from "@/lib/typography";
import { checkboxClass, describedBy, FieldError } from "./field";

/** 개인정보 동의 체크박스와 '내용 보기' 안내. 접수 완료 화면으로 바뀌면 사라지므로 펼침 상태도 함께 초기화됩니다. */
export function ConsentField({ error }: { error?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-x-4">
        <label className="group/cb flex min-h-11 cursor-pointer items-start gap-3 text-[15px] leading-[1.6] text-ink">
          <input {...describedBy("consent", { error })} type="checkbox" required className={`mt-0.5 ${checkboxClass}`} />
          <span>{FORM.fields.consent.label}</span>
        </label>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="consent-panel"
          onClick={() => setOpen((value) => !value)}
          className="group ml-8 inline-flex min-h-11 items-start pt-0.5 text-sm leading-[1.6] text-ink-muted underline underline-offset-4 hover:text-ink outline-hidden"
        >
          {/* 포커스 표시는 44px 누름 영역이 아니라 글자에 맞춰 그립니다. */}
          <span className="-mx-1.5 rounded-xs px-1.5 group-focus-visible:ring-2 group-focus-visible:ring-ink">
            {FORM.fields.consent.toggle}
          </span>
        </button>
      </div>
      <FieldError name="consent" error={error} />
      <div
        id="consent-panel"
        hidden={!open}
        className="mt-2 space-y-1 rounded-sm border border-line p-4 text-[13px] leading-[1.7] text-ink-body"
      >
        <p>{keepTogether(`수집 항목: (필수) ${PRIVACY.required} / (선택) ${PRIVACY.optional}`)}</p>
        <p>{keepTogether(`이용 목적: ${PRIVACY.purpose}`)}</p>
        <p>{keepTogether(`보유 기간: ${PRIVACY.retention}`)}</p>
        <p>{keepTogether(`처리 위탁·국외 이전: ${PRIVACY.processors}`)}</p>
        <p>{PRIVACY.refusal}</p>
        <a
          href="#privacy"
          onClick={() => {
            const policy = document.getElementById("privacy");
            if (policy instanceof HTMLDetailsElement) policy.open = true;
          }}
          className="inline-block pt-1 text-ink underline underline-offset-4"
        >
          개인정보처리방침 전문 보기
        </a>
      </div>
    </div>
  );
}
