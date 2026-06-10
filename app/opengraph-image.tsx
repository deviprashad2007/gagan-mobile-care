import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Gagan Mobile Hospital — Phone Repair in Patiala, Punjab";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0A0A0A",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: "#E63329",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            G
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>
            Gagan Mobile Hospital
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5 }}>
            Phone Repair in Patiala, Punjab
          </div>
          <div style={{ fontSize: 30, color: "#A8A8A8", maxWidth: 900 }}>
            Screen, battery, charging port &amp; more — genuine parts, 6-month warranty.
            Walk in or send by post from anywhere in India.
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 24, color: "#A8A8A8" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#E63329", fontWeight: 700 }}>★ 4.8</span>
            <span>2,100+ Google reviews</span>
          </div>
          <div>50,000+ phones repaired</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
