# TACO STUDIO (`taco-studio.ai`)

폐쇄망 온프레미스 AI 구축과 맞춤 소프트웨어·AI 개발(FDE)을 하는 Taco Studio의 공식 웹사이트입니다.
한 페이지짜리 소개 사이트이며, 방문자가 서비스를 이해하고 상담 요청을 남기도록 만드는 것이 목적입니다.

## 요구 사항

- [bun](https://bun.sh) 1.4 이상
- Node.js 20.9 이상 (Next.js 16 요구 사항)

## 명령어

```bash
bun install          # 의존성 설치
bun run dev          # 개발 서버 (http://localhost:3000)
bun run build        # 프로덕션 빌드
bun run start        # 빌드 결과 실행
bun run lint         # ESLint
bun run typecheck    # TypeScript 검사
bun test             # 단위 테스트 (문의 검증·알림 포맷·전송)
```

## 환경 변수

상담 요청은 아래 웹훅으로 담당자에게 전달됩니다. 설정된 채널 **모두**에 동시에 보냅니다.
`.env.example`을 `.env.local`로 복사해 값을 채우고, Vercel에서는 **Settings → Environment Variables**에 등록하세요.

| 변수 | 설명 |
|---|---|
| `SLACK_WEBHOOK_URL` | Slack Incoming Webhook URL. [만드는 방법](https://api.slack.com/messaging/webhooks) |
| `DISCORD_WEBHOOK_URL` | Discord 채널 웹훅 URL. 채널 설정 → 연동 → 웹후크에서 만듭니다. |

전송 결과에 따른 동작은 다음과 같습니다.

- **하나라도 전달 성공**: 방문자에게 접수 완료를 보여 줍니다.
- **설정된 채널이 모두 실패**: 방문자에게 다시 시도해 달라고 안내하고 입력값은 그대로 둡니다. 서버 로그에 `LEAD_NOT_DELIVERED`와 함께 문의 내용을 남깁니다.
- **채널이 하나도 설정되지 않음**: 접수 완료로 처리하고 서버 로그에 `INQUIRY_LOG_ONLY`로만 남깁니다. Vercel 로그는 보관 기간이 짧으므로 **운영 환경에서는 반드시 웹훅을 설정하세요.**

알림에는 진입 경로(어느 버튼을 눌러 들어왔는지)가 함께 표시되므로, 별도의 분석 도구 없이도 섹션별 전환을 확인할 수 있습니다.
특정 서비스로 바로 연결되는 공유 링크도 쓸 수 있습니다: `https://taco-studio.ai/?type=onprem#contact`, `?type=custom#contact`.

## 구조

```
src/
  app/                 레이아웃, 페이지, 메타데이터(OG 이미지·아이콘·robots·sitemap), 전역 스타일
  actions/             상담 요청 Server Action
  components/
    sections/          페이지 섹션 (모두 서버 컴포넌트)
    contact/           문의 양식 (클라이언트 컴포넌트)
    ui/                섹션 틀, 링크·버튼
  content/site.ts      사이트의 모든 문구와 약속
  lib/contact/         입력 검증, 알림 메시지 포맷, 웹훅 전송 (+ 테스트)
  lib/json-ld.ts       검색 엔진용 구조화 데이터
prototype/             과거 디자인 시안 보관용 (빌드와 무관)
```

### 문구 수정

화면에 보이는 모든 문구, 회신 약속(`영업일 기준 24시간 이내`), 구축 기간(`평균 14일`)은 `src/content/site.ts` 한 곳에 있습니다.
페이지·메타데이터·구조화 데이터·알림 메시지가 모두 이 파일을 읽으므로, 값을 한 번만 바꾸면 사이트 전체에 반영됩니다.

`prototype/index.html`은 검증되지 않은 시안입니다. 그 안의 가격, 인증, 계약 조건, 수치, 경쟁사 비교는 사실로 확인된 것이 아니므로 실제 사이트로 옮기지 마세요.

## 출시 전 체크리스트

사실이 아닌 내용을 지어내지 않기 위해 아래 항목은 비워 두었습니다. 값이 없으면 화면에 표시되지 않습니다.

**반드시 필요**
- [ ] `SLACK_WEBHOOK_URL` 또는 `DISCORD_WEBHOOK_URL` 설정
- [ ] 개인정보 처리 정보 (`PRIVACY`): 개인정보 보호책임자, 열람·삭제 요청 연락처, 보유 기간 확정, 실제 사용하는 알림 서비스, 시행일

**권장**
- [ ] 공개 문의 이메일 (`SITE.contactEmail`): 문의 섹션, 오류 안내, 구조화 데이터에 표시됩니다
- [ ] 사업자 정보 (`SITE.business`): 상호, 대표자, 사업자등록번호, 주소
- [ ] 검색 엔진 소유 확인 코드 (`SITE.verification`): [네이버 서치어드바이저](https://searchadvisor.naver.com), Google Search Console. 등록 후 `https://taco-studio.ai/sitemap.xml`을 제출하세요
- [ ] 정식 로고로 `src/app/icon.svg`, `src/app/apple-icon.tsx` 교체 (지금은 임시 "T" 모노그램)

**문구 확인**: `site.ts`에서 `// OWNER-CONFIRM` 표시가 붙은 문장은 기존 사이트의 주장을 풀어 쓴 것입니다(예: 평균 14일의 범위, 장비는 고객사 구매, 맞춤 개발 소스코드 인계, 원격 접속 방침). 사실인지 확인하고, 아니면 고치거나 지워 주세요.
상담과 사전 점검이 무료라면 비용 FAQ에 그 내용을 추가하면 좋습니다.

## 배포 (Vercel)

1. Vercel에서 이 저장소를 Import합니다. 프레임워크는 Next.js로 자동 감지되며, 빌드 설정은 `vercel.json`에 있습니다.
2. 위 환경 변수를 등록합니다.
3. **Settings → Domains**에 `taco-studio.ai`를 추가하고, Vercel이 안내하는 DNS 레코드를 도메인 등록 업체(후이즈 등)의 DNS 관리 화면에 입력합니다.
4. 배포 후 확인할 것:
   - `curl -I https://taco-studio.ai`에 보안 헤더가 있고 `X-Powered-By`가 없는지
   - 테스트 문의가 Slack/Discord에 도착하는지
   - 카카오톡·Slack에 링크를 붙였을 때 미리보기 이미지가 나오는지
