import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export const metadata = { title: "Page introuvable — Cieva" };

export default function NotFound() {
  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center", padding: 32 }}>
      <LogoMark size={44} />
      <div className="grad" style={{ font: "700 clamp(72px,14vw,140px)/1 'Space Grotesk',sans-serif", letterSpacing: "-.04em", margin: "26px 0 8px" }}>
        404
      </div>
      <h1 style={{ margin: "0 0 10px", font: "600 clamp(20px,3vw,28px) 'Space Grotesk',sans-serif", color: "#F2F4FF" }}>
        Cette étoile n'existe pas.
      </h1>
      <p style={{ margin: "0 0 28px", maxWidth: 420, font: "400 15px/1.6 'Hanken Grotesk',sans-serif", color: "#9AA2C4" }}>
        La page que vous cherchez a peut-être été déplacée — ou n'a jamais fait partie de la constellation.
      </p>
      <Link
        href="/"
        style={{ padding: "13px 26px", borderRadius: 11, background: "linear-gradient(135deg,#7B5CFF,#4FA8FF)", color: "#fff", font: "600 14.5px 'Space Grotesk',sans-serif", boxShadow: "0 8px 24px rgba(110,92,255,.4)" }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
