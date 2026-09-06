# TACO STUDIO (`taco-studio.ai`)

엔터프라이즈 사내 폐쇄망 온프레미스 AI 구축 및 맞춤형 고난도 소프트웨어 외주 개발(FDE) 스튜디오 공식 웹사이트.

---

## 🚀 빠른 시작

### 1. 개발 서버 실행
```bash
bun install
bun run dev
```
브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

### 2. 프로덕션 빌드 및 실행
```bash
bun run build
bun run start -p 3000
```

---

## 🌐 Vercel 배포 및 후이즈 도메인 연결 방법

### Step 1: GitHub 레포지토리 생성 및 푸시
```bash
git add .
git commit -m "feat: Taco Studio official website initial release"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Vercel 배포 (1분 컷)
1. [vercel.com](https://vercel.com) 로그인
2. **Add New Project** &rarr; 방금 푸시한 `taco-studio` 레포지토리 Import
3. Framework Preset: **Next.js** 자동 감지 &rarr; **Deploy** 클릭

### Step 3: 후이즈(Whois) 도메인 연결
1. Vercel 프로젝트 설정 &rarr; **Settings** &rarr; **Domains** &rarr; `taco-studio.ai` 입력
2. Vercel이 안내하는 DNS 레코드 확인:
   - **Type A**: `@` &rarr; `76.76.21.21`
   - **CNAME**: `www` &rarr; `cname.vercel-dns.com`
3. [후이즈(whois.co.kr)](https://whois.co.kr) 접속:
   - **[내 도메인 관리]** &rarr; **[네임서버 고급설정 / DNS 레코드 관리]** 이동
   - 위 A 레코드와 CNAME 레코드 입력 후 저장
4. 약 5~10분 후 `https://taco-studio.ai`로 전 세계 접속 및 자동 SSL 인증서 활성화 완료!
