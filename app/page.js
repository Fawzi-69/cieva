import Hero3D from "@/components/Hero3D";
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
import Team from "@/components/Team";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="page">
      <Starfield count={90} seed={48271} />
      <Nav />
      <Reveal />
      <main>
        <Hero3D />
        <Vela />
        <Workflow />
        <Histoire />
        <Products />
        <Custom />
        <Demarche />
        <Proof />
        <Team />
        <Faq />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
