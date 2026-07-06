import Logo from "./Logo";

export default function Nav() {
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 60,
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        background: "rgba(6,8,18,.6)", borderBottom: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1200, margin: "0 auto", padding: "14px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}
      >
        <Logo size={30} nameSize={18} />
        <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <a href="#produits" className="lnk" style={{ font: "500 14px 'Hanken Grotesk',sans-serif", color: "#A7AECB" }}>Produits</a>
          <a href="#sur-mesure" className="lnk" style={{ font: "500 14px 'Hanken Grotesk',sans-serif", color: "#A7AECB" }}>Sur-mesure</a>
          <a href="#preuve" className="lnk" style={{ font: "500 14px 'Hanken Grotesk',sans-serif", color: "#A7AECB" }}>Preuve</a>
          <a href="#demarche" className="lnk" style={{ font: "500 14px 'Hanken Grotesk',sans-serif", color: "#A7AECB" }}>Démarche</a>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="#faq" className="lnk nav-secondary" style={{ font: "600 14px 'Hanken Grotesk',sans-serif", color: "#C6CCE8" }}>FAQ</a>
          <a
            href="#demo" className="btn-glow"
            style={{
              padding: "10px 18px", borderRadius: 10, background: "linear-gradient(135deg,#7B5CFF,#4FA8FF)",
              color: "#fff", font: "600 14px 'Space Grotesk',sans-serif",
              boxShadow: "0 6px 20px rgba(110,92,255,.4)", border: "1px solid rgba(255,255,255,.16)",
            }}
          >
            Réserver une démo
          </a>
        </div>
      </div>
    </header>
  );
}
