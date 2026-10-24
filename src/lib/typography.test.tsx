import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { keepTogether } from "./typography";

const html = (text: string) => renderToStaticMarkup(<>{keepTogether(text)}</>);
const strip = (markup: string) => markup.replace(/<[^>]+>/g, "");

describe("keepTogether", () => {
  test("해당 없는 문장은 문자열 그대로 돌려준다", () => {
    expect(keepTogether("문의 남기기")).toBe("문의 남기기");
  });

  test("가운뎃점·빗금 덩어리와 '평균 14일'을 줄바꿈 없는 span으로 감싼다", () => {
    expect(html("맞춤 소프트웨어·AI 개발")).toBe('맞춤 <span class="whitespace-nowrap">소프트웨어·AI</span> 개발');
    expect(html("평균 14일 만에 구축")).toBe('<span class="whitespace-nowrap">평균 14일</span> 만에 구축');
    expect(html("데이터 파이프라인·AI 챗봇·업무 자동화·웹/앱")).toContain('<span class="whitespace-nowrap">파이프라인·AI</span>');
  });

  test("닫는 따옴표·괄호 뒤에 붙은 한글을 떼지 않는다", () => {
    expect(html("‘확실하게’는 약속")).toContain('<span class="whitespace-nowrap">‘확실하게’는</span>');
  });

  test("보이는 글자는 원문과 같다", () => {
    for (const text of ["사내망 안에서만 · 평균 14일(협의)", "A / B 테스트 ‘확인’과 (선택)을", "약 3개월, 최대 20명"]) {
      expect(strip(html(text))).toBe(text);
    }
  });
});
