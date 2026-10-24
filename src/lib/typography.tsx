import { Fragment, type ReactNode } from "react";

/** 가운뎃점·빗금, 또는 닫는 따옴표·괄호 바로 뒤에 한글이 붙은 덩어리 */
const JOINED = /[·/]|[’”)][가-힣]/;

/**
 * 한글 줄바꿈 보정. 브라우저는 `word-break: keep-all`에서도 가운뎃점·빗금 앞뒤와
 * 닫는 따옴표·괄호 뒤에서 줄을 바꾸므로('소프트웨어 / ·AI 개발', '‘확실하게’ / 는'),
 * 그런 덩어리를 줄바꿈 없는 span으로 감쌉니다.
 * 보이지 않는 문자를 넣지 않으므로 복사·검색·인쇄되는 글자는 원문과 같습니다.
 */
export function keepTogether(text: string): ReactNode {
  if (!JOINED.test(text)) return text;
  return text.split(/(\s+)/).map((part, i) =>
    JOINED.test(part) ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
