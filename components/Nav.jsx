"use client";

import { useState } from "react";
import Logo from "./Logo";

const LINKS = [
  { href: "#produits", label: "Produits" },
  { href: "#sur-mesure", label: "Sur-mesure" },
  { href: "#preuve", label: "Preuve" },
  { href: "#equipe", label: "Équipe" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 60,
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        background: "rgba(6,8,18,.6)", borderBottom: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <div
        className="nav-in"
        style={{
          maxWidth: 1200, margin: "0 auto", padding: "14px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        }}
      >
        <Logo size={30} nameSize={18} />
        <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: 26 }}>
          {LINKS.slice(0, 4).map((l) => (
            <a key={l.href} href={l.href} className="lnk" style={{ font: "500 14px 'Hanken Grotesk',sans-serif", color: "#A7AECB" }}>{l.label}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href="#contact" className="lnk nav-secondary" style={{ font: "600 14px 'Hanken Grotesk',sans-serif", color: "#C6CCE8" }}>Contact</a>
          <a
            href="#demo" className="btn-glow nav-demo"
            style={{
              padding: "10px 18px", borderRadius: 10, background: "linear-gradient(135deg,#7B5CFF,#4FA8FF)",
              color: "#fff", font: "600 14px 'Space Grotesk',sans-serif",
              boxShadow: "0 6px 20px rgba(110,92,255,.4)", border: "1px solid rgba(255,255,255,.16)",
            }}
          >
            Réserver une démo
          </a>
          <button
            className="nav-burger"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="nav-mobile" aria-label="Menu mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#demo" onClick={() => setOpen(false)} className="nav-mobile-cta">Réserver une démo</a>
        </nav>
      )}
    </header>
  );
}
