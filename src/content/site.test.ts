import { describe, expect, test } from "bun:test";
import { CONTACT, FAQ, FORM, HERO, PREVIEW, PROCESS, SECURITY, SERVICES, SITE } from "./site";

/** 페이지에 보이는 문구 전체(메타데이터 제외). 함수 문구는 두 가지 경우를 모두 펼칩니다. */
const visible = JSON.stringify([
  HERO, PREVIEW, SERVICES, PROCESS, SECURITY, FAQ, CONTACT, FORM,
  FORM.success.body("홍길동", "a@b.co"), FORM.success.steps(true), FORM.success.steps(false),
]);
const count = (needle: string) => visible.split(needle).length - 1;

describe("site.ts 머리말의 '정해진 자리' 규칙", () => {
  test("회신 시간: 첫 화면 안내문, 제출 버튼 아래, 접수 완료 화면", () => expect(count(SITE.replyPromise)).toBe(3));
  test("'엔지니어가 직접': 첫 화면 안내문, 문의 섹션 제목", () => expect(count("엔지니어가 직접")).toBe(2));
  test("사전 점검: 진행 과정 2단계, 보안 섹션 머리말", () => expect(count("사전 점검")).toBe(2));
  test("'기밀 정보는 빼고': 문의 내용 입력 안내", () => expect(count("기밀 정보는 빼고")).toBe(1));
  test("'100%': 서비스 B 조건표, FAQ 소스코드 답변", () => expect(count("100%")).toBe(2));
});
