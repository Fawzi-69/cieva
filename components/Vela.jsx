import { LogoMark } from "./Logo";

export default function Vela() {
  return (
    <section data-screen-label="Vela" style={{ position: "relative", zIndex: 2, padding: "96px 0 0" }}>
      <div
        className="split"
        style={{
          maxWidth: 1080, margin: "0 auto", padding: "0 32px",
          display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 52, alignItems: "center",
        }}
      >
        <div data-reveal="">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#7C5CFF", boxShadow: "0 0 12px #7C5CFF" }} />
            <span style={{ font: "600 13px 'Space Grotesk',sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "#B49BFF" }}>
              Vela · Interventions techniques
            </span>
          </div>
          <h2 style={{ margin: "0 0 16px", font: "600 clamp(28px,3.2vw,40px)/1.12 'Space Grotesk',sans-serif", letterSpacing: "-.02em", color: "#F2F4FF" }}>
            Vos emails deviennent des interventions. Automatiquement.
          </h2>
          <p style={{ margin: "0 0 26px", font: "400 16px/1.65 'Hanken Grotesk',sans-serif", color: "#9AA2C4" }}>
            Une demande client arrive par email : Vela la lit, crée l'intervention, la place dans le
            planning et prévient le bon technicien. Zéro ressaisie, zéro oubli.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a href="#demo" style={{ padding: "12px 20px", borderRadius: 10, background: "linear-gradient(135deg,#7B5CFF,#4FA8FF)", color: "#fff", font: "600 14px 'Space Grotesk',sans-serif", boxShadow: "0 8px 24px rgba(110,92,255,.4)" }}>
              Réserver une démo
            </a>
            <a href="#produits" className="lnk" style={{ font: "600 14px 'Hanken Grotesk',sans-serif", color: "#B9C0DE" }}>Tous les produits</a>
          </div>
        </div>

        <div data-reveal="" style={{ borderRadius: 18, border: "1px solid rgba(255,255,255,.1)", background: "linear-gradient(180deg,rgba(24,28,52,.85),rgba(14,17,34,.9))", padding: 22, boxShadow: "0 24px 60px rgba(0,0,0,.45)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <LogoMark size={26} />
            <span style={{ font: "600 13.5px 'Space Grotesk',sans-serif", color: "#E8EAF8" }}>Vela</span>
            <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#3DDC97", boxShadow: "0 0 8px #3DDC97" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ alignSelf: "flex-start", maxWidth: "88%", padding: "12px 14px", borderRadius: "12px 12px 12px 4px", background: "rgba(255,255,255,.06)" }}>
              <div style={{ font: "600 11px 'Space Grotesk',sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#7C84A8", marginBottom: 5 }}>Email reçu · 08:12</div>
              <div style={{ font: "400 13.5px/1.55 'Hanken Grotesk',sans-serif", color: "#C9CFE9" }}>
                « Bonjour, la chaudière de la résidence Les Tilleuls est en panne, pouvez-vous passer rapidement ? »
              </div>
            </div>
            <div style={{ alignSelf: "flex-end", maxWidth: "88%", padding: "12px 14px", borderRadius: "12px 12px 4px 12px", background: "linear-gradient(135deg,rgba(123,92,255,.3),rgba(79,168,255,.22))", border: "1px solid rgba(139,124,255,.3)" }}>
              <div style={{ font: "600 11px 'Space Grotesk',sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#C3BAFF", marginBottom: 5 }}>Intervention créée · 08:12</div>
              <div style={{ font: "400 13.5px/1.55 'Hanken Grotesk',sans-serif", color: "#E6E9FB" }}>
                Dépannage chaudière — Résidence Les Tilleuls. Priorité haute. Assignée à Karim, demain 9h00. Client notifié ✓
              </div>
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 11, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)" }}>
            <span style={{ font: "400 13px 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>3 emails en attente de traitement…</span>
            <span style={{ marginLeft: "auto", width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#7B5CFF,#4FA8FF)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 8h11M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
