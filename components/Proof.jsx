export default function Proof() {
  return (
    <section id="preuve" data-screen-label="Preuve" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 42 }}>
          <h2 className="h2">La preuve par les chiffres</h2>
          <p className="lead" style={{ maxWidth: 440 }}>Un ROI que vous pouvez mesurer, pas des promesses.</p>
        </div>
        <div
          data-reveal="" className="proof-grid"
          style={{
            borderRadius: 18, border: "1px solid rgba(139,124,255,.35)",
            background: "linear-gradient(135deg,rgba(123,92,255,.12),rgba(79,168,255,.07))",
            padding: "44px 40px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 48, alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
              <span style={{ font: "700 clamp(48px,7vw,84px)/.9 'Space Grotesk',sans-serif", letterSpacing: "-.03em", color: "#F2F4FF" }}>17</span>
              <svg width="34" height="24" viewBox="0 0 40 28" fill="none"><path d="M4 14h30M26 6l9 8-9 8" stroke="#8B7BFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="grad" style={{ font: "700 clamp(48px,7vw,84px)/.9 'Space Grotesk',sans-serif", letterSpacing: "-.03em" }}>30</span>
            </div>
            <div style={{ font: "600 17px 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>camions</div>
            <div style={{ font: "400 14.5px 'Hanken Grotesk',sans-serif", color: "#9AA2C4", marginTop: 4 }}>sans embaucher d'exploitant</div>
          </div>
          <div>
            <p style={{ margin: "0 0 18px", font: "400 clamp(17px,1.9vw,21px)/1.55 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>
              « On a presque doublé la flotte en gardant la même équipe au bureau. Cieva gère le
              dispatch que je faisais de tête. »
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7B5CFF,#4FA8FF)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 14px 'Space Grotesk',sans-serif", color: "#fff" }}>T</span>
              <div>
                <div style={{ font: "600 14px 'Hanken Grotesk',sans-serif", color: "#EDEFFA" }}>Dirigeant</div>
                <div style={{ font: "400 12.5px 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>Transporteur régional · client Sielo</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
