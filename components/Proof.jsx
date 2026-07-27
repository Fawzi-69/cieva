/* ------------------------------------------------------------------
   Preuve : témoignage vedette + carrousel d'avis (slide droite → gauche,
   pause au survol, boucle infinie via duplication du rail).
   Verbatims exacts — source : donnees_site_vitrine_ritech_final.docx.
   Les chiffres agence et références sont dans StatsBand (sous le hero).
   TODO : photos réelles à la place des initiales.
   ------------------------------------------------------------------ */

const FEATURED = {
  quote:
    "L'intégration de la plateforme Sielo a totalement révolutionné notre chaîne logistique. Avant, la gestion manuelle des camions et des plannings était une friction administrative quotidienne. Grâce à leur solution automatisée intelligente, nous avons gagné 70 % de temps opérationnel. Obtenir un tel niveau de sur-mesure sans passer par les budgets pharaoniques des éditeurs traditionnels à 15k€ a été le déclencheur de notre croissance.",
  value: "+70%", unit: "de temps opérationnel", note: "gagné sur la chaîne logistique",
  name: "Mehdy K.",
  role: "Directeur des Opérations Logistiques · Sielo",
  initial: "MK",
};

const TESTIMONIALS = [
  {
    quote:
      "En tant qu'entrepreneur, piloter des structures multiples avec des flux financiers hyper diversifiés était un goulet d'étranglement administratif majeur. L'équipe a développé Vela, une solution sur mesure intelligente qui automatise la centralisation et anticipe nos flux de cash-flow. L'outil nous permet d'avancer 10x plus vite sur nos décisions d'investissement sans avoir besoin de recruter un contrôleur de gestion dédié.",
    name: "Alexandre Gautier", role: "Fondateur & Multi-Entrepreneur · Vela Trésorerie",
    initial: "AG", accent: "#7C5CFF", impact: "Croissance X10 à effectif constant",
  },
  {
    quote:
      "Les tâches de saisie et de réconciliation manuelle des pièces comptables minaient la rentabilité de notre cabinet. Là où les SSII traditionnelles nous demandaient plus de 15 000 € et des mois de développement, cette agence a déployé un outil IA sur mesure en deux semaines. Nous traitons les dossiers 10x plus vite sans aucune embauche.",
    name: "Sophie Laurent", role: "Associée Principale · Audit & Conseil Grand Est",
    initial: "SL", accent: "#4FA8FF", impact: "80 heures gagnées/mois/agent",
  },
  {
    quote:
      "Planifier manuellement les flux de camions régionaux était une source d'erreurs constante et chronophage. Le SaaS sur mesure développé à un tarif incroyablement accessible a automatisé le routage. Nous optimisons nos marges en temps réel.",
    name: "Marc-Antoine Perrin", role: "Directeur Logistique · BTP Horizon (Suisse)",
    initial: "MP", accent: "#3DDC97", impact: "−25% de coûts de transport",
  },
  {
    quote:
      "Le tri et la qualification des CV prenaient des journées entières à nos recruteurs. L'agent IA développé sur mesure élimine cette friction répétitive. Notre vitesse de placement a été multipliée par 5.",
    name: "Amélie Dupont", role: "Directrice RH · InnovaTech Solutions",
    initial: "AD", accent: "#C05CFF", impact: "Temps de traitement divisé par 5",
  },
  {
    quote:
      "Notre support client était submergé par les tâches répétitives de niveau 1. L'intégration de briques d'IA générative traite désormais 60% des flux de manière fluide et autonome. Une efficacité démultipliée sans surcharger la masse salariale.",
    name: "Julien Masson", role: "Responsable Customer Success · e-Commerce Scale",
    initial: "JM", accent: "#4FA8FF", impact: "60% de requêtes automatisées en self-service",
  },
  {
    quote:
      "L'analyse de conformité des baux et contrats commerciaux représentait une charge administrative lourde. Le SaaS personnalisé extrait et valide les clauses critiques en quelques minutes. Le sur-mesure est enfin devenu rentable pour les PME.",
    name: "Me Nathalie Roussel", role: "Avocate Associée · Juristes Associés (Belgique)",
    initial: "NR", accent: "#7C5CFF", impact: "Analyse de contrat en 3 minutes",
  },
  {
    quote:
      "La conformité douanière impose une paperasse administrative d'une complexité extrême. L'automatisation intelligente conçue par RITECH a éradiqué les erreurs manuelles. L'assistance 24/7 durant les 6 premiers mois nous a sécurisés à 100%.",
    name: "Yvan Tremblay", role: "Directeur Supply Chain · Global Trade (Canada)",
    initial: "YT", accent: "#3DDC97", impact: "Zéro erreur de conformité",
  },
  {
    quote:
      "Traiter manuellement les litiges et les anomalies de facturation sur des milliers de commandes quotidiennes bloquait notre croissance. Grâce à l'IA, le processus est automatisé sur mesure. Nous scalons sereinement sans embaucher.",
    name: "Frédéric Lambert", role: "Directeur Administratif et Financier · NRJ Solutions",
    initial: "FL", accent: "#C05CFF", impact: "Des dizaines de milliers d'euros récupérés",
  },
  {
    quote:
      "La production et le formatage répétitif de rapports de performance pour nos clients saturaient nos équipes. L'outil sur mesure génère des synthèses analytiques parfaites en un clic. Notre agence se développe 10x plus vite.",
    name: "Laura Martinez", role: "Head of Content · Agence VibeMarketing",
    initial: "LM", accent: "#4FA8FF", impact: "Productivité éditoriale et analytique doublée",
  },
  {
    quote:
      "Le standard sautait tout le temps entre midi et deux et pendant les consultations. On a mis Lyra en place : elle décroche, comprend les demandes de rendez-vous complexes, et les cale directement dans notre agenda en arrière-plan. Elle filtre les urgences et nous laisse les messages clairs. Ça nous évite de recruter une secrétaire de plus juste pour gérer les coups de fil répétitifs.",
    name: "Clara Bennet", role: "Gestionnaire de Centre · Clinique Privée",
    initial: "CB", accent: "#3DDC97", impact: "Standard décroché 24/7",
  },
  {
    quote:
      "Quand tu es sur le chantier les mains dans le plâtre ou sur une échelle, c'est impossible de répondre au téléphone. Du coup, je perdais un devis sur deux parce que les gens n'aiment pas laisser de message sur un répondeur classique. Maintenant, Lyra répond à ma place avec ma voix, prend les demandes de devis et me liste tout par écrit le soir. C'est du sur-mesure de dingue, ça me coûte trois fois rien par rapport à un secrétariat à distance et je ne rate plus aucun client.",
    name: "Stéphane Morel", role: "Artisan Plaquiste · Morel Rénovation",
    initial: "SM", accent: "#3DDC97", impact: "Plus aucun devis perdu",
  },
  {
    quote:
      "Au volant, c'est interdit et dangereux de planifier des courses sur l'écran. Lyra gère mes appels clients en direct pendant que je roule. Elle check mes dispos sur le calendrier, confirme la prise en charge au client par SMS et met à jour mon trajet. Je booke des trajets non-stop sans jamais toucher mon téléphone et sans avoir besoin d'engager un régulateur.",
    name: "Karim Mansour", role: "Chauffeur Privé & Fondateur · Prestige Ride",
    initial: "KM", accent: "#3DDC97", impact: "Réservations mains libres, non-stop",
  },
];

function Stars({ color = "#8B7BFF" }) {
  return (
    <div style={{ display: "flex", gap: 2 }} aria-label="5 sur 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={color}>
          <path d="M12 2l2.4 6.5L21 9l-5 4.3L17.6 20 12 16.5 6.4 20 8 13.3 3 9l6.6-.5L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ initial, accent = "linear-gradient(135deg,#7B5CFF,#4FA8FF)", size = 36 }) {
  // TODO: remplacer par <img> réel une fois les photos disponibles
  return (
    <span
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: accent, display: "flex", alignItems: "center", justifyContent: "center",
        font: `600 ${Math.round(size * 0.33)}px 'Space Grotesk',sans-serif`, color: "#fff",
      }}
    >
      {initial}
    </span>
  );
}

function AvisCard({ t, ariaHidden }) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      style={{
        width: 360, flexShrink: 0, padding: 20, borderRadius: 15, display: "flex", flexDirection: "column",
        background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
        <Stars color={t.accent} />
        <span style={{ font: "600 10.5px 'Space Grotesk',sans-serif", color: t.accent, background: `color-mix(in srgb, ${t.accent} 14%, transparent)`, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>
          {t.impact}
        </span>
      </div>
      <p style={{ margin: 0, font: "400 13px/1.6 'Hanken Grotesk',sans-serif", color: "#C6CCE8", flex: 1 }}>
        « {t.quote} »
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
        <Avatar initial={t.initial} accent={`linear-gradient(135deg,${t.accent},#4FA8FF)`} size={32} />
        <div>
          <div style={{ font: "600 12.5px 'Hanken Grotesk',sans-serif", color: "#EDEFFA" }}>{t.name}</div>
          <div style={{ font: "400 11px 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export default function Proof() {
  return (
    <section id="preuve" data-screen-label="Preuve" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 34 }}>
          <h2 className="h2">La preuve par les chiffres</h2>
          <p className="lead" style={{ maxWidth: 460 }}>Un ROI que vous pouvez mesurer, pas des promesses.</p>
        </div>

        {/* ---------- Témoignage vedette ---------- */}
        <div
          data-reveal="" className="proof-grid"
          style={{
            borderRadius: 18, border: "1px solid rgba(139,124,255,.35)",
            background: "linear-gradient(135deg,rgba(123,92,255,.12),rgba(79,168,255,.07))",
            padding: "40px 38px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 44, alignItems: "center",
          }}
        >
          <div>
            <div className="grad" style={{ font: "700 clamp(44px,6vw,76px)/.9 'Space Grotesk',sans-serif", letterSpacing: "-.03em", marginBottom: 8 }}>
              {FEATURED.value}
            </div>
            <div style={{ font: "600 16px 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>{FEATURED.unit}</div>
            <div style={{ font: "400 14px 'Hanken Grotesk',sans-serif", color: "#9AA2C4", marginTop: 4 }}>{FEATURED.note}</div>
          </div>
          <div>
            <Stars />
            <p style={{ margin: "11px 0 16px", font: "400 clamp(14.5px,1.6vw,16.5px)/1.6 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>
              « {FEATURED.quote} »
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <Avatar initial={FEATURED.initial} size={38} />
              <div>
                <div style={{ font: "600 14px 'Hanken Grotesk',sans-serif", color: "#EDEFFA" }}>{FEATURED.name}</div>
                <div style={{ font: "400 12.5px 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>{FEATURED.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Carrousel d'avis : slide droite → gauche, pause au survol.
           Le rail est dupliqué (2e copie aria-hidden) pour une boucle infinie. ---------- */}
      <div data-reveal="" className="avis-rail" style={{ marginTop: 26 }}>
        <div className="avis-track">
          {TESTIMONIALS.map((t) => <AvisCard key={t.name} t={t} />)}
          {TESTIMONIALS.map((t) => <AvisCard key={`dup-${t.name}`} t={t} ariaHidden />)}
        </div>
      </div>
    </section>
  );
}
