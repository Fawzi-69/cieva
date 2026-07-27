import Hero3D from "@/components/Hero3D";
import StatsBand from "@/components/StatsBand";
import Histoire from "@/components/Histoire";
import Reveal from "@/components/Reveal";
import Starfield from "@/components/Starfield";
import Nav from "@/components/Nav";
import Products from "@/components/Products";
import Demarche from "@/components/Demarche";
import Proof from "@/components/Proof";
import Team from "@/components/Team";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

/* Plan 1 « Resserrer » (+ audit) — ~7 écrans compacts :
   1. Hero 3D + chiffres & références (StatsBand)
   2. Produits (constellation + 4e étoile)
   3. Sur-mesure (fusion Histoire + personnalisation)
   4. Démarche compacte (la promesse « 2 semaines » expliquée)
   5. Preuve (vedette + carrousel d'avis)
   6. 10 ans + équipe, puis FAQ (objections)
   7. CTA + contact fusionnés
   Les anciennes sections Vela/Workflow/Custom/Contact restent dans
   components/ (réutilisables pour les pages du Plan 3). */

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
        <Demarche />
        <Proof />
        <Team />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
