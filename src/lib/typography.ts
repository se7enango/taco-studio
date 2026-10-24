const WORD_JOINER = "⁠";

/**
 * 한글 줄바꿈 보정. 브라우저는 `word-break: keep-all`에서도 가운뎃점·빗금 앞뒤와
 * 닫는 따옴표·괄호 뒤에서 줄을 바꾸므로('소프트웨어 / ·AI 개발', '‘확실하게’ / 는'),
 * 그 자리에 보이지 않는 단어 결합자(U+2060)를 넣어 붙여 둡니다.
 *
 * 화면에 표시하는 문자열에만 쓰세요. 알림 메시지·메타데이터·구조화 데이터에 넣으면
 * 보이지 않는 문자가 섞여 검색과 복사에 방해가 됩니다.
 */
export function keepTogether(text: string): string {
  return text
    .replace(/(\S)([·/])(?=\S)/g, `$1${WORD_JOINER}$2${WORD_JOINER}`)
    .replace(/([’”)])(?=[가-힣])/g, `$1${WORD_JOINER}`);
}
