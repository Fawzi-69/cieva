# Cieva — Site vitrine

Landing page de **Cieva** (marque de **RITECH Services Informatiques**), agence IA :
applications métier sur-mesure pour les PME. Une constellation de produits —
**Sielo** (transport & logistique), **Vela** (interventions & trésorerie),
**Lyra** (assistant vocal) — sur une base éprouvée, personnalisée en deux semaines.

**Production : https://fawzi-69.github.io/cieva/** — déployée automatiquement à
chaque push sur `main` (`.github/workflows/deploy-pages.yml` → branche `gh-pages`).

## Stack

- **Next.js 15** (App Router, export statique, `BASE_PATH=/cieva` en CI)
- **Space Grotesk** + **Hanken Grotesk** (Google Fonts)
- three.js via react-three-fiber (hero 3D uniquement)

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # export statique dans out/ (BASE_PATH=/cieva pour Pages)
```

## Structure (Plan 1 « Resserrer »)

```
app/
  layout.js            # SEO, OG/Twitter, JSON-LD Organization, fonts
  page.js              # Hero3D → StatsBand → Products → Histoire → Demarche
                       #   → Proof (+ AvisRail) → Team → Faq → Cta → Footer
  not-found.js         # 404 stylée
  mentions-legales/ · confidentialite/   # pages légales (LegalPage)
components/
  Hero3D(+Scene)       # hero interactif three.js
  StatsBand            # chiffres agence + références, sous le hero
  Histoire             # fusion « pourquoi maintenant » + sur-mesure
  Demarche             # méthode « 2 semaines » compacte
  Proof / AvisRail     # témoignage vedette + carrousel d'avis (verbatims exacts)
  Team                 # frise 10 ans + équipe
  Faq · Cta · Footer · Nav (burger mobile) · Logo · Starfield · Reveal
  Vela · Workflow · Custom · Contact   # hors flux — réservés aux pages du Plan 3
public/
  og.png · robots.txt · sitemap.xml · products/*.webp
```

## ⚠️ Contenus à fournir (TODO marqués dans le code)

| Contenu | Où l'intégrer |
|---|---|
| Domaine cieva.fr + CNAME Pages | `app/layout.js` (`SITE_ORIGIN`), `public/robots.txt`, `public/sitemap.xml`, footer |
| Email pro @cieva.fr | `Cta.jsx`, `Footer.jsx`, pages légales |
| Adresse du siège social | `app/mentions-legales/page.js` (obligation LCEN) |
| Logos clients officiels (SVG) | `StatsBand.jsx` (`LOGOS`) |
| Photos équipe + LinkedIn | `Team.jsx` (`MEMBERS`) |
| Photos clients cités (avec accord) | `AvisRail.jsx`, `Proof.jsx` |
| Compte Cal.com / Formspree | `Cta.jsx` (remplacer les `mailto:`) |
| Captures produits réelles | `Products.jsx` (Plan 2 : études de cas) |

## Design

Esthétique **« Constellation »** : fond navy étoilé, dégradés bleu (`#009FE3`) →
violet (`#7C5CFF`), verre sombre, reveals au scroll, carrousel d'avis en
défilement continu (pause au survol/focus/bouton). Détails : `design-system/MASTER.md`.

Note CSS : `.page` doit rester en `overflow-x: clip` — un `overflow: hidden`
casserait le `position: sticky` de la nav.
