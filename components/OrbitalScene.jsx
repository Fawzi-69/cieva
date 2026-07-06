import { LogoMark } from "./Logo";

const RINGS = [520, 720, 940, 1160];
const PATHS = [
  "M170,120 C300,140 420,220 560,300",
  "M120,380 C280,380 420,340 560,315",
  "M1030,110 C900,150 740,230 640,300",
  "M1090,370 C940,370 760,340 645,315",
];

export default function OrbitalScene() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }} aria-hidden="true">
      {/* glow */}
      <span
        style={{
          position: "absolute", left: "50%", top: "58%", width: 420, height: 190,
          transform: "translate(-50%,-50%)", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(123,92,255,.4), rgba(79,168,255,.12) 55%, transparent 75%)",
          filter: "blur(14px)",
        }}
      />
      {/* rings */}
      {RINGS.map((w, i) => (
        <span
          key={i}
          style={{
            position: "absolute", left: "50%", top: "58%", width: w, height: w * 0.34,
            transform: "translate(-50%,-50%)", borderRadius: "50%",
            border: `1px solid rgba(130,120,255,${(0.28 - i * 0.05).toFixed(2)})`,
            boxShadow: "0 0 30px rgba(120,92,255,.06)",
            animation: `nx-ring ${5 + i * 1.5}s ease-in-out ${i * 0.8}s infinite`,
          }}
        />
      ))}
      {/* dashed trajectories */}
      <svg
        viewBox="0 0 1200 480" preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {PATHS.map((d, i) => (
          <path
            key={i} d={d} stroke="rgba(140,130,255,.35)" strokeWidth="1.2" fill="none" strokeDasharray="5 6"
            style={{ animation: `nx-dash ${7 + i}s linear infinite` }}
          />
        ))}
      </svg>
      {/* core */}
      <span
        style={{
          position: "absolute", left: "50%", top: "58%", transform: "translate(-50%,-58%)",
          width: 96, height: 96, borderRadius: 26, background: "linear-gradient(135deg,#8B5CFF,#4FA8FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 60px rgba(139,92,255,.8), 0 24px 60px rgba(0,0,0,.5)",
          border: "1px solid rgba(255,255,255,.3)", animation: "nx-glow 3.4s ease-in-out infinite",
        }}
      >
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
          <path d="M16 4l1.9 9.1L27 16l-9.1 2.9L16 28l-1.9-9.1L5 16l9.1-2.9L16 4z" fill="#fff" />
        </svg>
      </span>
    </div>
  );
}

export function Planet({ main, ring, size }) {
  return (
    <span style={{ position: "relative", display: "inline-block", width: size, height: size }} aria-hidden="true">
      <span
        style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `radial-gradient(circle at 34% 30%, ${main}, #0B0E20 78%)`,
          boxShadow: `0 0 24px ${ring}55`,
        }}
      />
      <span
        style={{
          position: "absolute", left: "-22%", top: "38%", width: "144%", height: "26%",
          borderRadius: "50%", border: `2px solid ${ring}88`, transform: "rotate(-16deg)",
        }}
      />
    </span>
  );
}

export function GlassCard({ title, accent, wide }) {
  const widths = [70, 92, 58];
  return (
    <div
      className="float-card"
      style={{
        width: wide ? 176 : 150, padding: "14px 16px", borderRadius: 13,
        background: "linear-gradient(160deg, rgba(30,34,64,.85), rgba(14,16,34,.9))",
        border: "1px solid rgba(255,255,255,.12)",
        boxShadow: `0 16px 40px rgba(0,0,0,.5), 0 0 22px ${accent}22`,
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 11 }}>
        {widths.map((w, i) => (
          <span
            key={i}
            style={{
              display: "block", height: 5, borderRadius: 3, width: `${w}%`,
              background: i === 0 ? `${accent}AA` : "rgba(255,255,255,.14)",
            }}
          />
        ))}
      </div>
      <div style={{ font: "600 11.5px 'Space Grotesk',sans-serif", color: "#DDE2F6", whiteSpace: "nowrap" }}>
        {title}
      </div>
    </div>
  );
}
