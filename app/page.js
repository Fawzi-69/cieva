import HeroScrub from "@/components/HeroScrub";
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
      <main>
        <HeroScrub />
        <Vela />
        <Workflow />
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
