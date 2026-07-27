/* Équipe + 10 ans sur un seul écran (Plan 1) :
   frise horizontale 4 temps, puis l'équipe en une rangée.
   Données réelles — TODO : photos réelles, LinkedIn de Najoua/Alexandre/Lucas. */

const TIMELINE = [
  { period: "2015 – 2018", color: "#8F97BA", text: "+5 000 interventions terrain — La FDJ, Auchan" },
  { period: "2018 – 2023", color: "#4FA8FF", text: "30 magasins Primark déployés, Office 365 pour Orange" },
  { period: "2023 – 2026", color: "#7C5CFF", text: "Cloud & DevOps chez Maintronic — Terraform, Bedrock, SageMaker" },
  { period: "Aujourd'hui", color: "#3DDC97", text: "+50 clients — France, Suisse, Belgique, Canada" },
];

const MEMBERS = [
  {
    name: "Fawzi Baliouz", role: "Fondateur · Architecte Cloud & DevOps",
    initial: "FB", accent: "linear-gradient(135deg,#7B5CFF,#4FA8FF)",
    link: "https://github.com/Fawzi-69",
  },
  {
    name: "Najoua Popal", role: "Directrice Commerciale · Head of Product Marketing",
    initial: "NP", accent: "linear-gradient(135deg,#C05CFF,#7C5CFF)",
    link: null, // TODO: LinkedIn
  },
  {
    name: "Alexandre Vaneck", role: "Tech Lead · Ingénieur Senior IA",
    initial: "AV", accent: "linear-gradient(135deg,#4FA8FF,#3DDC97)",
    link: null, // TODO: LinkedIn
  },
  {
    name: "Lucas Morel", role: "Développeur Fullstack · Intégrateur IA Générative",
    initial: "LM", accent: "linear-gradient(135deg,#3DDC97,#4FA8FF)",
    link: null, // TODO: LinkedIn
  },
];

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0012 2z" />
    </svg>
  );
}

export default function Team() {
  return (
    <section id="equipe" data-screen-label="Équipe" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 38 }}>
          <div style={{ font: "600 12px/1 'Space Grotesk',sans-serif", letterSpacing: ".24em", textTransform: "uppercase", color: "#7C84A8", marginBottom: 14 }}>
            Depuis 2018 · 10 ans de terrain
          </div>
          <h2 className="h2">L'équipe derrière vos outils</h2>
          <p className="lead" style={{ maxWidth: 480 }}>
            Des gens qui connaissent l'IA <em>et</em> le terrain. C'est ce qui fait la différence entre un logiciel qui marche et un projet qui traîne.
          </p>
        </div>

        {/* ---------- Frise horizontale ---------- */}
        <div data-reveal="" className="grid-4 frise" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, position: "relative", marginBottom: 34 }}>
          <span aria-hidden="true" style={{ position: "absolute", top: 5, left: "6%", right: "6%", height: 1, background: "linear-gradient(90deg,rgba(139,124,255,.5),rgba(61,220,151,.5))" }} className="frise-line" />
          {TIMELINE.map((t) => (
            <div key={t.period} style={{ padding: "0 14px", textAlign: "center", position: "relative" }}>
              <span style={{ display: "block", width: 11, height: 11, borderRadius: "50%", margin: "0 auto 12px", background: t.color, boxShadow: `0 0 10px ${t.color}`, position: "relative", zIndex: 1 }} />
              <div style={{ font: "600 12px 'Space Grotesk',sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: t.color, marginBottom: 6 }}>{t.period}</div>
              <p style={{ margin: 0, font: "400 12.5px/1.55 'Hanken Grotesk',sans-serif", color: "#8F97BA" }}>{t.text}</p>
            </div>
          ))}
        </div>

        {/* ---------- Membres en une rangée ---------- */}
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {MEMBERS.map((m) => (
            <div
              key={m.name}
              data-reveal=""
              style={{
                padding: 18, borderRadius: 14, textAlign: "center",
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)",
              }}
            >
              {/* TODO: remplacer par <img> réel une fois les photos disponibles */}
              <span style={{ width: 52, height: 52, borderRadius: "50%", background: m.accent, display: "inline-flex", alignItems: "center", justifyContent: "center", font: "600 17px 'Space Grotesk',sans-serif", color: "#fff", marginBottom: 10 }}>
                {m.initial}
              </span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <h3 style={{ margin: 0, font: "600 14.5px 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>{m.name}</h3>
                {m.link && (
                  <a href={m.link} aria-label={`GitHub de ${m.name}`} className="lnk" style={{ color: "#6B7396", display: "flex" }} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon />
                  </a>
                )}
              </div>
              <div style={{ marginTop: 4, font: "400 11.5px/1.4 'Hanken Grotesk',sans-serif", color: "#8B7BFF" }}>{m.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
