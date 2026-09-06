import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { company, name, contact, email, serviceType, message } = body;

    if (!company || !name || !contact || !email) {
      return NextResponse.json(
        { error: "필수 정보(회사명, 성함, 연락처, 이메일)를 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    // 서버 로그 기록 (추후 이메일 발송 또는 Slack Webhook 연동)
    console.log("[Taco Studio 신규 문의 접수]:", {
      company,
      name,
      contact,
      email,
      serviceType: serviceType || "온프레미스 AI 턴키 구축",
      message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "기술 상담 신청이 정상 접수되었습니다. 24시간 이내에 담당 엔지니어가 직접 연락드리겠습니다.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "서버 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }
}
