import HeroScrub from "@/components/HeroScrub";
import Histoire from "@/components/Histoire";
import Reveal from "@/components/Reveal";
import Starfield from "@/components/Starfield";
import Nav from "@/components/Nav";
import Vela from "@/components/Vela";
import Workflow from "@/components/Workflow";
import Products from "@/components/Products";
import Custom from "@/components/Custom";
import Demarche from "@/components/Demarche";
import Proof from "@/components/Proof";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="page">
      <Starfield count={90} seed={48271} />
      <Nav />
      <Reveal />
      <main>
        <HeroScrub />
        <Vela />
        <Workflow />
        <Histoire />
        <Products />
        <Custom />
        <Demarche />
        <Proof />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
