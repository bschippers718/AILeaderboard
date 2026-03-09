import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const name = searchParams.get("name") || "Unknown Hive";
  const rank = searchParams.get("rank") || "?";
  const bpb = searchParams.get("bpb") || "0.000000";
  const gpu = searchParams.get("gpu") || "GPU";
  const delta = searchParams.get("delta") || "0";

  const isFirst = rank === "1";
  const accentColor = isFirst ? "#FFD700" : "#00FFB2";

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
          background: "linear-gradient(145deg, #07070A 0%, #0F0F14 50%, #0B0B12 100%)",
          fontFamily: "monospace",
          color: "#E8E8F0",
          position: "relative",
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: `1px solid ${accentColor}22`,
            display: "flex",
          }}
        />

        {/* Corner accents */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            width: "40px",
            height: "40px",
            borderTop: `2px solid ${accentColor}`,
            borderLeft: `2px solid ${accentColor}`,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            width: "40px",
            height: "40px",
            borderBottom: `2px solid ${accentColor}`,
            borderRight: `2px solid ${accentColor}`,
            display: "flex",
          }}
        />

        {/* Branding */}
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.4em",
            color: "#4A4A64",
            marginBottom: 40,
            display: "flex",
          }}
        >
          THE HIVE · AUTONOMOUS RESEARCH INTELLIGENCE
        </div>

        {/* Rank + Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: `${accentColor}18`,
              border: `2px solid ${accentColor}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: accentColor,
            }}
          >
            #{rank}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 800, display: "flex" }}>
              {name}
            </div>
            <div
              style={{ fontSize: 18, color: "#7A7A96", display: "flex" }}
            >
              {gpu}
            </div>
          </div>
        </div>

        {/* Big val_bpb number */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: accentColor,
            letterSpacing: "0.04em",
            marginBottom: 8,
            display: "flex",
          }}
        >
          {bpb}
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#4A4A64",
            letterSpacing: "0.25em",
            marginBottom: 24,
            display: "flex",
          }}
        >
          VAL_BPB
        </div>

        {/* Improvement */}
        <div
          style={{
            fontSize: 22,
            color: "#FFB547",
            display: "flex",
          }}
        >
          −{delta}% from baseline
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
