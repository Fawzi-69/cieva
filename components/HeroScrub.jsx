"use client";

import { useEffect, useRef, useState } from "react";

// Hero « video-to-website » : la transition chaos → interface est découpée en
// frames et scrubbée par le scroll. La vidéo EST le hero ; le titre reste en
// HTML par-dessus (jamais incrusté dans l'image).
const FRAME_COUNT = 72;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const frameSrc = (i) => `${BASE}/hero-frames/f${String(i + 1).padStart(3, "0")}.webp`;

export default function HeroScrub() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(-1);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Les états de repos affichent les originaux 4K (hero-first/hero-last), bien plus
  // nets que la vidéo 1080p : le canvas ne sert que pendant le mouvement.
  const [atEnd, setAtEnd] = useState(false);
  const [atStart, setAtStart] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = (img) => {
      if (!img || !img.complete || !img.naturalWidth) return;
      const { width: cw, height: ch } = canvas;
      // cover : remplit le canvas en rognant au centre
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      const img = imagesRef.current[Math.max(frameRef.current, 0)];
      draw(img);
    };

    // Préchargement : première frame tout de suite, le reste en arrière-plan.
    const imgs = imagesRef.current;
    const load = (i) =>
      new Promise((res) => {
        if (imgs[i]) return res(imgs[i]);
        const im = new Image();
        im.onload = () => res(im);
        im.onerror = () => res(null);
        im.src = frameSrc(i);
        imgs[i] = im;
      });
    load(0).then((im) => {
      frameRef.current = 0;
      draw(im);
      for (let i = 1; i < FRAME_COUNT; i++) load(i);
    });

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
        const p = total > 0 ? scrolled / total : 0;
        setAtEnd(p >= 0.999);
        setAtStart(p <= 0.005);
        const idx = Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
        if (idx !== frameRef.current) {
          const img = imagesRef.current[idx];
          if (img && img.complete && img.naturalWidth) {
            frameRef.current = idx;
            draw(img);
          }
        }
      });
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={wrapRef} data-screen-label="HeroScrub" style={{ height: "260vh", position: "relative", zIndex: 2 }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        {/* Image finale 4K en fond permanent : le canvas se fond dessus au raccord */}
        <img
          src={`${BASE}/hero-last.webp`}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {!reducedMotion && (
          <>
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                opacity: atEnd ? 0 : 1, transition: "opacity 250ms ease",
              }}
            />
            {/* Image de départ 4K par-dessus tant qu'on n'a pas scrollé */}
            <img
              src={`${BASE}/hero-first.webp`}
              alt=""
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                opacity: atStart ? 1 : 0, transition: "opacity 250ms ease", pointerEvents: "none",
              }}
            />
          </>
        )}

        {/* voile bas pour la lisibilité du texte, quel que soit le contenu de la frame */}
        <div
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: "46%", pointerEvents: "none",
            background: "linear-gradient(180deg,transparent 0%,rgba(5,6,14,.55) 55%,rgba(5,6,14,.9) 100%)",
          }}
        />

        {/* Overlay HTML — jamais incrusté dans les frames */}
        <div
          style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "flex-end", textAlign: "center",
            padding: "0 24px 7vh",
          }}
        >
          <div style={{ font: "600 12px/1 'Space Grotesk',sans-serif", letterSpacing: ".28em", textTransform: "uppercase", color: "#9AA2C4", marginBottom: 16 }}>
            Cieva · Agence IA
          </div>
          <h1 style={{ margin: "0 auto 14px", maxWidth: "16ch", font: "700 clamp(34px,5vw,58px)/1.08 'Space Grotesk',sans-serif", letterSpacing: "-.02em", color: "#F5F6FF" }}>
            Votre métier, <span className="grad">en pilote automatique.</span>
          </h1>
          <p style={{ margin: "0 auto 24px", maxWidth: 460, font: "400 16px/1.6 'Hanken Grotesk',sans-serif", color: "#9AA2C4" }}>
            On transforme vos process désordonnés en applications métier propres.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
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
        </div>
      </div>
    </section>
  );
}
