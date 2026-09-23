import { ImageResponse } from "next/og";

export const alt = "NativeApply — job applications that read like native English";
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
          justifyContent: "space-between",
          background: "#FBFAF7",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "linear-gradient(135deg, #2764E7 0%, #10233F 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, color: "#10233F" }}>NativeApply</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: "#10233F",
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Job applications that read like native English
          </div>
          <div style={{ fontSize: 30, color: "#667085", maxWidth: 820, lineHeight: 1.4 }}>
            Cover letters, resume bullets and recruiter messages — rewritten, with every fact unchanged.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              background: "#2764E7",
              color: "white",
              fontSize: 24,
              fontWeight: 600,
              padding: "14px 28px",
              borderRadius: 999,
              display: "flex",
            }}
          >
            $14/month or $49 lifetime
          </div>
          <div style={{ fontSize: 24, color: "#667085", display: "flex" }}>nativeapply.net</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
