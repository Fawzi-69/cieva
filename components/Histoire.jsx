const BEATS = [
  {
    era: "Hier",
    color: "#8F97BA",
    title: "Le sur-mesure coûtait une fortune",
    body: "Un logiciel métier à votre image, c'était des mois de développement et 15 000 à 30 000 € au bas mot. Alors les PME prenaient un outil générique — et s'adaptaient à lui, pas l'inverse.",
  },
  {
    era: "Aujourd'hui",
    color: "#4FA8FF",
    title: "L'IA a changé l'équation",
    body: "Construire coûte dix fois moins qu'avant. L'IA accélère la fabrication ; notre expertise transforme cette vitesse en logiciel fiable, testé, à votre marque.",
  },
  {
    era: "Pour vous",
    color: "#7C5CFF",
    title: "Votre application, sans vous ruiner",
    body: "Vos règles, vos données, votre nom sur l'écran. Au prix d'un abonnement — pas d'un chantier. C'est ça, la promesse Cieva.",
  },
];

export default function Histoire() {
  return (
    <section id="histoire" data-screen-label="Histoire" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 46 }}>
          <div style={{ font: "600 12px/1 'Space Grotesk',sans-serif", letterSpacing: ".24em", textTransform: "uppercase", color: "#7C84A8", marginBottom: 14 }}>
            Pourquoi maintenant
          </div>
          <h2 className="h2">Le sur-mesure n'est plus un luxe</h2>
        </div>

        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, position: "relative" }}>
          {BEATS.map((b, i) => (
            <div
              key={b.era} data-reveal=""
              style={{
                padding: 26, borderRadius: 16,
                background: "linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01))",
                border: "1px solid rgba(139,124,255,.18)",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: b.color, boxShadow: `0 0 10px ${b.color}` }} />
                <span style={{ font: "600 12px 'Space Grotesk',sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: b.color }}>
                  {b.era}
                </span>
              </div>
              <h3 style={{ margin: "0 0 8px", font: "600 17px 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>{b.title}</h3>
              <p style={{ margin: 0, font: "400 14px/1.65 'Hanken Grotesk',sans-serif", color: "#8F97BA" }}>{b.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
