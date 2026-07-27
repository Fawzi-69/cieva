/* CTA + Contact fusionnés (Plan 1) : un seul écran de clôture.
   Coordonnées réelles. TODO : passer sur une adresse @cieva.fr. */

const CONTACT = {
  email: "fawzi.baliouz@gmail.com",
  phone: "06 23 92 83 74",
  phoneHref: "tel:+33623928374",
  zone: "100% remote · France, Suisse, Belgique, Canada",
  hours: "Lun–Ven · 8h–19h · Devis sous 24–48 h",
};

const coStyle = {
  display: "block", padding: "11px 15px", borderRadius: 10,
  background: "rgba(0,0,0,.25)", color: "#fff",
  font: "500 14px 'Hanken Grotesk',sans-serif",
};

export default function Cta() {
  return (
    <section id="demo" data-screen-label="Contact" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      {/* ancre secondaire pour les liens #contact (nav, footer) */}
      <span id="contact" style={{ position: "absolute", top: 0 }} aria-hidden="true" />
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div
          data-reveal="" className="split"
          style={{
            position: "relative", borderRadius: 22, overflow: "hidden", padding: "48px 40px",
            background: "linear-gradient(110deg,#4B7BFF 0%,#7B5CFF 45%,#C05CFF 100%)",
            boxShadow: "0 24px 70px rgba(110,92,255,.4)",
            display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 40, alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 12px", font: "700 clamp(24px,3vw,36px)/1.15 'Space Grotesk',sans-serif", letterSpacing: "-.02em", color: "#fff" }}>
              Prêt à voir votre outil ? Voyons ça en 15 minutes.
            </h2>
            <p style={{ margin: "0 0 24px", font: "400 15px/1.6 'Hanken Grotesk',sans-serif", color: "rgba(255,255,255,.85)" }}>
              Une démo concrète, sur votre métier. Repartez avec une idée claire du ROI — sans engagement.
              On vous dit franchement si on peut vous aider, ou pas.
            </p>
            <a
              href={`mailto:${CONTACT.email}`} className="btn-glow"
              style={{ display: "inline-block", padding: "14px 28px", borderRadius: 11, background: "#0D0F1E", color: "#fff", font: "600 15px 'Space Grotesk',sans-serif", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}
            >
              Réserver une démo (15 min)
            </a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href={`mailto:${CONTACT.email}`} className="soft" style={coStyle}>📧 {CONTACT.email}</a>
            <a href={CONTACT.phoneHref} className="soft" style={coStyle}>📞 {CONTACT.phone}</a>
            <span style={coStyle}>🌍 {CONTACT.zone}</span>
            <span style={coStyle}>🕗 {CONTACT.hours}</span>
            <span style={coStyle}>🛡 Assistance critique 24/7 incluse les 6 premiers mois</span>
          </div>
        </div>
      </div>
    </section>
  );
}
