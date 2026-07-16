import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Politique de confidentialité — Cieva",
  description: "Politique de confidentialité et protection des données personnelles du site Cieva.",
};

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" updated="juillet 2026">
      <p>
        La présente politique décrit la manière dont <strong>RITECH Services Informatiques</strong>{" "}
        (marque <strong>Cieva</strong>) traite vos données personnelles, conformément au Règlement
        général sur la protection des données (RGPD) et à la loi Informatique et Libertés.
      </p>

      <h2>Responsable de traitement</h2>
      <p>
        RITECH Services Informatiques — 813 634 979 R.C.S. Lyon, représentée par Fawzi Baliouz.
        Contact : <a href="mailto:fawzi.baliouz@gmail.com">fawzi.baliouz@gmail.com</a> ·{" "}
        <a href="tel:+33623928374">06 23 92 83 74</a>.
      </p>

      <h2>Données collectées</h2>
      <p>Nous collectons uniquement les données que vous nous transmettez volontairement lorsque vous nous contactez par email ou par téléphone :</p>
      <ul>
        <li>identité et coordonnées professionnelles (nom, fonction, entreprise, email, téléphone) ;</li>
        <li>contenu de votre demande (contexte métier, besoin exprimé).</li>
      </ul>
      <p>Le site ne comporte ni compte utilisateur, ni formulaire de collecte automatisée.</p>

      <h2>Finalités et bases légales</h2>
      <ul>
        <li><strong>Répondre à vos demandes</strong> (démo, devis, contact) — mesures précontractuelles ;</li>
        <li><strong>Suivi de la relation commerciale</strong> — intérêt légitime ;</li>
        <li><strong>Exécution des prestations</strong> — contrat.</li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>
        Les données des prospects sont conservées au maximum <strong>3 ans</strong> après le dernier
        contact. Les données liées à un contrat sont conservées pendant la durée de la relation
        contractuelle, puis archivées selon les durées légales applicables.
      </p>

      <h2>Destinataires et sous-traitants</h2>
      <p>
        Vos données ne sont ni vendues, ni louées, ni cédées. Elles sont accessibles uniquement à
        l'équipe de RITECH Services Informatiques et hébergées auprès de nos sous-traitants
        techniques (Google Firebase, Amazon Web Services), dans le cadre d'accords conformes au
        RGPD (clauses contractuelles types le cas échéant).
      </p>

      <h2>Cookies</h2>
      <p>
        Ce site ne dépose <strong>aucun cookie de suivi ou de publicité</strong>. Seules les polices
        de caractères sont chargées depuis Google Fonts.
        {/* TODO: mettre à jour cette section si un outil d'analytics est ajouté */}
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement,
        d'opposition, de limitation et de portabilité sur vos données. Pour l'exercer, écrivez-nous
        à <a href="mailto:fawzi.baliouz@gmail.com">fawzi.baliouz@gmail.com</a>. Vous pouvez également
        introduire une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
      </p>

      <h2>Mentions légales</h2>
      <p>
        Voir la page <Link href="/mentions-legales">Mentions légales</Link>.
      </p>
    </LegalPage>
  );
}
