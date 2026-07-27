/* Bande de crédibilité immédiate, affichée directement sous le hero :
   4 chiffres agence + références clients. Données réelles RITECH. */

const STATS = [
  { value: "+50", label: "applications livrées en prod" },
  { value: "2 sem.", label: "du cahier des charges au MVP" },
  { value: "70%", label: "de temps opérationnel gagné" },
  { value: "24/7", label: "assistance critique 6 mois incluse" },
];

// TODO: remplacer les libellés par les vrais logos <img> (SVG mono de préférence)
const LOGOS = ["Auchan", "Primark", "Orange", "La FDJ", "Maintronic"];

export default function StatsBand() {
  return (
    <section data-screen-label="Chiffres" style={{ position: "relative", zIndex: 2, padding: "56px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                padding: "22px 14px", borderRadius: 14, textAlign: "center",
                background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)",
              }}
            >
              <div className="grad" style={{ font: "700 clamp(26px,3vw,32px)/1 'Space Grotesk',sans-serif", letterSpacing: "-.02em" }}>{s.value}</div>
              <div style={{ marginTop: 7, font: "400 12.5px/1.45 'Hanken Grotesk',sans-serif", color: "#8F97BA" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div data-reveal="" style={{ marginTop: 26, textAlign: "center" }}>
          <div style={{ font: "600 10.5px 'Space Grotesk',sans-serif", letterSpacing: ".16em", textTransform: "uppercase", color: "#6B7396", marginBottom: 4 }}>
            Ils nous ont fait confiance
          </div>
          <div style={{ font: "400 11.5px 'Hanken Grotesk',sans-serif", color: "#5A6284", marginBottom: 14 }}>
            En direct ou via nos partenaires (Experis, Fujitsu, Toshiba)
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 32px" }}>
            {LOGOS.map((name) => (
              <span key={name} style={{ font: "600 14.5px 'Space Grotesk',sans-serif", color: "#8F97BA", opacity: 0.75 }}>{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
