import Link from "next/link";
import { LogoMark } from "./Logo";

/* Gabarit des pages légales : en-tête minimal (les ancres de la Nav
   principale ne fonctionnent que sur la home), prose stylée via .legal. */
export default function LegalPage({ title, updated, children }) {
  return (
    <div className="page">
      <header
        style={{
          position: "sticky", top: 0, zIndex: 60,
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          background: "rgba(6,8,18,.6)", borderBottom: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }} aria-label="Cieva — accueil">
            <LogoMark size={30} />
            <span style={{ font: "700 18px/1 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>Cieva</span>
          </Link>
          <Link href="/" className="lnk" style={{ font: "500 14px 'Hanken Grotesk',sans-serif", color: "#A7AECB" }}>
            ← Retour au site
          </Link>
        </div>
      </header>

      <main className="legal" style={{ position: "relative", zIndex: 2, maxWidth: 760, margin: "0 auto", padding: "72px 32px 96px" }}>
        <h1 className="h2" style={{ marginBottom: 8 }}>{title}</h1>
        <p style={{ font: "400 13px 'Hanken Grotesk',sans-serif", color: "#6B7396", marginBottom: 8 }}>
          Dernière mise à jour : {updated}
        </p>
        {children}
      </main>

      <footer style={{ position: "relative", zIndex: 2, borderTop: "1px solid rgba(255,255,255,.07)", padding: "28px 32px", textAlign: "center", font: "400 12.5px 'Hanken Grotesk',sans-serif", color: "#6B7396" }}>
        © 2026 Cieva — une marque de RITECH Services Informatiques · 813 634 979 R.C.S. Lyon
      </footer>
    </div>
  );
}
