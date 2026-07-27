/* Version compacte (Plan 1 + audit) : explique la promesse « 2 semaines »
   sur un demi-écran, sans CTA par carte. */

const STEPS = [
  {
    n: "1", title: "Base éprouvée", hl: false,
    body: "On ne développe pas depuis zéro : chaque produit part d'une base déjà utilisée sur le terrain. Fiable dès le premier jour, aucun risque projet.",
  },
  {
    n: "2", title: "Personnalisation", hl: true,
    body: "Votre marque, vos règles métier intégrées, vos données migrées. En production en ~2 semaines.",
  },
  {
    n: "3", title: "Accompagnement", hl: false,
    body: "Formation de vos équipes, ajustements continus, assistance critique 24/7 incluse les 6 premiers mois. L'outil grandit avec vous.",
  },
];

export default function Demarche() {
  return (
    <section id="demarche" data-screen-label="Démarche" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 34 }}>
          <h2 className="h2">Comment on livre en 2 semaines</h2>
          <p className="lead" style={{ maxWidth: 420 }}>Pas de développement depuis zéro. Pas de mauvaise surprise.</p>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {STEPS.map((s) => (
            <div
              key={s.n} data-reveal=""
              style={{
                position: "relative", padding: "22px 22px", borderRadius: 15,
                background: s.hl ? "linear-gradient(180deg,rgba(123,92,255,.16),rgba(20,22,44,.6))" : "rgba(255,255,255,.03)",
                border: s.hl ? "1px solid rgba(139,124,255,.55)" : "1px solid rgba(255,255,255,.1)",
              }}
            >
              {s.hl && (
                <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", padding: "5px 13px", borderRadius: 999, background: "linear-gradient(135deg,#8B5CFF,#C05CFF)", font: "600 10.5px 'Space Grotesk',sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: "#fff" }}>
                  2 semaines
                </span>
              )}
              <div style={{ font: "600 12.5px 'Space Grotesk',sans-serif", color: s.hl ? "#C3BAFF" : "#A7AECB", marginBottom: 7 }}>Étape {s.n}</div>
              <h3 style={{ margin: "0 0 8px", font: "700 18px 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>{s.title}</h3>
              <p style={{ margin: 0, font: "400 13.5px/1.6 'Hanken Grotesk',sans-serif", color: "#9AA2C4" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
