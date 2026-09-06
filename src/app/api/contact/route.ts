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

    const payload = {
      company,
      name,
      contact,
      email,
      serviceType: serviceType || "온프레미스 AI 턴키 구축",
      message: message || "(내용 없음)",
      receivedAt: new Date().toISOString(),
    };

    // 1. Vercel 런타임 로그 기록 (Vercel 대시보드 > Logs에서 확인 가능)
    console.log("[Taco Studio 신규 문의 접수]:", JSON.stringify(payload, null, 2));

    // 2. 만약 환경변수에 SLACK_WEBHOOK_URL 또는 DISCORD_WEBHOOK_URL이 등록되어 있다면 실시간 알림 발송
    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    const discordUrl = process.env.DISCORD_WEBHOOK_URL;

    if (slackUrl) {
      try {
        await fetch(slackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: `📢 *[Taco Studio 신규 문의 도착]*\n- *기업/성함*: ${company} / ${name}\n- *연락처*: ${contact}\n- *이메일*: ${email}\n- *내용*: ${message || "(없음)"}`,
          }),
        });
      } catch (err) {
        console.error("Slack webhook notification failed:", err);
      }
    } else if (discordUrl) {
      try {
        await fetch(discordUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `📢 **[Taco Studio 신규 문의]**\n• **기업/성함**: ${company} / ${name}\n• **연락처**: ${contact}\n• **이메일**: ${email}\n• **내용**: ${message || "(없음)"}`,
          }),
        });
      } catch (err) {
        console.error("Discord webhook notification failed:", err);
      }
    }

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
