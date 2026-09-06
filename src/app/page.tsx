"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Cpu,
  Terminal,
  ArrowRight,
  CheckCircle2,
  Lock,
  Calendar,
  Layers,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  Server,
  Code2,
} from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    contact: "",
    email: "",
    serviceType: "사내 폐쇄망 온프레미스 AI 턴키 구축 (하드웨어 추천 포함)",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitResult({
          success: true,
          message: data.message || "신청이 정상 접수되었습니다.",
        });
        setFormData({
          company: "",
          name: "",
          contact: "",
          email: "",
          serviceType: "사내 폐쇄망 온프레미스 AI 턴키 구축 (하드웨어 추천 포함)",
          message: "",
        });
      } else {
        setSubmitResult({
          success: false,
          message: data.error || "오류가 발생했습니다. 다시 시도해 주세요.",
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: "네트워크 통신 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#08090c] text-slate-100 min-h-screen font-sans selection:bg-slate-800 selection:text-white">
      {/* 1. Header */}
      <header className="border-b border-neutral-800/80 bg-[#08090c]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <a href="#" className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span className="font-serif text-xl tracking-tight text-white font-bold">
                TACO STUDIO
              </span>
            </a>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
              taco-studio.ai
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs tracking-wide text-neutral-400 font-medium">
            <a href="#thesis" className="hover:text-white transition">
              문제의 본질
            </a>
            <a href="#engagements" className="hover:text-white transition">
              서비스 기둥
            </a>
            <a href="#timeline" className="hover:text-white transition">
              14일 타임라인
            </a>
            <a href="#security" className="hover:text-white transition">
              보안 &amp; 비용
            </a>
          </nav>

          <a
            href="#consult"
            className="px-3.5 py-1.5 border border-neutral-700 hover:border-neutral-500 bg-neutral-900/60 hover:bg-neutral-800 text-white text-xs rounded transition flex items-center space-x-1.5"
          >
            <span>기술 미팅 예약</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          </a>
        </div>
      </header>

      {/* 2. Hero Section (Executive Brief Editorial) */}
      <section className="pt-20 sm:pt-28 pb-16 px-6 max-w-5xl mx-auto space-y-8 bg-subtle-grid">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-neutral-900/80 border border-neutral-800 text-[11px] font-mono text-neutral-400">
          <span className="text-emerald-400 font-bold">●</span>
          <span>AIR-GAP AI &middot; FORWARD DEPLOYED ENGINEERING</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.15] font-normal tracking-tight">
          소프트웨어와 인공지능을<br />
          <span className="text-neutral-300 underline decoration-neutral-700 underline-offset-8">
            가장 안전하고 확실하게
          </span>{" "}
          만듭니다.
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-3xl">
          외부 클라우드로 기밀 유출이 엄격히 금지된 기업, 비싼 GPU 장비를 사놓고
          다룰 줄 몰라 콘솔에 방치한 기업, 억대 연봉 AI 엔지니어를 구하지 못해
          멈춰선 팀을 위해 <strong>Taco Studio</strong>는 고객의 현장으로 직접 들어갑니다.
          비개발자 직원도 내일부터 즉시 쓰는 사내 포털을 14일 안에 직접 납품합니다.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <a
            href="#consult"
            className="px-6 py-3.5 bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs sm:text-sm rounded transition text-center flex items-center justify-center space-x-2"
          >
            <span>대표 엔지니어 직통 기술 상담 신청</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#engagements"
            className="px-6 py-3.5 border border-neutral-800 hover:border-neutral-700 bg-neutral-900/40 text-neutral-300 text-xs sm:text-sm rounded transition text-center flex items-center justify-center space-x-2"
          >
            <span>제공 서비스 2대 기둥 보기</span>
          </a>
        </div>

        {/* 4-Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-b border-neutral-800/80 py-8 text-sm">
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-white">100%</div>
            <div className="text-xs text-neutral-500 mt-1 font-mono">Air-Gapped Isolation</div>
            <div className="text-xs text-neutral-400 mt-0.5">외부 유출 0건 폐쇄망</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-white">14 Days</div>
            <div className="text-xs text-neutral-500 mt-1 font-mono">Turnkey Deployment</div>
            <div className="text-xs text-neutral-400 mt-0.5">완제품 사내 포털 납품</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-white">Turnkey</div>
            <div className="text-xs text-neutral-500 mt-1 font-mono">No Developer Needed</div>
            <div className="text-xs text-neutral-400 mt-0.5">비개발자용 직관적 UI</div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl text-white">FDE Model</div>
            <div className="text-xs text-neutral-500 mt-1 font-mono">Hands-on Practice</div>
            <div className="text-xs text-neutral-400 mt-0.5">현장 투입 전담 엔지니어</div>
          </div>
        </div>
      </section>

      {/* 3. Section: The Executive Thesis (3대 문제 정의) */}
      <section id="thesis" className="py-20 px-6 max-w-5xl mx-auto space-y-12">
        <div className="space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            The Thesis &middot; 문제의 본질
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white">
            우리가 해결하는 세 가지 장벽
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            수많은 기업이 AI 도입을 외치지만, 실제 업무 현장에서는 보안, 기술, 인력의
            벽에 가로막혀 있습니다.
          </p>
        </div>

        <div className="space-y-10 text-neutral-300 text-sm leading-relaxed">
          {/* 01 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-10 border-b border-neutral-800/60">
            <div className="md:col-span-3 font-mono text-xs text-neutral-500">
              01 / THE PRIVACY TRAP
            </div>
            <div className="md:col-span-9 space-y-2.5">
              <h3 className="text-base sm:text-lg font-bold text-white">
                클라우드 API의 데이터 유출과 규제 위반
              </h3>
              <p className="text-neutral-400">
                ChatGPT나 Claude API는 편리하지만, 제조 도면, 회계 기밀, 인사 평가,
                비공개 소스코드를 외부로 전송하는 순간 사규와 개인정보보호법을
                위반하게 됩니다. Taco Studio는 인터넷 케이블을 완전히 뽑아도 단독으로
                구동되는 100% 온프레미스 로컬 인프라를 만듭니다.
              </p>
            </div>
          </div>

          {/* 02 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-10 border-b border-neutral-800/60">
            <div className="md:col-span-3 font-mono text-xs text-neutral-500">
              02 / THE HARDWARE WASTE
            </div>
            <div className="md:col-span-9 space-y-2.5">
              <h3 className="text-base sm:text-lg font-bold text-white">
                수천만 원대 GPU 장비 방치와 비개발자의 소외
              </h3>
              <p className="text-neutral-400">
                엔지니어가 없는 조직에 검은 터미널 창과 모델만 갖다 놓으면 아무도 쓰지
                못하고 먼지만 쌓입니다. 우리는 하드웨어 셋업뿐만 아니라, 일반 사원이
                내일부터 브라우저만 열면 사내 규정을 1초 만에 검색하고 보고서를 쓰는
                &lsquo;완성된 사내 웹 포털&rsquo;까지 한 번에 납품합니다.
              </p>
            </div>
          </div>

          {/* 03 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-3 font-mono text-xs text-neutral-500">
              03 / THE TALENT DEFICIT
            </div>
            <div className="md:col-span-9 space-y-2.5">
              <h3 className="text-base sm:text-lg font-bold text-white">
                억대 연봉 AI 엔지니어 채용의 현실적 한계
              </h3>
              <p className="text-neutral-400">
                자체 AI 팀을 빌딩하려면 채용에만 수개월, 수억 원의 고정비가 소모됩니다.
                Taco Studio의 FDE(Forward Deployed Engineer) 모델을 통해, 필요한 프로젝트
                단위로 최정예 엔지니어링을 즉시 공급받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Two-Track Core Engagements (2대 서비스 기둥) */}
      <section
        id="engagements"
        className="py-20 px-6 max-w-5xl mx-auto border-t border-neutral-800"
      >
        <div className="space-y-3 mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Capabilities &middot; 서비스 기둥
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white">
            Taco Studio의 Two-Track 비즈니스
          </h2>
          <p className="text-sm text-neutral-400 max-w-2xl">
            사내망 인프라 구축이 필요할 때도, 빠른 맞춤 소프트웨어 외주가 필요할 때도
            동일한 FDE 엔지니어링 퀄리티로 문제를 해결합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Track 1 */}
          <div className="p-8 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-6 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
              <Server className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-emerald-400">
                Track 01 &middot; Turnkey Appliance
              </div>
              <h3 className="font-bold text-white text-xl">
                온프레미스 AI 턴키 솔루션 구축
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                사내 데이터 보안으로 외부 클라우드를 사용할 수 없는 기업을 위한 전용
                패키지. 하드웨어 스펙 컨설팅부터 사내 포털 납품까지 원스톱 해결.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>하드웨어 구매 가이드:</strong> Mac Studio부터 Dual RTX 4090, H100 랙까지 최적 스펙 제안 (고객사 실구매)
                </span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>100% 폐쇄망 에어갭:</strong> 외부 인터넷 연결 없이 독립 구동되는 vLLM 최신 오픈소스 모델 서빙
                </span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>비개발자용 사내 포털:</strong> 사규, 도면, 계약서 PDF 드래그 업로드 기반 RAG 검색 챗봇 웹 화면 완제품 인계
                </span>
              </li>
            </ul>

            <a
              href="#consult"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white hover:underline pt-2"
            >
              <span>온프레미스 도입 실사 문의</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Track 2 */}
          <div className="p-8 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-6 hover:border-neutral-700 transition">
            <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
              <Code2 className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-cyan-400">
                Track 02 &middot; Custom Dev &amp; FDE
              </div>
              <h3 className="font-bold text-white text-xl">
                맞춤형 AI &amp; 소프트웨어 외주 개발
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                복잡한 비즈니스 로직, 웹/앱 신규 개발, AI 에이전트 시스템을 일반 외주가 아닌
                FDE(전담 파견 엔지니어) 수준의 높은 기술력으로 책임 구현합니다.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-neutral-300 border-t border-neutral-800 pt-4">
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>고난도 AI 워크플로우:</strong> 멀티 에이전트, 벡터 DB 파이프라인, 비정형 데이터 정제 시스템
                </span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>사내 시스템 심층 연동:</strong> 슬랙/잔디 메신저 봇, ERP 및 사내 레거시 데이터베이스 안정적 결합
                </span>
              </li>
              <li className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>풀스택 턴키 인계:</strong> Docker 컨테이너화, 정밀한 API 문서, 클린 코드로 지속 가능한 인수인계
                </span>
              </li>
            </ul>

            <a
              href="#consult"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white hover:underline pt-2"
            >
              <span>맞춤 외주 프로젝트 견적 의뢰</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 5. Section: 14-Day Timeline */}
      <section
        id="timeline"
        className="py-20 px-6 max-w-5xl mx-auto border-t border-neutral-800"
      >
        <div className="space-y-3 mb-12">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Timeline &middot; 도입 절차
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white">
            14일 완제품 납품 프로세스
          </h2>
          <p className="text-sm text-neutral-400">
            6개월씩 걸리는 대기업 SI와 다릅니다. 최적화된 스프린트로 실무 직원이 바로 쓰는 상태로 인계합니다.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-neutral-900/50 border border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <span className="font-mono text-xs text-neutral-400 px-2.5 py-1 bg-neutral-800 rounded">
                Day 01 - 03
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  현장 인프라 실사 및 하드웨어 스펙 확정
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  고객사 망분리 환경 및 데이터 유형 분석, 거품 없는 최적 기기 구매 가이드
                </p>
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-500 shrink-0">요구사항 정의</div>
          </div>

          <div className="p-5 bg-neutral-900/50 border border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <span className="font-mono text-xs text-neutral-400 px-2.5 py-1 bg-neutral-800 rounded">
                Day 04 - 07
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  베어메탈 OS/CUDA 셋업 &amp; 로컬 LLM 오프라인 빌드
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  FDE 엔지니어 현장/원격 투입. 외부 통신 차단 환경에서 고속 추론 vLLM 엔진 세팅
                </p>
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-500 shrink-0">인프라 구축</div>
          </div>

          <div className="p-5 bg-neutral-900/50 border border-neutral-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <span className="font-mono text-xs text-neutral-400 px-2.5 py-1 bg-neutral-800 rounded">
                Day 08 - 11
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  사내 비공개 데이터 RAG 결합 &amp; 맞춤 웹 포털 배포
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  사규, 매뉴얼, 계약서 벡터 인덱싱 및 비개발자가 브라우저로 접속하는 UI 완성
                </p>
              </div>
            </div>
            <div className="text-xs font-mono text-neutral-500 shrink-0">소프트웨어 연동</div>
          </div>

          <div className="p-5 bg-neutral-900/80 border border-emerald-500/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-4">
              <span className="font-mono text-xs text-dark-950 font-bold px-2.5 py-1 bg-emerald-400 rounded">
                Day 12 - 14
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  보안 검증, 전 직원 실무 교육 및 턴키 인수인계
                </h4>
                <p className="text-xs text-neutral-300 mt-1">
                  망분리 보안 감사 확인, 직원 대상 질의응답 교육, 하드웨어 락 적용 및 최종 납품
                </p>
              </div>
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold shrink-0">서비스 개시</div>
          </div>
        </div>
      </section>

      {/* 6. Section: Security & IP Protection + Pricing */}
      <section
        id="security"
        className="py-20 px-6 max-w-5xl mx-auto border-t border-neutral-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* IP Protection */}
          <div className="space-y-5">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Security Guarantee &middot; 솔루션 보호
            </div>
            <h2 className="font-serif text-2xl text-white">
              납품 시 소스코드 및 지적재산권 보호 원칙
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              고객사 현장에 솔루션을 구축할 때도 공급사와 고객사 모두의 권리를 철저히
              보호합니다.
            </p>
            <div className="space-y-3 text-xs text-neutral-300">
              <div className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded">
                <span className="font-bold text-white block mb-1">컴파일 바이너리 &amp; Docker 배포</span>
                원본 소스코드를 열람 가능한 형태로 두지 않고 난독화 및 실행 바이너리 형태로 패키징하여 배포합니다.
              </div>
              <div className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded">
                <span className="font-bold text-white block mb-1">하드웨어 고유 라이선스 락</span>
                고객사 기기의 고유 하드웨어 ID에 종속된 라이선스 키를 발급하여 무단 유출 및 복제를 원천 차단합니다.
              </div>
              <div className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded">
                <span className="font-bold text-white block mb-1">상호 비밀유지협약 (NDA) 체결</span>
                상담 및 착수 전 상호 법적 효력을 갖는 비밀유지협약을 체결하여 기밀 유출 위험을 0%로 통제합니다.
              </div>
            </div>
          </div>

          {/* Pricing Model */}
          <div className="space-y-5">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Pricing &middot; 투명한 비용 체계
            </div>
            <h2 className="font-serif text-2xl text-white">
              초기 구축비 + 선택적 유지보수
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              사전에 정의된 범위 내에서 예측 가능한 비용을 정찰제로 제시합니다.
            </p>

            <div className="space-y-4">
              <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    Phase 1 &middot; Turnkey Build
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">1회성 납품</span>
                </div>
                <h4 className="text-base font-bold text-white">초기 턴키 구축비</h4>
                <p className="text-xs text-neutral-400">
                  사전 타당성 분석, 장비 스펙 확정, 사내망 서버 셋업, 전용 웹 포털 커스텀 개발 및 교육까지 포함된 확정 비용.
                </p>
              </div>

              <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase font-mono">
                    Phase 2 &middot; Maintenance &amp; SLA
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400">선택적 월 계약</span>
                </div>
                <h4 className="text-base font-bold text-white">월 유지보수 &amp; 기술 지원</h4>
                <p className="text-xs text-neutral-400">
                  사내 문서 추가 시 지속적인 RAG 최적화, 오픈소스 최신 모델 업그레이드, 장애 대응 전담 엔지니어 핫라인 배정.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Consultation Booking Form */}
      <section
        id="consult"
        className="py-24 px-6 max-w-3xl mx-auto border-t border-neutral-800"
      >
        <div className="text-center space-y-3 mb-10">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Direct Consultation
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-white">
            대표 파트너 직통 기술 미팅 신청
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            영업 사원이 아닌 실제 구축을 진행할 실무 FDE 엔지니어가 직접 회사의 인프라와
            과제를 검토합니다. 24시간 이내에 회신드립니다.
          </p>
        </div>

        <div className="p-8 sm:p-10 bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-2xl">
          {submitResult && (
            <div
              className={`p-4 rounded-lg mb-6 text-xs font-medium ${
                submitResult.success
                  ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                  : "bg-rose-950/80 border border-rose-500/40 text-rose-300"
              }`}
            >
              {submitResult.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">
                  기업명 / 기관명 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="(주)회사명"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full bg-[#08090c] border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-neutral-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">
                  담당자 성함 / 직함 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="홍길동 팀장"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[#08090c] border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-neutral-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">
                  연락처 (휴대전화) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="010-0000-0000"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  className="w-full bg-[#08090c] border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-neutral-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1.5 font-medium">
                  회사 이메일 *
                </label>
                <input
                  type="email"
                  required
                  placeholder="contact@company.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[#08090c] border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-neutral-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">
                문의 분야
              </label>
              <select
                value={formData.serviceType}
                onChange={(e) =>
                  setFormData({ ...formData, serviceType: e.target.value })
                }
                className="w-full bg-[#08090c] border border-neutral-800 rounded-lg p-3 text-white focus:border-neutral-500 outline-none transition"
              >
                <option>사내 폐쇄망 온프레미스 AI 턴키 구축 (하드웨어 추천 포함)</option>
                <option>맞춤형 AI 및 소프트웨어 외주 개발 의뢰</option>
                <option>사내 문서(PDF/규정) RAG 검색 포털 구축</option>
                <option>사내 메신저(슬랙/잔디) AI 챗봇 연동</option>
                <option>기타 기술 컨설팅 및 파트너십</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 mb-1.5 font-medium">
                프로젝트 개요 및 사내 인프라 상황
              </label>
              <textarea
                rows={3}
                placeholder="예: 외부망 차단 환경이며 직원 수는 60명입니다. 사내 인사/총무 규정 및 기술 매뉴얼 검색용 AI 도입을 희망하며 GPU 장비 구매 가이드가 필요합니다."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-[#08090c] border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-neutral-500 outline-none transition"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs sm:text-sm rounded-lg transition shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? "접수 처리 중..." : "비공개 기술 미팅 및 견적 신청서 접수 →"}
            </button>

            <p className="text-[11px] text-neutral-500 text-center pt-1">
              입력하신 모든 정보는 기밀유지협약(NDA)에 따라 철저히 보호되며 기술 상담 외 다른 용도로 사용되지 않습니다.
            </p>
          </form>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-neutral-800/80 py-12 px-6 text-center text-xs text-neutral-500 space-y-3">
        <div className="font-serif text-sm font-bold text-neutral-400">
          TACO STUDIO &middot; taco-studio.ai
        </div>
        <div className="max-w-xl mx-auto text-[11px] leading-relaxed text-neutral-500">
          Forward Deployed Engineering Practice for Enterprise AI &amp; Custom Software.<br />
          100% Air-Gapped Compliance &middot; Non-Disclosure Agreement Guaranteed.
        </div>
        <div className="text-[11px] text-neutral-600 pt-2">
          &copy; 2026 Taco Studio. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
