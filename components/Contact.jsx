/* ------------------------------------------------------------------
   Données réelles — source : donnees_site_vitrine_ritech_final.docx
   Recommandation : créer une adresse sur domaine (ex. contact@cieva.fr)
   redirigée vers Gmail — plus crédible qu'une adresse @gmail.com.
   ------------------------------------------------------------------ */

const CONTACT = {
  email: "fawzi.baliouz@gmail.com", // TODO: passer sur une adresse @cieva.fr
  phone: "06 23 92 83 74",
  city: "100% remote · France, Suisse, Belgique, Canada",
  hours: "Lun–Ven · 8h–19h",
  responseTime: "Devis sous 24–48 h",
};

function Row({ icon, label, value, href }) {
  const content = (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(139,124,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", color: "#A08CFF", flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ font: "600 11px 'Space Grotesk',sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: "#6B7396", marginBottom: 2 }}>{label}</div>
        <div style={{ font: "500 15px 'Hanken Grotesk',sans-serif", color: "#E4E7F8" }}>{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="lnk">{content}</a> : content;
}

export default function Contact() {
  return (
    <section id="contact" data-screen-label="Contact" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 42 }}>
          <h2 className="h2">Parlons de votre métier</h2>
          <p className="lead" style={{ maxWidth: 460 }}>Un échange court, concret. On vous dit franchement si on peut vous aider — ou pas.</p>
        </div>

        <div
          data-reveal="" className="split"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, alignItems: "stretch" }}
        >
          {/* Coordonnées */}
          <div
            style={{
              padding: "36px 34px", borderRadius: 18, display: "flex", flexDirection: "column", gap: 22,
              background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)",
            }}
          >
            <Row
              label="Email" value={CONTACT.email} href={`mailto:${CONTACT.email}`}
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>}
            />
            <Row
              label="Téléphone" value={CONTACT.phone} href="tel:+33623928374"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>}
            />
            <Row
              label="Zone" value={CONTACT.city}
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" /></svg>}
            />
            <Row
              label="Horaires" value={`${CONTACT.hours} · ${CONTACT.responseTime}`}
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            />
            <Row
              label="Support" value="Assistance critique 24/7 incluse les 6 premiers mois"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            />
          </div>

          {/* Bloc démo */}
          <div
            style={{
              padding: "36px 34px", borderRadius: 18, display: "flex", flexDirection: "column", justifyContent: "center",
              background: "linear-gradient(135deg,rgba(123,92,255,.14),rgba(79,168,255,.07))",
              border: "1px solid rgba(139,124,255,.35)",
            }}
          >
            <h3 style={{ margin: "0 0 10px", font: "700 22px 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>Réserver une démo</h3>
            <p style={{ margin: "0 0 24px", font: "400 15px/1.6 'Hanken Grotesk',sans-serif", color: "#9AA2C4" }}>
              15 minutes, sur votre métier. Repartez avec une idée claire du ROI — sans engagement.
            </p>
            <a
              href={`mailto:${CONTACT.email}`} className="btn-glow"
              style={{
                textAlign: "center", padding: "14px 24px", borderRadius: 11,
                background: "linear-gradient(135deg,#8B5CFF,#C05CFF)", color: "#fff",
                font: "600 15px 'Space Grotesk',sans-serif", boxShadow: "0 10px 30px rgba(150,92,255,.4)",
              }}
            >
              Réserver une démo (15 min)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
