/* ------------------------------------------------------------------
   CONTENU À REMPLACER (placeholders marqués TODO)
   - INTRO.since   : année de création de l'agence (ton ancienneté)
   - INTRO stats   : années d'expérience, expertises clés
   - MEMBERS       : fondateurs / équipe (nom, rôle, parcours court, LinkedIn, photo)
   ------------------------------------------------------------------ */

// TODO: adapter à ton ancienneté réelle
const INTRO = {
  since: "2021", // TODO: année de création
  stats: [
    { value: "5 ans", label: "à construire des outils métier" },
    { value: "3 secteurs", label: "transport, BTP, services" },
    { value: "IA + métier", label: "double expertise" },
  ],
};

// TODO: remplacer par les vrais membres (photo, parcours, LinkedIn)
const MEMBERS = [
  {
    name: "Prénom Nom",                 // TODO
    role: "Cofondateur · Produit & IA", // TODO
    bio: "Ex-[entreprise]. Conçoit et fait tourner les modèles derrière Sielo, Vela et Lyra.", // TODO
    initial: "A",                       // TODO: initiales ou photo
    accent: "linear-gradient(135deg,#7B5CFF,#4FA8FF)",
    linkedin: "#",                      // TODO: URL LinkedIn
  },
  {
    name: "Prénom Nom",                 // TODO
    role: "Cofondateur · Métier & Clients", // TODO
    bio: "15 ans en exploitation transport. Traduit le terrain en règles que l'outil applique.", // TODO
    initial: "B",                       // TODO
    accent: "linear-gradient(135deg,#7C5CFF,#C05CFF)",
    linkedin: "#",                      // TODO
  },
  {
    name: "Prénom Nom",                 // TODO
    role: "Lead Développement",         // TODO
    bio: "Assemble et déploie chaque application sur mesure, de la base éprouvée à la prod.", // TODO
    initial: "C",                       // TODO
    accent: "linear-gradient(135deg,#3DDC97,#4FA8FF)",
    linkedin: "#",                      // TODO
  },
];

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9z" />
    </svg>
  );
}

function Avatar({ initial, accent }) {
  // TODO: remplacer par <img> réel une fois les photos disponibles
  return (
    <span
      style={{
        width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
        background: accent, display: "flex", alignItems: "center", justifyContent: "center",
        font: "600 24px 'Space Grotesk',sans-serif", color: "#fff", marginBottom: 16,
      }}
    >
      {initial}
    </span>
  );
}

export default function Team() {
  return (
    <section id="equipe" data-screen-label="Équipe" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 42 }}>
          <div style={{ font: "600 12px/1 'Space Grotesk',sans-serif", letterSpacing: ".24em", textTransform: "uppercase", color: "#7C84A8", marginBottom: 14 }}>
            Depuis {INTRO.since}
          </div>
          <h2 className="h2">L'équipe derrière vos outils</h2>
          <p className="lead" style={{ maxWidth: 480 }}>
            Des gens qui connaissent l'IA <em>et</em> le terrain. C'est ce qui fait la différence entre un logiciel qui marche et un projet qui traîne.
          </p>
        </div>

        {/* ---------- Bandeau ancienneté / expertise ---------- */}
        <div
          data-reveal="" className="grid-3"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 26 }}
        >
          {INTRO.stats.map((s) => (
            <div
              key={s.label}
              style={{
                padding: "24px 22px", borderRadius: 16, textAlign: "center",
                background: "linear-gradient(180deg,rgba(123,92,255,.09),rgba(255,255,255,.02))",
                border: "1px solid rgba(139,124,255,.2)",
              }}
            >
              <div className="grad" style={{ font: "700 clamp(24px,3vw,32px)/1 'Space Grotesk',sans-serif", letterSpacing: "-.02em" }}>{s.value}</div>
              <div style={{ marginTop: 8, font: "400 13.5px 'Hanken Grotesk',sans-serif", color: "#9AA2C4" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ---------- Membres ---------- */}
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {MEMBERS.map((m) => (
            <div
              key={m.name + m.role}
              data-reveal=""
              style={{
                padding: 28, borderRadius: 18, display: "flex", flexDirection: "column",
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <Avatar initial={m.initial} accent={m.accent} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                <h3 style={{ margin: 0, font: "600 18px 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>{m.name}</h3>
                <a href={m.linkedin} aria-label={`LinkedIn de ${m.name}`} className="lnk" style={{ color: "#6B7396", display: "flex" }} target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon />
                </a>
              </div>
              <div style={{ font: "600 13px 'Space Grotesk',sans-serif", color: "#8B7BFF", marginBottom: 12 }}>{m.role}</div>
              <p style={{ margin: 0, font: "400 14px/1.6 'Hanken Grotesk',sans-serif", color: "#8F97BA" }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
