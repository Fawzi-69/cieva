"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Deux semaines, vraiment ?",
    a: "Oui — parce qu'on ne développe pas depuis zéro. On part d'une base déjà éprouvée sur le terrain et on la personnalise : votre marque, vos données, vos règles métier.",
  },
  {
    q: "Où sont mes données ?",
    a: "Chez vous. Vos données sont isolées dans votre instance, jamais mutualisées avec d'autres clients, et restent votre propriété.",
  },
  {
    q: "C'est vraiment à ma marque ?",
    a: "Votre logo, vos couleurs, le nom de votre choix. Vos équipes et vos clients voient votre outil — pas le nôtre.",
  },
  {
    q: "Comment mesurer le ROI ?",
    a: "Lors de la démo, on chiffre ensemble : heures d'exploitation économisées, ressaisies supprimées, appels manqués récupérés. Un de nos clients transporteurs est passé de 17 à 30 camions sans embaucher d'exploitant.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" data-screen-label="FAQ" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px" }}>
        <div data-reveal="" style={{ textAlign: "center", marginBottom: 38 }}>
          <h2 className="h2">FAQ</h2>
          <p className="lead" style={{ maxWidth: 420 }}>Les questions qu'on nous pose avant de se lancer.</p>
        </div>
        <div data-reveal="" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="qcard"
                onClick={() => setOpen(isOpen ? -1 : i)}
                style={{ borderRadius: 13, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)", padding: "18px 20px", cursor: "pointer" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <span style={{ font: "600 15px 'Hanken Grotesk',sans-serif", color: "#E4E7F8" }}>{f.q}</span>
                  <span style={{ font: "400 18px 'Space Grotesk',sans-serif", color: "#8B7BFF" }}>{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <p style={{ margin: "12px 0 0", font: "400 14.5px/1.65 'Hanken Grotesk',sans-serif", color: "#9AA2C4" }}>{f.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
