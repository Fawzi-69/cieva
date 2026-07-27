import "./globals.css";

// TODO: passer SITE_ORIGIN à "https://cieva.fr" (et vider BASE) une fois le
// domaine acheté et branché sur GitHub Pages — un seul endroit à changer.
const SITE_ORIGIN = "https://fawzi-69.github.io";
const BASE = process.env.BASE_PATH || "";
const SITE_URL = `${SITE_ORIGIN}${BASE}`;

export const metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: "Cieva — Votre métier en pilote automatique",
  description:
    "Cieva conçoit des applications métier sur-mesure pour les PME. Votre marque, vos données, vos règles — livré en deux semaines, avec un ROI chiffrable.",
  keywords: [
    "application métier",
    "logiciel sur-mesure",
    "PME",
    "automatisation",
    "dispatch logistique",
    "field service",
    "assistant vocal",
  ],
  alternates: {
    canonical: `${BASE}/`,
  },
  openGraph: {
    title: "Cieva — Applications métier sur-mesure",
    description:
      "Une constellation de produits — Sielo, Vela, Lyra. Votre marque, vos données, vos règles. Livré en deux semaines.",
    locale: "fr_FR",
    type: "website",
    url: `${BASE}/`,
    images: [{ url: `${BASE}/og.png`, width: 1200, height: 630, alt: "Cieva — Votre métier, en pilote automatique" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cieva — Applications métier sur-mesure",
    description: "Applications métier à votre marque, livrées en deux semaines — avec un ROI mesurable.",
    images: [`${BASE}/og.png`],
  },
};

export const viewport = {
  themeColor: "#05060E",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cieva",
  legalName: "RITECH Services Informatiques",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/og.png`,
  foundingDate: "2018",
  founder: { "@type": "Person", name: "Fawzi Baliouz" },
  email: "fawzi.baliouz@gmail.com",
  telephone: "+33623928374",
  areaServed: ["FR", "CH", "BE", "CA"],
  sameAs: ["https://github.com/Fawzi-69"],
  description:
    "Agence IA — applications métier sur-mesure pour les PME : Sielo (transport & logistique), Vela (interventions & trésorerie), Lyra (assistant vocal).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Hanken+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
