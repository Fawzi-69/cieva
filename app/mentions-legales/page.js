import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Mentions légales — Cieva",
  description: "Mentions légales du site Cieva, une marque de RITECH Services Informatiques.",
};

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated="juillet 2026">
      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>cieva.fr</strong> est édité par <strong>RITECH Services Informatiques</strong>,
        immatriculée sous le numéro <strong>813 634 979 R.C.S. Lyon</strong>.
        {/* TODO: compléter l'adresse du siège social */}
      </p>
      <p><strong>Cieva</strong> est une marque commerciale de RITECH Services Informatiques.</p>

      <h2>Directeur de la publication</h2>
      <p>Fawzi Baliouz, gérant.</p>

      <h2>Contact</h2>
      <ul>
        <li>Email : <a href="mailto:fawzi.baliouz@gmail.com">fawzi.baliouz@gmail.com</a></li>
        <li>Téléphone : <a href="tel:+33623928374">06 23 92 83 74</a></li>
      </ul>

      <h2>Hébergement</h2>
      <p>Le site est hébergé sur une infrastructure cloud managée :</p>
      <ul>
        <li><strong>Firebase Hosting</strong> — Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irlande.</li>
        <li><strong>Amazon Web Services</strong> — AWS EMEA SARL, 38 avenue John F. Kennedy, L-1855 Luxembourg.</li>
      </ul>

      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus de ce site (textes, visuels, logos, marques Cieva, Sielo, Vela, Lyra,
        éléments graphiques et logiciels) est protégé par le droit de la propriété intellectuelle et
        demeure la propriété exclusive de RITECH Services Informatiques ou de ses partenaires. Toute
        reproduction, représentation ou exploitation, totale ou partielle, sans autorisation écrite
        préalable est interdite.
      </p>
      <p>
        Les marques et logos de tiers cités sur ce site (références clients et partenaires) demeurent
        la propriété de leurs titulaires respectifs et sont mentionnés au titre de références
        commerciales, avec leur accord.
      </p>

      <h2>Responsabilité</h2>
      <p>
        RITECH Services Informatiques s'efforce d'assurer l'exactitude et la mise à jour des
        informations diffusées sur ce site, dont elle se réserve le droit de modifier le contenu à
        tout moment et sans préavis. Elle ne saurait être tenue responsable des dommages directs ou
        indirects résultant de l'accès ou de l'usage du site.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Les modalités de traitement de vos données personnelles sont détaillées dans notre{" "}
        <Link href="/confidentialite">politique de confidentialité</Link>.
      </p>
    </LegalPage>
  );
}
