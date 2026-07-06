# Cieva — Site vitrine

Landing page de **Cieva**, agence d'applications métier sur-mesure pour les PME.
Narration : « Ce n'est pas un logiciel générique. C'est le vôtre. » Une **constellation de
produits** — **Sielo** (transport & logistique), **Vela** (interventions techniques),
**Lyra** (assistant vocal) — sur une base éprouvée, personnalisée en deux semaines.

## Stack

- **Next.js 15** (App Router, export statique)
- **Space Grotesk** + **Hanken Grotesk** (Google Fonts)

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

Build statique (dossier `out/`) :

```bash
npm run build
```

Pour un déploiement sous un sous-chemin (ex. GitHub Pages), définir `BASE_PATH` :

```bash
BASE_PATH=/cieva npm run build
```

## Structure

```
app/
  layout.js        # fonts, SEO, themeColor, <html lang="fr">
  page.js          # assemble hero + sections
  globals.css      # tokens + keyframes (thème Constellation)
components/
  HeroScrub.jsx    # hero : séquence d'images scrubbée au scroll (canvas sticky)
  Nav · Vela · Workflow · Products · Custom · Demarche · Proof · Faq · Cta · Footer
  Logo · Starfield
public/
  hero-frames/     # 72 frames webp de la séquence du hero
  hero-last.png    # dernière frame, fond du raccord vers la suite de la page
```

## Hero

La transition « paperasse en désordre → interface propre » est une séquence de 72 images
pilotée par la position de scroll : un canvas plein écran, épinglé (`position: sticky`),
dessine la frame correspondant à la progression. Le titre et les CTA restent en HTML
par-dessus. À 100 %, le canvas se fond (250 ms) sur `hero-last.png` posé dessous, et la
page continue sur un fond continu. `prefers-reduced-motion` affiche l'image finale statique.

Note CSS : `.page` doit rester en `overflow-x: clip` — un `overflow: hidden` casserait le
`position: sticky` du hero et de la nav.

## Design

Esthétique **« Constellation »** : fond navy étoilé, dégradés bleu (`#009FE3`) → violet
(`#7C5CFF`), verre sombre, animations au scroll. Détails dans `design-system/MASTER.md`.
