import Hero3D from "@/components/Hero3D";
import StatsBand from "@/components/StatsBand";
import Histoire from "@/components/Histoire";
import Reveal from "@/components/Reveal";
import Starfield from "@/components/Starfield";
import Nav from "@/components/Nav";
import Products from "@/components/Products";
import Proof from "@/components/Proof";
import Team from "@/components/Team";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

/* Plan 1 « Resserrer » — ~6 écrans :
   1. Hero 3D + chiffres & références (StatsBand)
   2. Produits (constellation + 4e étoile)
   3. Sur-mesure (fusion Histoire + personnalisation)
   4. Preuve (vedette + carrousel d'avis)
   5. 10 ans + équipe
   6. CTA + contact fusionnés
   Les anciennes sections Vela/Workflow/Custom/Demarche/Faq/Contact
   restent dans components/ (réutilisables pour les pages du Plan 3). */

export default function Home() {
  return (
    <div className="page">
      <Starfield count={90} seed={48271} />
      <Nav />
      <Reveal />
      <main>
        <Hero3D />
        <StatsBand />
        <Products />
        <Histoire />
        <Proof />
        <Team />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
