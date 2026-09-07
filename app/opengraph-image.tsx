import { ImageResponse } from "next/og";

export const alt = "NativeApply";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "black", textAlign: "center", padding: "0 80px" }}>
          Sound native in your job application
        </div>
        <div style={{ fontSize: 28, color: "#737373", marginTop: 24 }}>nativeapply.net</div>
      </div>
    ),
    { ...size }
  );
}
