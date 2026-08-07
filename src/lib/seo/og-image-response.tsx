import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export type OgImageVariant = "default" | "quant-protocol" | "launch" | "stack";

const COPY: Record<
  OgImageVariant,
  { eyebrow: string; title: string; subtitle: string; pills: string[] }
> = {
  default: {
    eyebrow: "QUICKSILVER ALGO SYSTEMS",
    title: "Full trader arsenal",
    subtitle: "Playbook · Tools · Academy · Terminal · Guidance",
    pills: ["Prop firm ready", "Premium Quant", "quicksilveralgo.com"],
  },
  "quant-protocol": {
    eyebrow: "PREMIUM QUANT · TRADELOCKER DESKTOP",
    title: "Quant Protocol + full stack",
    subtitle: "Bot access with playbook, risk tools, academy & live terminal",
    pills: ["Not bot-only", "Desktop required", "quicksilveralgo.com"],
  },
  launch: {
    eyebrow: "7-DAY PROP FIRM PLAYBOOK",
    title: "Pass with process",
    subtitle: "Daily caps · consistency rules · challenge tracker",
    pills: ["Prop firm", "Risk system", "quicksilveralgo.com"],
  },
  stack: {
    eyebrow: "ONE SUBSCRIPTION",
    title: "The full Quicksilver stack",
    subtitle: "Automation optional — the system is the product",
    pills: ["Playbook", "Tools", "Academy", "Terminal"],
  },
};

/**
 * Shared 1200×630 Open Graph / Twitter card image (Satori via next/og).
 */
export function createOgImageResponse(variant: OgImageVariant = "default") {
  const copy = COPY[variant] ?? COPY.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #05060a 0%, #0a1220 45%, #061018 100%)",
          padding: "56px 64px",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* cyan glow */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -40,
            width: 420,
            height: 420,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(0,229,255,0.22) 0%, rgba(0,229,255,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -60,
            width: 480,
            height: 480,
            borderRadius: 999,
            background:
              "radial-gradient(circle, rgba(245,165,36,0.12) 0%, rgba(245,165,36,0) 70%)",
            display: "flex",
          }}
        />
        {/* grid line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 64,
            right: 64,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(0,229,255,0.45), transparent)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                border: "1px solid rgba(0,229,255,0.45)",
                background:
                  "linear-gradient(145deg, rgba(0,229,255,0.2), rgba(15,23,42,0.9))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#67e8f9",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              QS
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div
                style={{
                  color: "#e2e8f0",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                QUICKSILVER
                <span style={{ color: "#22d3ee" }}>.ALGO</span>
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: 16,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                }}
              >
                {copy.eyebrow}
              </div>
            </div>
          </div>

          <div
            style={{
              color: "#f8fafc",
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 980,
              marginTop: 12,
            }}
          >
            {copy.title}
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: 28,
              lineHeight: 1.35,
              maxWidth: 920,
            }}
          >
            {copy.subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            position: "relative",
          }}
        >
          {copy.pills.map((pill) => (
            <div
              key={pill}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid rgba(0,229,255,0.28)",
                background: "rgba(15,23,42,0.75)",
                color: "#e2e8f0",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {pill}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
    }
  );
}
