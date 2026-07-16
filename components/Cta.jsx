export default function Cta() {
  return (
    <section id="demo" data-screen-label="CTA" style={{ position: "relative", zIndex: 2, padding: "104px 0 0" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 32px" }}>
        <div
          data-reveal=""
          style={{
            position: "relative", borderRadius: 22, overflow: "hidden", padding: "56px 40px", textAlign: "center",
            background: "linear-gradient(110deg,#4B7BFF 0%,#7B5CFF 45%,#C05CFF 100%)",
            boxShadow: "0 24px 70px rgba(110,92,255,.4)",
          }}
        >
          <h2 style={{ margin: "0 auto 12px", maxWidth: "24ch", font: "700 clamp(26px,3.4vw,40px)/1.15 'Space Grotesk',sans-serif", letterSpacing: "-.02em", color: "#fff" }}>
            Prêt à voir votre outil ? Voyons ça en 15 minutes.
          </h2>
          <p style={{ margin: "0 auto 28px", maxWidth: 480, font: "400 16px/1.6 'Hanken Grotesk',sans-serif", color: "rgba(255,255,255,.85)" }}>
            Une démo concrète, sur votre métier. Repartez avec une idée claire du ROI — sans engagement.
          </p>
          <a
            href="mailto:fawzi.baliouz@gmail.com" className="btn-glow"
            style={{ display: "inline-block", padding: "14px 28px", borderRadius: 11, background: "#0D0F1E", color: "#fff", font: "600 15px 'Space Grotesk',sans-serif", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}
          >
            Réserver une démo (15 min)
          </a>
        </div>
      </div>
    </section>
  );
}
