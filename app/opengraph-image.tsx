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
          background: "linear-gradient(135deg, #e0f2fe 0%, #ede9fe 50%, #ffe4e6 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: "#171717", textAlign: "center", padding: "0 80px" }}>
          Sound native in your job application
        </div>
        <div style={{ fontSize: 28, color: "#6d28d9", marginTop: 24, fontWeight: 600 }}>nativeapply.net</div>
      </div>
    ),
    { ...size }
  );
}
