import { describe, expect, test } from "bun:test";
import { ctaAttributes, readCtaIntent, type CtaIntent } from "./cta";

/** 브라우저가 data-foo 속성을 dataset.foo로 읽는 것과 같게 바꿉니다. */
function dataset(intent: CtaIntent): DOMStringMap {
  const entries = Object.entries(ctaAttributes(intent)).filter(([, value]) => value !== undefined);
  return Object.fromEntries(entries.map(([key, value]) => [key.slice("data-".length), value]));
}

describe("CTA 링크 ↔ 문의 양식", () => {
  test("링크에 실은 값을 양식이 그대로 읽는다", () => {
    expect(readCtaIntent(dataset({ cta: "security", nda: true }))).toEqual({ source: "security", inquiry: undefined, nda: true });
    expect(readCtaIntent(dataset({ cta: "service-custom", inquiry: "custom" }))).toEqual({ source: "service-custom", inquiry: "custom", nda: false });
  });

  test("알 수 없는 값은 안전한 기본값으로 바꾼다", () => {
    expect(readCtaIntent({ cta: "evil", inquiry: "x" })).toEqual({ source: "direct", inquiry: "undecided", nda: false });
  });
});
