import OrbitalScene, { Planet, GlassCard } from "./OrbitalScene";

const CARDS = [
  { pos: { left: "6%", top: "8%" }, anim: "nx-float 6.5s ease-in-out infinite", title: "Dispatch · Sielo", accent: "#009FE3", wide: true },
  { pos: { left: "2%", top: "56%" }, anim: "nx-float 7.5s ease-in-out .8s infinite", title: "Chantiers", accent: "#5FC3F0", wide: false },
  { pos: { left: "1%", top: "30%" }, anim: "nx-float 8s ease-in-out .4s infinite", title: "Suivi de flotte", accent: "#4FA8FF", wide: false },
  { pos: { right: "8%", top: "6%" }, anim: "nx-float 7s ease-in-out .6s infinite", title: "Email → Intervention", accent: "#7C5CFF", wide: true },
  { pos: { right: "1%", top: "32%" }, anim: "nx-float 8.5s ease-in-out 1.2s infinite", title: "Accueil vocal 24/7", accent: "#12A594", wide: true },
  { pos: { right: "6%", top: "62%" }, anim: "nx-float 6.8s ease-in-out .2s infinite", title: "Planning équipes", accent: "#B49BFF", wide: false },
];

export default function Hero() {
  return (
    <section data-screen-label="Hero" style={{ position: "relative", zIndex: 2, padding: "84px 0 0", textAlign: "center" }}>
      <a id="top" />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px", position: "relative" }}>
        <div style={{ position: "absolute", left: -40, top: -8, animation: "nx-float 7s ease-in-out infinite" }}>
          <Planet main="#4FA8FF" ring="#8B7BFF" size={62} />
        </div>
        <div style={{ position: "absolute", right: -40, top: 8, animation: "nx-float 8s ease-in-out 1s infinite" }}>
          <Planet main="#C05CFF" ring="#4FD6FF" size={56} />
        </div>
        <h1
          data-reveal=""
          style={{
            margin: "0 auto 20px", maxWidth: "18ch",
            font: "700 clamp(40px,5.6vw,64px)/1.08 'Space Grotesk',sans-serif",
            letterSpacing: "-.02em", color: "#F5F6FF",
          }}
        >
          Votre métier, <span className="grad">en pilote automatique.</span>
        </h1>
        <p
          data-reveal=""
          style={{
            margin: "0 auto 30px", maxWidth: 480,
            font: "400 16.5px/1.65 'Hanken Grotesk',sans-serif", color: "#9AA2C4",
          }}
        >
          Cieva conçoit des applications métier sur-mesure pour les PME. Votre marque, vos données,
          vos règles — livré en deux semaines, avec un ROI chiffrable.
        </p>
        <div data-reveal="" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
          <a
            href="#demo"
            style={{
              padding: "13px 24px", borderRadius: 11, background: "linear-gradient(135deg,#8B5CFF,#C05CFF)",
              color: "#fff", font: "600 15px 'Space Grotesk',sans-serif",
              boxShadow: "0 10px 30px rgba(150,92,255,.45)", border: "1px solid rgba(255,255,255,.2)",
              animation: "nx-glow 3.6s ease-in-out infinite",
            }}
          >
            Réserver une démo (15 min)
          </a>
          <a
            href="#produits" className="soft"
            style={{
              padding: "13px 24px", borderRadius: 11, background: "rgba(255,255,255,.05)",
              color: "#E4E7F8", font: "600 15px 'Space Grotesk',sans-serif", border: "1px solid rgba(255,255,255,.14)",
            }}
          >
            Voir les produits
          </a>
        </div>
      </div>

      {/* Orbital scene + floating cards */}
      <div className="orbital" style={{ position: "relative", maxWidth: 1200, margin: "26px auto 0", height: 480 }}>
        <OrbitalScene />
        {CARDS.map((c, i) => (
          <div key={i} style={{ position: "absolute", ...c.pos, animation: c.anim }}>
            <GlassCard title={c.title} accent={c.accent} wide={c.wide} />
          </div>
        ))}
      </div>
    </section>
  );
}
