import { describe, expect, test } from "bun:test";
import { FORM } from "@/content/site";
import { classifySubmitError, failureMessage } from "./submission";

describe("제출 실패 안내", () => {
  test("fetch 실패와 오프라인만 연결 문제로 본다", () => {
    expect(classifySubmitError(new TypeError("Failed to fetch"), true)).toBe("network");
    expect(classifySubmitError(new Error("500"), false)).toBe("network");
    expect(classifySubmitError(new Error("500"), true)).toBe("failed");
  });

  test("결과마다 맞는 문구를 고른다", () => {
    expect(failureMessage(null)).toBeNull();
    expect(failureMessage({ status: "success", inquiryId: "abcd1234" })).toBeNull();
    expect(failureMessage({ status: "stale", saved: false })).toBe(FORM.staleUnsaved);
    expect(failureMessage({ status: "network" })).toBe(FORM.network);
  });
});
