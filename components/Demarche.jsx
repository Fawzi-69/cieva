function Check({ children, color }) {
  return (
    <div style={{ display: "flex", gap: 9, font: "400 14px 'Hanken Grotesk',sans-serif", color: color }}>
      <span style={{ color: "#8B7BFF" }}>✓</span>{children}
    </div>
  );
}

export default function Demarche() {
  return (
    <section id="demarche" data-screen-label="Démarche" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 42 }}>
          <h2 className="h2">Comment ça marche</h2>
          <p className="lead" style={{ maxWidth: 420 }}>Pas de développement depuis zéro. Pas de mauvaise surprise.</p>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, alignItems: "stretch" }}>
          {/* Étape 1 */}
          <div data-reveal="" style={{ padding: 28, borderRadius: 18, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)", display: "flex", flexDirection: "column" }}>
            <div style={{ font: "600 14px 'Space Grotesk',sans-serif", color: "#A7AECB", marginBottom: 10 }}>Étape 1</div>
            <div style={{ font: "700 26px 'Space Grotesk',sans-serif", color: "#F2F4FF", marginBottom: 18 }}>Base éprouvée</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
              <Check color="#AEB5D4">Déjà utilisée sur le terrain</Check>
              <Check color="#AEB5D4">Fiable dès le premier jour</Check>
              <Check color="#AEB5D4">Aucun risque projet</Check>
            </div>
            <a href="#demo" className="soft" style={{ marginTop: "auto", textAlign: "center", padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,.16)", color: "#E4E7F8", font: "600 14px 'Space Grotesk',sans-serif" }}>Voir la base</a>
          </div>

          {/* Étape 2 — highlight */}
          <div data-reveal="" style={{ position: "relative", padding: 28, borderRadius: 18, background: "linear-gradient(180deg,rgba(123,92,255,.16),rgba(20,22,44,.6))", border: "1px solid rgba(139,124,255,.55)", display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(110,92,255,.25)" }}>
            <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", padding: "6px 14px", borderRadius: 999, background: "linear-gradient(135deg,#8B5CFF,#C05CFF)", font: "600 11px 'Space Grotesk',sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#fff" }}>2 semaines</div>
            <div style={{ font: "600 14px 'Space Grotesk',sans-serif", color: "#C3BAFF", marginBottom: 10 }}>Étape 2</div>
            <div style={{ font: "700 26px 'Space Grotesk',sans-serif", color: "#F2F4FF", marginBottom: 18 }}>Personnalisation</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
              <Check color="#C6CCE8">Votre marque et vos couleurs</Check>
              <Check color="#C6CCE8">Vos règles métier intégrées</Check>
              <Check color="#C6CCE8">Vos données migrées</Check>
              <Check color="#C6CCE8">En production en ~2 semaines</Check>
            </div>
            <a href="#demo" style={{ marginTop: "auto", textAlign: "center", padding: 12, borderRadius: 10, background: "linear-gradient(135deg,#8B5CFF,#C05CFF)", color: "#fff", font: "600 14px 'Space Grotesk',sans-serif", boxShadow: "0 8px 24px rgba(150,92,255,.4)" }}>Réserver une démo</a>
          </div>

          {/* Étape 3 */}
          <div data-reveal="" style={{ padding: 28, borderRadius: 18, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)", display: "flex", flexDirection: "column" }}>
            <div style={{ font: "600 14px 'Space Grotesk',sans-serif", color: "#A7AECB", marginBottom: 10 }}>Étape 3</div>
            <div style={{ font: "700 26px 'Space Grotesk',sans-serif", color: "#F2F4FF", marginBottom: 18 }}>Accompagnement</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
              <Check color="#AEB5D4">Formation de vos équipes</Check>
              <Check color="#AEB5D4">Ajustements continus</Check>
              <Check color="#AEB5D4">L'outil grandit avec vous</Check>
            </div>
            <a href="#demo" className="soft" style={{ marginTop: "auto", textAlign: "center", padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,.16)", color: "#E4E7F8", font: "600 14px 'Space Grotesk',sans-serif" }}>En parler</a>
          </div>
        </div>
      </div>
    </section>
  );
}
