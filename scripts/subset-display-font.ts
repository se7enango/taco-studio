/**
 * 제목용 한글 명조(Noto Serif KR)를 사이트 제목에 쓰인 글자만 남겨 줄입니다.
 * 전체 폰트를 쓰면 첫 화면에서 약 370KB를 더 내려받기 때문입니다.
 *
 * 제목 문구를 바꾸면 다시 실행해 주세요. 잊으면 `bun test`의 글꼴 검사가 빠진 글자를 알려 줍니다.
 *
 *   pip install fonttools brotli
 *   curl -L -o /tmp/NotoSerifKR.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/notoserifkr/NotoSerifKR%5Bwght%5D.ttf"
 *   # 제목에 쓰는 굵기(400~500)만 남겨 크기를 더 줄입니다(1분 정도 걸립니다).
 *   fonttools varLib.instancer /tmp/NotoSerifKR.ttf wght=400:500 -o /tmp/NotoSerifKR-400-500.ttf
 *   bun run font:subset /tmp/NotoSerifKR-400-500.ttf
 */

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DISPLAY_TEXT } from "../src/content/display-text";

const source = process.argv[2];
if (!source) {
  console.error("사용법: bun run font:subset <NotoSerifKR-400-500.ttf 경로>");
  process.exit(1);
}

// 제목 안의 영문·숫자·문장부호도 같은 글꼴로 그리도록 기본 라틴 문자를 함께 넣습니다.
const latin = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join("");
const chars = [...new Set([...DISPLAY_TEXT.join(""), ...latin, "‘", "’", "“", "”", "·", "…"])].sort().join("");

const fonts = join(import.meta.dir, "../src/app/fonts");
const output = join(fonts, "noto-serif-kr-display.woff2");
const workdir = mkdtempSync(join(tmpdir(), "subset-"));
let status: number;
try {
  const textFile = join(workdir, "chars.txt");
  writeFileSync(textFile, chars);
  const result = spawnSync(
    "pyftsubset",
    [source, `--text-file=${textFile}`, "--flavor=woff2", "--layout-features=*", "--no-hinting", `--output-file=${output}`],
    { stdio: "inherit" },
  );
  if (result.error) console.error(`pyftsubset을 실행하지 못했습니다(${result.error.message}). 'pip install fonttools brotli'로 설치해 주세요.`);
  status = result.error ? 1 : (result.status ?? 1);
} finally {
  // process.exit()는 finally를 건너뛰므로, 임시 폴더를 지운 뒤에 종료합니다.
  rmSync(workdir, { recursive: true, force: true });
}
if (status !== 0) process.exit(status);

// 테스트(src/content/display-text.test.ts)가 이 목록으로 빠진 글자를 찾습니다.
writeFileSync(join(fonts, "noto-serif-kr-display.chars.txt"), chars);
const hangul = [...chars].filter((c) => /[가-힣]/.test(c)).length;
console.log(`글자 ${[...chars].length}개(한글 ${hangul}개), ${(statSync(output).size / 1024).toFixed(1)}KB: ${output}`);
