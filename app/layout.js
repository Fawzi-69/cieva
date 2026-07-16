import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://cieva.fr"),
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
  openGraph: {
    title: "Cieva — Applications métier sur-mesure",
    description:
      "Une constellation de produits — Sielo, Vela, Lyra. Votre marque, vos données, vos règles. Livré en deux semaines.",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Cieva — Votre métier, en pilote automatique" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cieva — Applications métier sur-mesure",
    description: "Applications métier à votre marque, livrées en deux semaines — avec un ROI mesurable.",
    images: ["/og.png"],
  },
};

export const viewport = {
  themeColor: "#05060E",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
