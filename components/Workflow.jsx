const INPUTS = ["Email client", "Appel entrant", "Bon de travail", "Fichier Excel", "Demande web"];
const OUTPUTS = ["Tournée planifiée", "Intervention créée", "Technicien notifié", "RDV pris 24/7", "Rapport généré"];

function Pill({ label, side }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 9, padding: "10px 14px", borderRadius: 10,
        background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)",
        font: "500 13px 'Hanken Grotesk',sans-serif", color: "#C6CCE8",
        justifyContent: side === "r" ? "flex-start" : "flex-end",
      }}
    >
      {side === "r" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4FDDA9", boxShadow: "0 0 8px #4FDDA9" }} />}
      {label}
      {side === "l" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#8B7BFF", boxShadow: "0 0 8px #8B7BFF" }} />}
    </div>
  );
}

function Col({ items, side }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((t, i) => <Pill key={i} label={t} side={side} />)}
    </div>
  );
}

function Engine() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <span
        style={{
          width: 86, height: 86, borderRadius: 24, background: "linear-gradient(135deg,#8B5CFF,#4FA8FF)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 50px rgba(139,92,255,.6)", border: "1px solid rgba(255,255,255,.3)",
          animation: "nx-glow 3.4s ease-in-out infinite",
        }}
      >
        <svg width="42" height="42" viewBox="0 0 32 32" fill="none">
          <path d="M16 4l1.9 9.1L27 16l-9.1 2.9L16 28l-1.9-9.1L5 16l9.1-2.9L16 4z" fill="#fff" />
        </svg>
      </span>
      <span style={{ font: "600 14px 'Space Grotesk',sans-serif", color: "#E8EAF8", textAlign: "center" }}>
        Votre application<br />Cieva
      </span>
    </div>
  );
}

function Lines({ flip }) {
  return (
    <svg viewBox="0 0 120 300" preserveAspectRatio="none" style={{ width: "100%", height: 300 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={flip
            ? `M0,150 C50,150 70,${30 + i * 60} 120,${30 + i * 60}`
            : `M0,${30 + i * 60} C50,${30 + i * 60} 70,150 120,150`}
          stroke="rgba(140,130,255,.3)" strokeWidth="1.4" fill="none" strokeDasharray="4 5"
          style={{ animation: `nx-dash ${6 + i}s linear infinite` }}
        />
      ))}
    </svg>
  );
}

export default function Workflow() {
  return (
    <section data-screen-label="Workflow" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px", textAlign: "center" }}>
        <h2 data-reveal="" className="h2">Votre exploitation, automatisée</h2>
        <p data-reveal="" className="lead" style={{ marginBottom: 44, maxWidth: 460 }}>
          Tout ce qui arrive — emails, appels, bons de travail — est trié, planifié et transformé en
          actions par votre application.
        </p>
        <div data-reveal="">
          <div
            className="workflow-grid"
            style={{
              display: "grid", gridTemplateColumns: "200px 110px auto 110px 200px", alignItems: "center",
              gap: 0, justifyContent: "center", padding: 30, borderRadius: 20,
              border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)",
            }}
          >
            <Col items={INPUTS} side="l" />
            <Lines flip={false} />
            <Engine />
            <Lines flip />
            <Col items={OUTPUTS} side="r" />
          </div>
          {/* Mobile fallback */}
          <div className="workflow-mobile" style={{ display: "none", flexDirection: "column", gap: 20, padding: 24, borderRadius: 20, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)" }}>
            <Col items={INPUTS} side="l" />
            <Engine />
            <Col items={OUTPUTS} side="r" />
          </div>
        </div>
      </div>
    </section>
  );
}
