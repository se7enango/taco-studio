import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** 임시 모노그램입니다. 정식 로고가 생기면 apple-icon.png 파일로 교체해 주세요. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fafafa",
          fontSize: 120,
          fontFamily: "serif",
        }}
      >
        T
      </div>
    ),
    size,
  );
}
