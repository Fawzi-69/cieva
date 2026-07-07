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
```

## Hero 3D interactif

Le hero (`Hero3D.jsx` + `Hero3DScene.jsx`, three.js via react-three-fiber) : un téléphone
au centre, 7 objets métier en orbite (emails, dossiers, factures, en géométrie simple).
Le drag horizontal fait tourner l'ensemble (inertie + ressort de retour face caméra) ;
la rotation cumulée aspire les objets un par un dans le téléphone. Une fois tout absorbé
et le téléphone revenu de face, une **UI générique dessinée en HTML/CSS** (sidebar, KPI,
courbe, listes — aucun texte réel) s'allume sur l'écran, élément par élément. Elle n'est
jamais visible pendant la rotation. Pas de détournement de scroll : la page défile
normalement. Le titre et les CTA restent en HTML par-dessus.

Points durs à connaître :
- Le téléphone est **procédural** (RoundedBox : châssis métal, verre avant/arrière, îlot
  caméra, boutons) — géométrie fermée par construction. L'ancien `phone.glb` était un mesh
  ouvert non soudé (rendu creux) et a été abandonné.
- `side: FrontSide` partout, rendu volumique via **RoomEnvironment** (PMREM procédural,
  aucun asset externe) + key light et rim light froide.
- Le verre avant est en `meshPhysicalMaterial` avec `specularIntensity` bas — sinon le
  lobe spéculaire de la key light blanchit tout l'écran.
- Le rect écran (pour poser l'UI HTML) est projeté depuis les dimensions connues du
  téléphone (`SCREEN_W/H`), caméra fixe.

Note CSS : `.page` doit rester en `overflow-x: clip` — un `overflow: hidden` casserait le
`position: sticky` de la nav.

## Design

Esthétique **« Constellation »** : fond navy étoilé, dégradés bleu (`#009FE3`) → violet
(`#7C5CFF`), verre sombre, animations au scroll. Détails dans `design-system/MASTER.md`.
