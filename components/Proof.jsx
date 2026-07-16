/* ------------------------------------------------------------------
   CONTENU À REMPLACER (placeholders marqués TODO)
   - AGENCY_STATS : chiffres réels de l'agence
   - LOGOS        : noms/logos réels des clients (idéalement <img> SVG mono)
   - FEATURED     : témoignage vedette (le transporteur 17→30) — nom réel
   - TESTIMONIALS : 2 autres témoignages nommés + photos
   ------------------------------------------------------------------ */

// TODO: remplacer par les vrais chiffres de l'agence
const AGENCY_STATS = [
  { value: "12", suffix: "+", label: "applications livrées", sub: "en production chez nos clients" },
  { value: "2", suffix: " sem.", label: "délai moyen", sub: "de la démo à la mise en prod" },
  { value: "100", suffix: "%", label: "mises en production", sub: "aucun projet abandonné" },
];

// TODO: remplacer par les vrais clients (logos SVG mono de préférence)
const LOGOS = ["Transporteur régional", "Groupe BTP", "Réseau d'installateurs", "PME logistique", "Artisan multi-sites"];

// TODO: nom réel du dirigeant + entreprise (avec accord de citation)
const FEATURED = {
  quote:
    "On a presque doublé la flotte en gardant la même équipe au bureau. Cieva gère le dispatch que je faisais de tête.",
  from: "17", to: "30", unit: "camions", note: "sans embaucher d'exploitant",
  name: "Dirigeant",            // TODO: prénom + nom
  role: "Transporteur régional · client Sielo", // TODO: fonction · entreprise
  initial: "T",                 // TODO: initiale ou photo
};

// TODO: 2 vrais témoignages nommés (prénom, rôle, entreprise, photo)
const TESTIMONIALS = [
  {
    quote:
      "Fini les doubles saisies entre le planning et les emails. Mes techniciens reçoivent leurs interventions directement, à jour.",
    name: "Responsable d'exploitation", // TODO
    role: "Installateur · client Vela",  // TODO
    initial: "V",
    accent: "#7C5CFF",
  },
  {
    quote:
      "Plus aucun appel manqué le soir ou le week-end. L'assistant qualifie et prend les rendez-vous à notre place.",
    name: "Gérante",                      // TODO
    role: "PME de services · client Lyra", // TODO
    initial: "L",
    accent: "#3DDC97",
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

function Avatar({ initial, accent = "linear-gradient(135deg,#7B5CFF,#4FA8FF)" }) {
  // TODO: remplacer par <img> réel une fois les photos disponibles
  return (
    <span
      style={{
        width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
        background: accent, display: "flex", alignItems: "center", justifyContent: "center",
        font: "600 15px 'Space Grotesk',sans-serif", color: "#fff",
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
          data-reveal="" className="grid-3"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 22 }}
        >
          {AGENCY_STATS.map((s) => (
            <div
              key={s.label}
              style={{
                padding: "30px 26px", borderRadius: 16, textAlign: "center",
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2 }}>
                <span className="grad" style={{ font: "700 clamp(38px,5vw,56px)/1 'Space Grotesk',sans-serif", letterSpacing: "-.03em" }}>{s.value}</span>
                <span className="grad" style={{ font: "700 22px 'Space Grotesk',sans-serif" }}>{s.suffix}</span>
              </div>
              <div style={{ marginTop: 10, font: "600 15px 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>{s.label}</div>
              <div style={{ marginTop: 3, font: "400 13px 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ---------- Bandeau logos clients ---------- */}
        <div data-reveal="" style={{ marginBottom: 40 }}>
          <div style={{ textAlign: "center", font: "600 11px 'Space Grotesk',sans-serif", letterSpacing: ".14em", textTransform: "uppercase", color: "#6B7396", marginBottom: 18 }}>
            Ils nous font confiance
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 34px" }}>
            {LOGOS.map((name) => (
              // TODO: remplacer le texte par le vrai logo <img>
              <span key={name} style={{ font: "600 15px 'Space Grotesk',sans-serif", color: "#8F97BA", opacity: 0.75 }}>{name}</span>
            ))}
          </div>
        </div>

        {/* ---------- Témoignage vedette (étude de cas) ---------- */}
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
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
              <span style={{ font: "700 clamp(48px,7vw,84px)/.9 'Space Grotesk',sans-serif", letterSpacing: "-.03em", color: "#F2F4FF" }}>{FEATURED.from}</span>
              <svg width="34" height="24" viewBox="0 0 40 28" fill="none"><path d="M4 14h30M26 6l9 8-9 8" stroke="#8B7BFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="grad" style={{ font: "700 clamp(48px,7vw,84px)/.9 'Space Grotesk',sans-serif", letterSpacing: "-.03em" }}>{FEATURED.to}</span>
            </div>
            <div style={{ font: "600 17px 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>{FEATURED.unit}</div>
            <div style={{ font: "400 14.5px 'Hanken Grotesk',sans-serif", color: "#9AA2C4", marginTop: 4 }}>{FEATURED.note}</div>
          </div>
          <div>
            <Stars />
            <p style={{ margin: "12px 0 18px", font: "400 clamp(17px,1.9vw,21px)/1.55 'Space Grotesk',sans-serif", color: "#EDEFFA" }}>
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

        {/* ---------- Autres témoignages ---------- */}
        <div className="split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name + t.role}
              data-reveal=""
              style={{
                padding: "26px 26px", borderRadius: 16, display: "flex", flexDirection: "column",
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <Stars color={t.accent} />
              <p style={{ margin: "12px 0 20px", font: "400 15.5px/1.6 'Hanken Grotesk',sans-serif", color: "#D3D8EE", flex: 1 }}>
                « {t.quote} »
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <Avatar initial={t.initial} accent={`linear-gradient(135deg,${t.accent},#4FA8FF)`} />
                <div>
                  <div style={{ font: "600 14px 'Hanken Grotesk',sans-serif", color: "#EDEFFA" }}>{t.name}</div>
                  <div style={{ font: "400 12.5px 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
