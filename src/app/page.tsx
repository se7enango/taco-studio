"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    contact: "",
    email: "",
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
        body: JSON.stringify({
          ...formData,
          serviceType: "Variant C Executive Brief 문의",
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setSubmitResult({
          success: true,
          message: data.message || "기술 상담 요청이 정상 전달되었습니다.",
        });
        setFormData({
          company: "",
          name: "",
          contact: "",
          email: "",
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
        message: "네트워크 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen font-sans">
      {/* Minimal Header */}
      <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-serif font-bold text-lg sm:text-xl tracking-tight text-white whitespace-nowrap hover:opacity-90 transition">
            Taco Studio
          </a>
          <div className="flex items-center space-x-4 sm:space-x-6 text-xs text-neutral-400 font-medium">
            <a href="#thesis" className="hidden sm:inline hover:text-white transition">
              The Thesis
            </a>
            <a href="#engagements" className="hidden sm:inline hover:text-white transition">
              Engagements
            </a>
            <a
              href="#consult-c"
              className="px-3 py-1.5 border border-neutral-700 text-white hover:bg-neutral-900 rounded transition whitespace-nowrap"
            >
              Book Partner
            </a>
          </div>
        </div>
      </header>

      {/* Hero: First Viewport Screen (Only the two headline lines) */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-between px-6 max-w-5xl mx-auto py-12">
        <div className="pt-4">
          <div className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
            Foundry &amp; Deployment / 2026
          </div>
        </div>

        <div className="my-auto py-12">
          <h1 className="font-serif text-[19px] min-[370px]:text-[20px] min-[400px]:text-[23px] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.3] font-normal tracking-tight">
            <span className="block whitespace-nowrap">우리는 소프트웨어와 인공지능을</span>
            <span className="block whitespace-nowrap text-neutral-300 mt-2">정직하게 그리고 확실하게 만듭니다.</span>
          </h1>
        </div>

        <div className="pb-4 flex items-center space-x-2 text-xs font-mono text-neutral-500 animate-bounce">
          <span>스크롤하여 본문 읽기</span>
          <span>&darr;</span>
        </div>
      </section>

      {/* Main Body Section (Revealed on Scroll) */}
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-12 border-t border-neutral-800/80">
        <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed font-light">
          비싼 GPU 장비를 사놓고 콘솔에 방치하는 기업과, 역량 있는 AI 엔지니어를 구하지 못해 멈춰선 팀을 위해 
          Taco Studio는 고객의 현장으로 직접 들어갑니다.
        </p>

        {/* Key Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-b border-neutral-800 py-6 text-sm">
          <div>
            <div className="font-serif text-2xl text-white">100%</div>
            <div className="text-xs text-neutral-500 mt-0.5 font-mono">Air-Gapped Compliance</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-white">14 Days</div>
            <div className="text-xs text-neutral-500 mt-0.5 font-mono">Average Turnkey Delivery</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-white">Zero</div>
            <div className="text-xs text-neutral-500 mt-0.5 font-mono">Outbound Data Leaks</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-white">FDE Model</div>
            <div className="text-xs text-neutral-500 mt-0.5 font-mono">Dedicated Hands-on Team</div>
          </div>
        </div>
      </section>

      {/* The Thesis */}
      <section id="thesis" className="py-16 px-6 max-w-4xl mx-auto space-y-12">
        <h2 className="font-serif text-2xl text-white">우리가 해결하는 세 가지 장벽</h2>
        
        <div className="space-y-8 text-neutral-300 text-sm leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-neutral-800/80">
            <div className="md:col-span-3 font-mono text-xs text-neutral-500">01 / PRIVACY TRAP</div>
            <div className="md:col-span-9 space-y-2">
              <h3 className="text-base font-bold text-white">클라우드 API의 데이터 유출과 규제 위반</h3>
              <p className="text-neutral-400">
                ChatGPT나 Claude API는 편리하지만, 제조 도면, 회계 기밀, 인사 평가, 비공개 소스코드를 보내는 순간 사규와 법령을 위반하게 됩니다. Taco Studio는 인터넷이 전혀 닿지 않는 폐쇄망에서 100% 자립 구동되는 로컬 LLM 환경을 구축합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-8 border-b border-neutral-800/80">
            <div className="md:col-span-3 font-mono text-xs text-neutral-500">02 / HARDWARE WASTE</div>
            <div className="md:col-span-9 space-y-2">
              <h3 className="text-base font-bold text-white">수천만 원대 장비 방치와 비개발자의 소외</h3>
              <p className="text-neutral-400">
                엔지니어가 없는 조직에 서버만 갖다 놓으면 아무도 쓰지 못합니다. 우리는 하드웨어 셋업뿐만 아니라, 일반 사원이 브라우저만 열면 사내 문서를 즉시 검색하고 보고서를 쓰는 &apos;완성된 웹 포털&apos;까지 만들어 인계합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-3 font-mono text-xs text-neutral-500">03 / TALENT GAP</div>
            <div className="md:col-span-9 space-y-2">
              <h3 className="text-base font-bold text-white">억대 연봉 AI 엔지니어 채용의 현실적 한계</h3>
              <p className="text-neutral-400">
                AI 팀을 직접 빌딩하려면 채용에만 수개월, 수억 원의 고정비가 듭니다. Taco Studio의 FDE(Forward Deployed Engineer)를 통해 필요한 순간 즉시 최고 수준의 엔지니어링을 프로젝트 단위로 공급받을 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Engagements */}
      <section id="engagements" className="py-16 px-6 max-w-4xl mx-auto border-t border-neutral-800">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl text-white">Engagement Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg space-y-3">
              <h3 className="font-bold text-white text-base">온프레미스 에어갭 어플라이언스</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                서버 구매 지원부터 현장 OS/LLM 세팅, 사내 RAG 포털 구축까지 1회성 턴키 납품. 기기 내 컴파일 바이너리 패키징으로 소스코드 유출 없이 안전하게 공급합니다.
              </p>
              <div className="pt-2 text-xs font-mono text-neutral-300">소요 기간: 14일 / 고정 견적 계약</div>
            </div>

            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-lg space-y-3">
              <h3 className="font-bold text-white text-base">맞춤형 소프트웨어 &amp; AI 외주 개발</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                사내 데이터 파이프라인, AI 챗봇 및 업무 자동화 에이전트, 신규 웹/앱 풀스택 개발. 요구사항 명세부터 배포까지 전담 FDE가 직접 구현합니다.
              </p>
              <div className="pt-2 text-xs font-mono text-neutral-300">스프린트 기반 납품 / 산출물 100% 인계</div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation CTA */}
      <section id="consult-c" className="py-20 px-6 max-w-2xl mx-auto text-center space-y-6 border-t border-neutral-800">
        <h2 className="font-serif text-3xl text-white">대표 파트너 직통 기술 미팅</h2>
        <p className="text-sm text-neutral-400">
          영업 사원이 아닌 실무 엔지니어가 직접 회사의 인프라와 개발 과제를 검토합니다. 
          아래 양식으로 남겨주시면 당일 내로 회신드립니다.
        </p>

        {submitResult && (
          <div
            className={`p-3 rounded text-xs text-center max-w-md mx-auto ${
              submitResult.success
                ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/80 border border-rose-500/40 text-rose-300"
            }`}
          >
            {submitResult.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-left max-w-md mx-auto">
          <input
            type="text"
            required
            placeholder="회사명 / 성함 / 직함"
            value={formData.name ? `${formData.company} / ${formData.name}` : formData.company}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({ ...formData, company: val, name: val });
            }}
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white outline-none focus:border-neutral-500 transition"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="tel"
              required
              placeholder="연락처 (010-0000-0000)"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white outline-none focus:border-neutral-500 transition"
            />
            <input
              type="email"
              required
              placeholder="회사 이메일"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white outline-none focus:border-neutral-500 transition"
            />
          </div>
          <textarea
            rows={3}
            placeholder="도입을 검토 중인 과제나 프로젝트 개요"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-3.5 py-2.5 text-xs text-white outline-none focus:border-neutral-500 transition"
          ></textarea>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-white text-neutral-950 font-bold text-xs rounded hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {isSubmitting ? "접수 중..." : "비공개 기술 미팅 요청"}
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 py-10 px-6 text-center text-xs text-neutral-500 space-y-2">
        <div className="font-serif font-bold text-neutral-400">Taco Studio &middot; taco-studio.ai</div>
        <div>Forward Deployed Engineering Practice for Enterprise AI &amp; Software</div>
        <div>&copy; 2026 Taco Studio. All rights reserved. 100% Non-Disclosure Guaranteed.</div>
      </footer>
    </div>
  );
}
