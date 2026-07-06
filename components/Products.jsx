const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const PRODUCTS = [
  {
    name: "Sielo", color: "#009FE3", tone: "#5FC3F0",
    bg: "linear-gradient(180deg,rgba(0,159,227,.09),rgba(255,255,255,.02))",
    bc: "rgba(0,159,227,.3)", bch: "rgba(0,159,227,.6)",
    tag: "Transport & logistique",
    body: "Dispatch, suivi de flotte, pilotage des chantiers. Vos tournées s'organisent en quelques clics, plus au téléphone.",
    img: "sielo.webp", alt: "Tableau de bord de dispatch Sielo",
  },
  {
    name: "Vela", color: "#7C5CFF", tone: "#B49BFF",
    bg: "linear-gradient(180deg,rgba(124,92,255,.09),rgba(255,255,255,.02))",
    bc: "rgba(124,92,255,.3)", bch: "rgba(124,92,255,.6)",
    tag: "Interventions techniques",
    body: "Planning, tournées, et vos emails transformés en interventions automatiquement. Zéro ressaisie pour vos équipes.",
    img: "vela.webp", alt: "Application mobile de planning Vela",
  },
  {
    name: "Lyra", color: "#12A594", tone: "#5CD6C4",
    bg: "linear-gradient(180deg,rgba(18,165,148,.08),rgba(255,255,255,.02))",
    bc: "rgba(18,165,148,.28)", bch: "rgba(18,165,148,.55)",
    tag: "Assistant vocal",
    body: "Répond, qualifie et prend les rendez-vous 24/7. Plus aucun appel manqué, même la nuit et le week-end.",
    img: "lyra.webp", alt: "Interface vocale Lyra",
  },
];

export default function Products() {
  return (
    <section id="produits" data-screen-label="Produits" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 42 }}>
          <h2 className="h2">Une constellation de produits</h2>
          <p className="lead">Trois étoiles, nées chez nos clients. Chacune part d'une base éprouvée — et devient la vôtre.</p>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {PRODUCTS.map((p, i) => (
            <div
              key={p.name} data-reveal="" className="pcard"
              style={{ padding: 16, borderRadius: 16, background: p.bg, "--bc": p.bc, "--bch": p.bch, transitionDelay: `${i * 100}ms` }}
            >
              <img
                src={`${BASE}/products/${p.img}`} alt={p.alt} loading="lazy"
                style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", borderRadius: 10, marginBottom: 16, display: "block" }}
              />
              <div style={{ padding: "0 8px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: p.color, boxShadow: `0 0 12px ${p.color}` }} />
                  <span style={{ font: "700 19px 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>{p.name}</span>
                </div>
                <div style={{ font: "600 11.5px 'Space Grotesk',sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: p.tone, marginBottom: 10 }}>{p.tag}</div>
                <p style={{ margin: 0, font: "400 14px/1.6 'Hanken Grotesk',sans-serif", color: "#8F97BA" }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* La 4e étoile : la sienne */}
        <div
          data-reveal="" className="next-card"
          style={{
            marginTop: 18, borderRadius: 16, overflow: "hidden",
            border: "1px dashed rgba(139,124,255,.45)",
            background: "linear-gradient(135deg,rgba(123,92,255,.10),rgba(0,159,227,.06))",
            display: "grid", gridTemplateColumns: "1.1fr 1fr", alignItems: "center",
          }}
        >
          <div style={{ padding: "36px 40px" }}>
            <div style={{ font: "600 11.5px 'Space Grotesk',sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "#B49BFF", marginBottom: 12 }}>
              La quatrième étoile
            </div>
            <h3 style={{ margin: "0 0 10px", font: "700 clamp(22px,2.6vw,30px)/1.15 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>
              Le prochain produit, <span className="grad">c'est le vôtre.</span>
            </h3>
            <p style={{ margin: "0 0 22px", font: "400 14.5px/1.65 'Hanken Grotesk',sans-serif", color: "#9AA2C4", maxWidth: 420 }}>
              Sielo est né chez un transporteur. Vela chez un installateur. Racontez-nous votre
              métier : on le dessine ensemble, sur une base éprouvée, à votre marque.
            </p>
            <a
              href="#demo"
              style={{
                display: "inline-block", padding: "12px 22px", borderRadius: 11,
                background: "linear-gradient(135deg,#8B5CFF,#C05CFF)", color: "#fff",
                font: "600 14px 'Space Grotesk',sans-serif",
                boxShadow: "0 10px 30px rgba(150,92,255,.35)", border: "1px solid rgba(255,255,255,.2)",
              }}
            >
              Dessinons la vôtre
            </a>
          </div>
          <img
            src={`${BASE}/products/levotre.webp`} alt="Esquisse d'une future application" loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}
