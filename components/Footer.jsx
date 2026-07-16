import Link from "next/link";
import { LogoMark } from "./Logo";

const linkStyle = { font: "400 13.5px 'Hanken Grotesk',sans-serif", color: "#9AA2C4" };
const headStyle = { font: "600 12px/1 'Space Grotesk',sans-serif", letterSpacing: ".12em", textTransform: "uppercase", color: "#6B7396", marginBottom: 14 };

export default function Footer() {
  return (
    <footer data-screen-label="Footer" style={{ position: "relative", zIndex: 2, marginTop: 96, borderTop: "1px solid rgba(255,255,255,.07)", padding: "52px 0 40px" }}>
      <div className="footer-grid" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <LogoMark size={26} />
            <span style={{ font: "700 16px 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>Cieva</span>
          </div>
          <p style={{ margin: 0, maxWidth: 260, font: "400 13.5px/1.6 'Hanken Grotesk',sans-serif", color: "#7C84A8" }}>
            Applications métier sur-mesure pour les PME. Une constellation de produits, à votre marque.
          </p>
        </div>
        <div>
          <div style={headStyle}>Produits</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="#produits" className="lnk" style={linkStyle}>Sielo — Transport</a>
            <a href="#produits" className="lnk" style={linkStyle}>Vela — Interventions & Trésorerie</a>
            <a href="#produits" className="lnk" style={linkStyle}>Lyra — Assistant vocal</a>
          </div>
        </div>
        <div>
          <div style={headStyle}>Société</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="#sur-mesure" className="lnk" style={linkStyle}>Sur-mesure</a>
            <a href="#preuve" className="lnk" style={linkStyle}>Preuve & ROI</a>
            <a href="#equipe" className="lnk" style={linkStyle}>Équipe</a>
            <a href="#demarche" className="lnk" style={linkStyle}>Démarche</a>
          </div>
        </div>
        <div>
          <div style={headStyle}>Contact</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* TODO: passer sur une adresse @cieva.fr */}
            <a href="mailto:fawzi.baliouz@gmail.com" className="lnk" style={linkStyle}>fawzi.baliouz@gmail.com</a>
            <a href="tel:+33623928374" className="lnk" style={linkStyle}>06 23 92 83 74</a>
            <a href="#contact" className="lnk" style={linkStyle}>Réserver une démo</a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1080, margin: "32px auto 0", padding: "0 32px", font: "400 12px/1.6 'Hanken Grotesk',sans-serif", color: "#5A6284" }}>
        Cieva — une marque de RITECH Services Informatiques · 813 634 979 R.C.S. Lyon · Agence française 100% digitale — France, Suisse, Belgique, Canada · Hébergement : infrastructure cloud managée (AWS / Firebase)
      </div>
      <div style={{ maxWidth: 1080, margin: "16px auto 0", padding: "18px 32px 0", borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", font: "400 12.5px 'Hanken Grotesk',sans-serif", color: "#6B7396" }}>
        <span>© 2026 Cieva — Applications métier sur-mesure.</span>
        <span style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link href="/mentions-legales" className="lnk">Mentions légales</Link>
          <Link href="/confidentialite" className="lnk">Confidentialité</Link>
        </span>
      </div>
    </footer>
  );
}
