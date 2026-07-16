/* ------------------------------------------------------------------
   Données réelles — source : donnees_site_vitrine_ritech_final.docx
   TODO restants : logos images (SVG/PNG) à la place des libellés texte,
   photos réelles à la place des initiales.
   ------------------------------------------------------------------ */

const AGENCY_STATS = [
  { value: "+50", suffix: "", label: "applications livrées", sub: "SaaS & apps métier en prod cloud (AWS / GCP)" },
  { value: "2", suffix: " sem.", label: "délai moyen", sub: "du cahier des charges au MVP en production" },
  { value: "70", suffix: "%", label: "de temps gagné", sub: "sur les tâches opérationnelles répétitives" },
  { value: "24/7", suffix: "", label: "assistance critique", sub: "incluse les 6 premiers mois post-livraison" },
];

// TODO: remplacer les libellés par les vrais logos <img> (SVG mono de préférence)
const LOGOS = ["Auchan", "Primark", "Orange", "La FDJ", "Maintronic", "Sielo", "Vela"];

const FEATURED = {
  quote:
    "L'intégration de la plateforme Sielo a totalement révolutionné notre chaîne logistique. Avant, la gestion manuelle des camions et des plannings était une friction administrative quotidienne. Grâce à leur solution automatisée intelligente, nous avons gagné 70 % de temps opérationnel. Obtenir un tel niveau de sur-mesure sans passer par les budgets pharaoniques des éditeurs traditionnels a été le déclencheur de notre croissance.",
  value: "+70%", unit: "de temps opérationnel", note: "gagné sur la chaîne logistique",
  name: "Mehdy K.",
  role: "Directeur des Opérations Logistiques · Sielo",
  initial: "MK",
};

const TESTIMONIALS = [
  {
    quote:
      "L'équipe a développé Vela, une solution sur mesure qui automatise la centralisation et anticipe nos flux de cash-flow. Nous avançons 10x plus vite sur nos décisions d'investissement, sans recruter un contrôleur de gestion dédié.",
    name: "Alexandre Gautier", role: "Fondateur & Multi-Entrepreneur · Vela Trésorerie",
    initial: "AG", accent: "#7C5CFF", impact: "Croissance ×10 à effectif constant",
  },
  {
    quote:
      "Là où les SSII traditionnelles nous demandaient plus de 15 000 € et des mois de développement, cette agence a déployé un outil IA sur mesure en deux semaines. Nous traitons les dossiers 10x plus vite sans aucune embauche.",
    name: "Sophie Laurent", role: "Associée Principale · Audit & Conseil Grand Est",
    initial: "SL", accent: "#4FA8FF", impact: "80 h gagnées / mois / agent",
  },
  {
    quote:
      "Planifier manuellement les flux de camions régionaux était une source d'erreurs constante. Le SaaS sur mesure, à un tarif incroyablement accessible, a automatisé le routage. Nous optimisons nos marges en temps réel.",
    name: "Marc-Antoine Perrin", role: "Directeur Logistique · BTP Horizon (Suisse)",
    initial: "MP", accent: "#3DDC97", impact: "−25% de coûts de transport",
  },
  {
    quote:
      "Le tri et la qualification des CV prenaient des journées entières à nos recruteurs. L'agent IA développé sur mesure élimine cette friction répétitive. Notre vitesse de placement a été multipliée par 5.",
    name: "Amélie Dupont", role: "Directrice RH · InnovaTech Solutions",
    initial: "AD", accent: "#C05CFF", impact: "Temps de traitement ÷ 5",
  },
  {
    quote:
      "Notre support client était submergé par les tâches répétitives de niveau 1. L'IA générative traite désormais 60 % des flux de manière fluide et autonome, sans surcharger la masse salariale.",
    name: "Julien Masson", role: "Responsable Customer Success · e-Commerce Scale",
    initial: "JM", accent: "#4FA8FF", impact: "60% de requêtes automatisées",
  },
  {
    quote:
      "L'analyse de conformité des baux et contrats commerciaux représentait une charge lourde. Le SaaS personnalisé extrait et valide les clauses critiques en quelques minutes. Le sur-mesure est enfin rentable pour les PME.",
    name: "Me Nathalie Roussel", role: "Avocate Associée · Juristes Associés (Belgique)",
    initial: "NR", accent: "#7C5CFF", impact: "Analyse de contrat en 3 min",
  },
  {
    quote:
      "La conformité douanière impose une paperasse d'une complexité extrême. L'automatisation intelligente conçue par RITECH a éradiqué les erreurs manuelles. L'assistance 24/7 les 6 premiers mois nous a sécurisés à 100 %.",
    name: "Yvan Tremblay", role: "Directeur Supply Chain · Global Trade (Canada)",
    initial: "YT", accent: "#3DDC97", impact: "Zéro erreur de conformité",
  },
  {
    quote:
      "Traiter manuellement les litiges et anomalies de facturation sur des milliers de commandes quotidiennes bloquait notre croissance. Le processus est automatisé sur mesure : nous scalons sereinement sans embaucher.",
    name: "Frédéric Lambert", role: "DAF · NRJ Solutions",
    initial: "FL", accent: "#C05CFF", impact: "Dizaines de milliers d'€ récupérés",
  },
  {
    quote:
      "La production répétitive de rapports de performance saturait nos équipes. L'outil sur mesure génère des synthèses analytiques parfaites en un clic. Notre agence se développe bien plus vite.",
    name: "Laura Martinez", role: "Head of Content · Agence VibeMarketing",
    initial: "LM", accent: "#4FA8FF", impact: "Productivité éditoriale doublée",
  },
  {
    quote:
      "Le standard sautait entre midi et deux et pendant les consultations. Lyra décroche, comprend les demandes de rendez-vous complexes et les cale directement dans notre agenda. Elle filtre les urgences et nous laisse des messages clairs.",
    name: "Clara Bennet", role: "Gestionnaire de Centre · Clinique Privée",
    initial: "CB", accent: "#3DDC97", impact: "Standard décroché 24/7",
  },
  {
    quote:
      "Sur le chantier, impossible de répondre au téléphone — je perdais un devis sur deux. Maintenant, Lyra répond à ma place avec ma voix, prend les demandes de devis et me liste tout par écrit le soir. Je ne rate plus aucun client.",
    name: "Stéphane Morel", role: "Artisan Plaquiste · Morel Rénovation",
    initial: "SM", accent: "#3DDC97", impact: "Plus aucun devis perdu",
  },
  {
    quote:
      "Au volant, impossible de planifier des courses sur l'écran. Lyra gère mes appels clients en direct pendant que je roule : elle vérifie mes dispos, confirme la prise en charge par SMS et met à jour mon trajet. Sans régulateur.",
    name: "Karim Mansour", role: "Chauffeur Privé & Fondateur · Prestige Ride",
    initial: "KM", accent: "#3DDC97", impact: "Réservations mains libres, non-stop",
  },
];

function Stars({ color = "#8B7BFF" }) {
  return (
    <div style={{ display: "flex", gap: 2 }} aria-label="5 sur 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={color}>
          <path d="M12 2l2.4 6.5L21 9l-5 4.3L17.6 20 12 16.5 6.4 20 8 13.3 3 9l6.6-.5L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ initial, accent = "linear-gradient(135deg,#7B5CFF,#4FA8FF)", size = 40 }) {
  // TODO: remplacer par <img> réel une fois les photos disponibles
  return (
    <span
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: accent, display: "flex", alignItems: "center", justifyContent: "center",
        font: `600 ${Math.round(size * 0.34)}px 'Space Grotesk',sans-serif`, color: "#fff",
      }}
    >
      {initial}
    </span>
  );
}

export default function Proof() {
  return (
    <section id="preuve" data-screen-label="Preuve" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 42 }}>
          <h2 className="h2">La preuve par les chiffres</h2>
          <p className="lead" style={{ maxWidth: 460 }}>Un ROI que vous pouvez mesurer, pas des promesses.</p>
        </div>

        {/* ---------- Chiffres agence ---------- */}
        <div
          data-reveal="" className="grid-4"
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 22 }}
        >
          {AGENCY_STATS.map((s) => (
            <div
              key={s.label}
              style={{
                padding: "28px 20px", borderRadius: 16, textAlign: "center",
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2 }}>
                <span className="grad" style={{ font: "700 clamp(32px,4vw,46px)/1 'Space Grotesk',sans-serif", letterSpacing: "-.03em" }}>{s.value}</span>
                {s.suffix && <span className="grad" style={{ font: "700 20px 'Space Grotesk',sans-serif" }}>{s.suffix}</span>}
              </div>
              <div style={{ marginTop: 10, font: "600 14.5px 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>{s.label}</div>
              <div style={{ marginTop: 3, font: "400 12.5px/1.5 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ---------- Bandeau références ---------- */}
        <div data-reveal="" style={{ marginBottom: 40 }}>
          <div style={{ textAlign: "center", font: "600 11px 'Space Grotesk',sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "#6B7396", marginBottom: 6 }}>
            Ils nous ont fait confiance
          </div>
          <div style={{ textAlign: "center", font: "400 12px 'Hanken Grotesk',sans-serif", color: "#5A6284", marginBottom: 18 }}>
            En direct ou via nos partenaires (Experis, Fujitsu, Toshiba)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 34px" }}>
            {LOGOS.map((name) => (
              // TODO: remplacer le texte par le vrai logo <img>
              <span key={name} style={{ font: "600 15px 'Space Grotesk',sans-serif", color: "#8F97BA", opacity: 0.75 }}>{name}</span>
            ))}
          </div>
        </div>

        {/* ---------- Témoignage vedette ---------- */}
        <div
          data-reveal="" className="proof-grid"
          style={{
            borderRadius: 18, border: "1px solid rgba(139,124,255,.35)",
            background: "linear-gradient(135deg,rgba(123,92,255,.12),rgba(79,168,255,.07))",
            padding: "44px 40px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 48, alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div>
            <div className="grad" style={{ font: "700 clamp(48px,7vw,84px)/.9 'Space Grotesk',sans-serif", letterSpacing: "-.03em", marginBottom: 8 }}>
              {FEATURED.value}
            </div>
            <div style={{ font: "600 17px 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>{FEATURED.unit}</div>
            <div style={{ font: "400 14.5px 'Hanken Grotesk',sans-serif", color: "#9AA2C4", marginTop: 4 }}>{FEATURED.note}</div>
          </div>
          <div>
            <Stars />
            <p style={{ margin: "12px 0 18px", font: "400 clamp(15.5px,1.7vw,18px)/1.6 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>
              « {FEATURED.quote} »
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <Avatar initial={FEATURED.initial} />
              <div>
                <div style={{ font: "600 14px 'Hanken Grotesk',sans-serif", color: "#EDEFFA" }}>{FEATURED.name}</div>
                <div style={{ font: "400 12.5px 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>{FEATURED.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Avis clients ---------- */}
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              data-reveal=""
              style={{
                padding: "24px 22px", borderRadius: 16, display: "flex", flexDirection: "column",
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <Stars color={t.accent} />
                <span style={{ font: "600 11px 'Space Grotesk',sans-serif", color: t.accent, background: `color-mix(in srgb, ${t.accent} 14%, transparent)`, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
                  {t.impact}
                </span>
              </div>
              <p style={{ margin: "14px 0 18px", font: "400 13.5px/1.6 'Hanken Grotesk',sans-serif", color: "#C6CCE8", flex: 1 }}>
                « {t.quote} »
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initial={t.initial} accent={`linear-gradient(135deg,${t.accent},#4FA8FF)`} size={34} />
                <div>
                  <div style={{ font: "600 13px 'Hanken Grotesk',sans-serif", color: "#EDEFFA" }}>{t.name}</div>
                  <div style={{ font: "400 11.5px 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
