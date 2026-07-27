import AvisRail from "./AvisRail";

/* Preuve : témoignage vedette + carrousel d'avis (AvisRail, client).
   Verbatim exact — source : donnees_site_vitrine_ritech_final.docx.
   Les chiffres agence et références sont dans StatsBand (sous le hero).
   TODO : photo réelle à la place des initiales. */

const FEATURED = {
  quote:
    "L'intégration de la plateforme Sielo a totalement révolutionné notre chaîne logistique. Avant, la gestion manuelle des camions et des plannings était une friction administrative quotidienne. Grâce à leur solution automatisée intelligente, nous avons gagné 70 % de temps opérationnel. Obtenir un tel niveau de sur-mesure sans passer par les budgets pharaoniques des éditeurs traditionnels à 15k€ a été le déclencheur de notre croissance.",
  value: "+70%", unit: "de temps opérationnel", note: "gagné sur la chaîne logistique",
  name: "Mehdy K.",
  role: "Directeur des Opérations Logistiques · Sielo",
  initial: "MK",
};

function Stars() {
  return (
    <div style={{ display: "flex", gap: 2 }} aria-label="5 sur 5">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#8B7BFF">
          <path d="M12 2l2.4 6.5L21 9l-5 4.3L17.6 20 12 16.5 6.4 20 8 13.3 3 9l6.6-.5L12 2z" />
        </svg>
      ))}
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
              {/* TODO: remplacer par <img> réel une fois la photo disponible */}
              <span style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#7B5CFF,#4FA8FF)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 13px 'Space Grotesk',sans-serif", color: "#fff" }}>
                {FEATURED.initial}
              </span>
              <div>
                <div style={{ font: "600 14px 'Hanken Grotesk',sans-serif", color: "#EDEFFA" }}>{FEATURED.name}</div>
                <div style={{ font: "400 12.5px 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>{FEATURED.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AvisRail />
    </section>
  );
}
