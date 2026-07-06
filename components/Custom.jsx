const CARDS = [
  {
    bg: "linear-gradient(180deg,rgba(123,92,255,.09),rgba(255,255,255,.02))", bc: "rgba(123,92,255,.25)",
    icoBg: "rgba(123,92,255,.2)",
    ico: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l2.4 6.5L21 9l-5 4.3L17.6 20 12 16.5 6.4 20 8 13.3 3 9l6.6-.5L12 2z" stroke="#A08CFF" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    title: "À votre marque",
    body: "Votre logo, vos couleurs, le nom de votre choix. Vos équipes utilisent un outil qui leur ressemble.",
  },
  {
    bg: "linear-gradient(180deg,rgba(79,168,255,.09),rgba(255,255,255,.02))", bc: "rgba(79,168,255,.25)",
    icoBg: "rgba(79,168,255,.18)",
    ico: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" stroke="#5FBCFF" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="#5FBCFF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Vos données chez vous",
    body: "Vos données sont isolées et restent les vôtres. Aucune mutualisation, aucune ambiguïté.",
  },
  {
    bg: "linear-gradient(180deg,rgba(61,220,151,.08),rgba(255,255,255,.02))", bc: "rgba(61,220,151,.22)",
    icoBg: "rgba(61,220,151,.15)",
    ico: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" stroke="#4FDDA9" strokeWidth="1.6" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" stroke="#4FDDA9" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    title: "Adapté à votre métier",
    body: "Vos règles, vos statuts, vos étapes. L'application suit votre façon de travailler — pas l'inverse.",
  },
];

export default function Custom() {
  return (
    <section id="sur-mesure" data-screen-label="Sur-mesure" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 42 }}>
          <h2 className="h2">Personnalisé jusqu'au dernier pixel</h2>
          <p className="lead" style={{ maxWidth: 440 }}>Pas un SaaS anonyme de plus — une application qui porte votre nom.</p>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {CARDS.map((c) => (
            <div key={c.title} data-reveal="" style={{ padding: 26, borderRadius: 16, background: c.bg, border: `1px solid ${c.bc}` }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: c.icoBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>{c.ico}</div>
              <h3 style={{ margin: "0 0 8px", font: "600 17px 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>{c.title}</h3>
              <p style={{ margin: 0, font: "400 14px/1.6 'Hanken Grotesk',sans-serif", color: "#8F97BA" }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
