import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2764E7 0%, #10233F 100%)",
          borderRadius: 8,
          color: "white",
          fontSize: 21,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: -1,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          <path d="M10 23V10M10 16.5h11.6M21.6 23V8.6" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m18.8 11.4 2.8-2.8 2.8 2.8" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
