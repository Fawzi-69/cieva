/* ------------------------------------------------------------------
   Données réelles — source : donnees_site_vitrine_ritech_final.docx
   TODO restants : photos réelles à la place des initiales,
   liens LinkedIn des membres (seul le GitHub du fondateur est fourni).
   ------------------------------------------------------------------ */

const INTRO = {
  since: "2018",
  stats: [
    { value: "10 ans", label: "d'expérience IT & cloud de haut niveau" },
    { value: "+5 000", label: "interventions terrain réalisées (FDJ, Auchan…)" },
    { value: "AWS · GCP", label: "certifiés Solutions Architect & AI Practitioner" },
  ],
};

const TIMELINE = [
  {
    period: "2015 – 2018", color: "#8F97BA",
    text: "Fondations de l'activité IT : plus de 5 000 interventions réseau et matériel à haute intensité pour la FDJ et Auchan.",
  },
  {
    period: "2018 – 2023", color: "#4FA8FF",
    text: "Structuration officielle (Kbis) et migrations cloud grands comptes : déploiement national de 30 magasins Primark (30 techniciens coordonnés), transitions Office 365 pour Orange.",
  },
  {
    period: "2023 – 2026", color: "#7C5CFF",
    text: "Ingénierie Cloud & DevOps avancée chez Maintronic : infrastructures Terraform (IaC), Landing Zones sécurisées, pipelines AWS Step Functions, Lambda, Bedrock, SageMaker.",
  },
  {
    period: "Aujourd'hui", color: "#3DDC97",
    text: "Solutions d'automatisation métier et d'IA générative sur mesure pour plus de 50 clients sur toute la zone francophone — France, Suisse, Belgique, Canada.",
  },
];

const MEMBERS = [
  {
    name: "Fawzi Baliouz",
    role: "Fondateur · Architecte Cloud & DevOps",
    bio: "10 ans d'infrastructures complexes et de déploiements nationaux (Auchan, Primark, Orange, Maintronic). Certifié AWS Solutions Architect & AI Practitioner, il conçoit les architectures cloud hautement disponibles derrière chaque SaaS livré.",
    initial: "FB",
    accent: "linear-gradient(135deg,#7B5CFF,#4FA8FF)",
    link: { href: "https://github.com/Fawzi-69", label: "GitHub", type: "github" },
  },
  {
    name: "Najoua Popal",
    role: "Directrice Commerciale · Head of Product Marketing",
    bio: "8 ans de vente stratégique et de marketing digital. Elle traduit les problématiques opérationnelles des clients en solutions ROIstes, avec des modèles financiers qui rendent le sur-mesure immédiatement rentable.",
    initial: "NP",
    accent: "linear-gradient(135deg,#C05CFF,#7C5CFF)",
    link: null, // TODO: LinkedIn
  },
  {
    name: "Alexandre Vaneck",
    role: "Tech Lead · Ingénieur Senior IA",
    bio: "Spécialiste des architectures LLM, du DevSecOps et des pipelines de données complexes (Terraform, Python, PySpark). Il conçoit le moteur algorithmique hautement sécurisé de nos applications.",
    initial: "AV",
    accent: "linear-gradient(135deg,#4FA8FF,#3DDC97)",
    link: null, // TODO: LinkedIn
  },
  {
    name: "Lucas Morel",
    role: "Développeur Fullstack · Intégrateur IA Générative",
    bio: "Expert de l'interconnexion rapide des briques d'IA et des frameworks cloud modernes. Il assure le prototypage ultra-rapide des MVP pour garantir une mise en production sous 2 semaines.",
    initial: "LM",
    accent: "linear-gradient(135deg,#3DDC97,#4FA8FF)",
    link: null, // TODO: LinkedIn
  },
];

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.18.58.69.48A10 10 0 0012 2z" />
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
        font: "600 22px 'Space Grotesk',sans-serif", color: "#fff", marginBottom: 16,
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

        {/* ---------- Bandeau expertise ---------- */}
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
              <div style={{ marginTop: 8, font: "400 13.5px/1.5 'Hanken Grotesk',sans-serif", color: "#9AA2C4" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ---------- Frise historique ---------- */}
        <div
          data-reveal=""
          style={{
            padding: "32px 34px", borderRadius: 18, marginBottom: 26,
            background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div style={{ font: "600 12px 'Space Grotesk',sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "#6B7396", marginBottom: 22 }}>
            10 ans de terrain, en quatre étapes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TIMELINE.map((t, i) => (
              <div key={t.period} style={{ display: "flex", gap: 18 }}>
                {/* Colonne dot + ligne */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 12 }}>
                  <span style={{ width: 11, height: 11, borderRadius: "50%", background: t.color, boxShadow: `0 0 10px ${t.color}`, flexShrink: 0, marginTop: 4 }} />
                  {i < TIMELINE.length - 1 && (
                    <span style={{ width: 1, flex: 1, background: "linear-gradient(180deg,rgba(139,124,255,.4),rgba(139,124,255,.08))" }} />
                  )}
                </div>
                <div style={{ paddingBottom: i < TIMELINE.length - 1 ? 22 : 0 }}>
                  <div style={{ font: "600 13px 'Space Grotesk',sans-serif", letterSpacing: ".08em", textTransform: "uppercase", color: t.color, marginBottom: 5 }}>
                    {t.period}
                  </div>
                  <p style={{ margin: 0, font: "400 14px/1.65 'Hanken Grotesk',sans-serif", color: "#8F97BA", maxWidth: 720 }}>{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Membres ---------- */}
        <div className="split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {MEMBERS.map((m) => (
            <div
              key={m.name}
              data-reveal=""
              style={{
                padding: 28, borderRadius: 18, display: "flex", flexDirection: "column",
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <Avatar initial={m.initial} accent={m.accent} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 4 }}>
                <h3 style={{ margin: 0, font: "600 18px 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>{m.name}</h3>
                {m.link && (
                  <a href={m.link.href} aria-label={`${m.link.label} de ${m.name}`} className="lnk" style={{ color: "#6B7396", display: "flex" }} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon />
                  </a>
                )}
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
