"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";

// Canvas 3D chargé côté client uniquement (pas de SSR de three.js)
const Hero3DScene = dynamic(() => import("./Hero3DScene"), { ssr: false });

// ---------- UI générique dessinée en HTML/CSS (aucun texte réel) ----------
function ScreenUI({ rect, on }) {
  if (!rect) return null;
  const pad = rect.width * 0.055;
  const bar = (w, c = "rgba(255,255,255,.28)") => (
    <span style={{ display: "block", height: Math.max(3, rect.width * 0.018), width: w, borderRadius: 99, background: c }} />
  );
  const item = (i, child) => (
    <div
      key={i}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(6px)",
        transition: on ? `opacity .45s ease ${0.12 * i}s, transform .45s ease ${0.12 * i}s` : "none",
      }}
    >
      {child}
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: rect.left, top: rect.top, width: rect.width, height: rect.height,
        borderRadius: rect.width * 0.09, overflow: "hidden", pointerEvents: "none",
        background: on ? "linear-gradient(180deg,#0B1030 0%,#080B20 100%)" : "transparent",
        transition: "background .5s ease",
        display: "grid", gridTemplateColumns: `${rect.width * 0.14}px 1fr`,
        padding: pad, gap: pad * 0.8, boxSizing: "border-box",
      }}
    >
      {/* sidebar */}
      {item(0, (
        <div style={{ display: "flex", flexDirection: "column", gap: pad * 0.9, alignItems: "center", paddingTop: pad * 0.5 }}>
          {["#009FE3", "rgba(255,255,255,.25)", "rgba(255,255,255,.25)", "rgba(255,255,255,.25)"].map((c, k) => (
            <span key={k} style={{ width: rect.width * 0.05, height: rect.width * 0.05, borderRadius: 5, background: c }} />
          ))}
        </div>
      ))}
      <div style={{ display: "flex", flexDirection: "column", gap: pad * 0.7 }}>
        {/* 3 cartes KPI */}
        {item(1, (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: pad * 0.5 }}>
            {["#009FE3", "#7C5CFF", "rgba(255,255,255,.12)"].map((c, k) => (
              <div key={k} style={{ height: rect.height * 0.1, borderRadius: 8, background: c, opacity: k === 2 ? 1 : 0.85, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: pad * 0.35, gap: 4, boxSizing: "border-box" }}>
                {bar("70%", "rgba(255,255,255,.5)")}
                {bar("45%", "rgba(255,255,255,.32)")}
              </div>
            ))}
          </div>
        ))}
        {/* courbe */}
        {item(2, (
          <div style={{ height: rect.height * 0.3, borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: "100%", height: "82%" }}>
              <polyline
                points="0,34 12,30 24,32 36,22 48,26 60,14 72,18 84,8 100,10"
                fill="none" stroke="#009FE3" strokeWidth="2.4"
                style={{ filter: "drop-shadow(0 0 4px rgba(0,159,227,.9))" }}
              />
            </svg>
          </div>
        ))}
        {/* 2 lignes de liste */}
        {[3, 4].map((i) =>
          item(i, (
            <div style={{ display: "flex", alignItems: "center", gap: pad * 0.5, height: rect.height * 0.09, borderRadius: 8, background: "rgba(255,255,255,.07)", padding: `0 ${pad * 0.5}px`, boxSizing: "border-box" }}>
              <span style={{ width: rect.width * 0.06, height: rect.width * 0.06, borderRadius: 6, background: i === 3 ? "#009FE3" : "#7C5CFF", flexShrink: 0 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                {bar("72%")}
                {bar("48%", "rgba(255,255,255,.18)")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Hero3D() {
  const ctrl = useRef({ angle: 0, vel: 0, turn: 0, dragging: false, lastX: 0, lastT: 0 });
  const [uiOn, setUiOn] = useState(false);
  const [rect, setRect] = useState(null);
  const [hasDragged, setHasDragged] = useState(false);

  const onDown = (e) => {
    const s = ctrl.current;
    s.dragging = true;
    s.lastX = e.clientX;
    s.lastT = performance.now();
    setUiOn(false);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    const s = ctrl.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const now = performance.now();
    const dt = Math.max(8, now - s.lastT) / 1000;
    const da = dx * 0.008;
    s.angle += da;
    s.vel = (da / dt) * 0.25;
    s.turn += Math.abs(da);
    s.lastX = e.clientX;
    s.lastT = now;
    if (!hasDragged && s.turn > 0.3) setHasDragged(true);
  };
  const onUp = () => {
    ctrl.current.dragging = false;
  };

  return (
    <section
      data-screen-label="Hero3D"
      style={{
        position: "relative", zIndex: 2, height: "100vh", overflow: "hidden",
        background:
          "radial-gradient(900px 520px at 50% 38%, rgba(96,72,220,.16), transparent 62%)," +
          "radial-gradient(700px 420px at 50% 42%, rgba(0,159,227,.07), transparent 60%)," +
          "linear-gradient(180deg,#070915 0%,#05060E 100%)",
      }}
    >
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
        style={{ position: "absolute", inset: 0, cursor: "grab", touchAction: "pan-y" }}
      >
        <Hero3DScene ctrl={ctrl} onFacing={setUiOn} onRectReady={setRect} />
        <ScreenUI rect={rect} on={uiOn} />
      </div>

      {/* Overlay HTML — titre + CTA */}
      <div
        style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-end", textAlign: "center",
          padding: "0 24px 6vh", pointerEvents: "none",
        }}
      >
        <div style={{ font: "600 12px/1 'Space Grotesk',sans-serif", letterSpacing: ".28em", textTransform: "uppercase", color: "#9AA2C4", marginBottom: 16 }}>
          Cieva · Agence IA
        </div>
        <h1 style={{ margin: "0 auto 14px", maxWidth: "16ch", font: "700 clamp(34px,5vw,58px)/1.08 'Space Grotesk',sans-serif", letterSpacing: "-.02em", color: "#F5F6FF" }}>
          Votre métier, <span className="grad">en pilote automatique.</span>
        </h1>
        <p style={{ margin: "0 auto 22px", maxWidth: 460, font: "400 16px/1.6 'Hanken Grotesk',sans-serif", color: "#9AA2C4" }}>
          On transforme vos process désordonnés en applications métier propres.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap", pointerEvents: "auto" }}>
          <a
            href="#demo"
            style={{
              padding: "13px 24px", borderRadius: 11, background: "linear-gradient(135deg,#8B5CFF,#C05CFF)",
              color: "#fff", font: "600 15px 'Space Grotesk',sans-serif",
              boxShadow: "0 10px 30px rgba(150,92,255,.45)", border: "1px solid rgba(255,255,255,.2)",
            }}
          >
            Réserver une démo
          </a>
          <a
            href="#produits"
            style={{
              padding: "13px 24px", borderRadius: 11, background: "rgba(255,255,255,.06)",
              color: "#EAF0FF", font: "600 15px 'Space Grotesk',sans-serif",
              border: "1px solid rgba(255,255,255,.14)",
            }}
          >
            Voir les produits
          </a>
        </div>
        <div
          style={{
            marginTop: 20, font: "500 13px 'Hanken Grotesk',sans-serif", letterSpacing: ".04em",
            color: "#7C84A8", opacity: hasDragged ? 0 : 1, transition: "opacity .6s ease",
          }}
        >
          Faites tourner le téléphone ↺
        </div>
      </div>
    </section>
  );
}
