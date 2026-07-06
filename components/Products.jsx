const PRODUCTS = [
  {
    name: "Sielo", color: "#009FE3", tone: "#5FC3F0",
    bg: "linear-gradient(180deg,rgba(0,159,227,.09),rgba(255,255,255,.02))",
    bc: "rgba(0,159,227,.3)", bch: "rgba(0,159,227,.6)",
    tag: "Transport & logistique",
    body: "Dispatch, suivi de flotte, pilotage des chantiers. Vos tournées s'organisent en quelques clics, plus au téléphone.",
  },
  {
    name: "Vela", color: "#7C5CFF", tone: "#B49BFF",
    bg: "linear-gradient(180deg,rgba(124,92,255,.09),rgba(255,255,255,.02))",
    bc: "rgba(124,92,255,.3)", bch: "rgba(124,92,255,.6)",
    tag: "Interventions techniques",
    body: "Planning, tournées, et vos emails transformés en interventions automatiquement. Zéro ressaisie pour vos équipes.",
  },
  {
    name: "Lyra", color: "#12A594", tone: "#5CD6C4",
    bg: "linear-gradient(180deg,rgba(18,165,148,.08),rgba(255,255,255,.02))",
    bc: "rgba(18,165,148,.28)", bch: "rgba(18,165,148,.55)",
    tag: "Assistant vocal",
    body: "Répond, qualifie et prend les rendez-vous 24/7. Plus aucun appel manqué, même la nuit et le week-end.",
  },
];

export default function Products() {
  return (
    <section id="produits" data-screen-label="Produits" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 42 }}>
          <h2 className="h2">Une constellation de produits</h2>
          <p className="lead">Trois étoiles. Chacune part d'une base éprouvée — et devient la vôtre.</p>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {PRODUCTS.map((p) => (
            <div
              key={p.name} data-reveal="" className="pcard"
              style={{ padding: 24, borderRadius: 16, background: p.bg, "--bc": p.bc, "--bch": p.bch }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: p.color, boxShadow: `0 0 12px ${p.color}` }} />
                <span style={{ font: "700 19px 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>{p.name}</span>
              </div>
              <div style={{ font: "600 11.5px 'Space Grotesk',sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: p.tone, marginBottom: 12 }}>{p.tag}</div>
              <p style={{ margin: 0, font: "400 14px/1.6 'Hanken Grotesk',sans-serif", color: "#8F97BA" }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
