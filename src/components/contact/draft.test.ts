import { describe, expect, test } from "bun:test";
import { parseDraft } from "./draft";

describe("parseDraft", () => {
  test("저장한 입력을 그대로 되돌린다", () => {
    const draft = { company: "ACME", message: "첫 줄\n둘째 줄", nda: true, consent: true, inquiryType: "custom", source: "security", elapsedMs: 7000 };
    expect(parseDraft(JSON.stringify(draft))).toEqual(draft as never);
  });

  test("깨졌거나 손댄 값은 버린다", () => {
    expect(parseDraft(null)).toBeNull();
    expect(parseDraft("{")).toBeNull();
    expect(parseDraft('"text"')).toBeNull();
    expect(parseDraft(JSON.stringify({ company: 1, nda: "yes", inquiryType: "<x>", source: "evil" }))).toEqual({ inquiryType: "undecided", source: "direct" });
  });
});
