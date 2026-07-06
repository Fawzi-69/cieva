# Cieva — Design System (MASTER)

Direction validée : **« Constellation »** — dark premium, fond étoilé navy, dégradés
bleu→violet, narration sur-mesure. La maquette source (`Cieva.dc.html`) est maintenue
hors-repo ; ce fichier en est le résumé fidèle au code.

> Remplace l'ancienne piste « Studio clair » (light editorial), abandonnée.

## Concept

Cieva = **agence d'applications métier sur-mesure pour PME**. Le récit : « Ce n'est pas un
logiciel générique. C'est le vôtre. » Une **constellation de produits** (Sielo, Vela, Lyra)
posés sur une base éprouvée, puis personnalisés. Esthétique : ciel de nuit, étoiles qui
scintillent, halos bleus/violets, cartes en verre sombre.

## Couleurs

| Rôle | Valeur |
|---|---|
| Fond | `#0B1430` → `#0F1B3D` (dégradé) + halos `rgba(60,90,200,.28)` / `rgba(124,92,255,.14)` |
| Texte | `#F4F7FF` (titres) · `#EAF0FF` · `#A3B2D4` (corps) · `#85A8E6` (kicker) · `#6E7EA3` (méta) |
| Accent CTA | dégradé `135deg #3D74FF → #7C5CFF` |
| Produit Sielo (transport) | `#009FE3` |
| Produit Vela (interventions) | `#7C5CFF` |
| Produit Lyra (assistant vocal) | `#12A594` |
| Dégradé titres | `120deg #6FA8FF → #A98CFF` (animé `sd-shine`) |

## Typographie (Google Fonts)

- **Space Grotesk** — titres, kickers, boutons, noms produits
- **Hanken Grotesk** — corps, descriptions

## Effets

- **Starfield** déterministe (LCG seedé, 110 étoiles) — scintillement `sd-tw`.
- **Constellation** hero : 3 nœuds reliés par lignes pointillées animées (`sd-dash`),
  paquets de données qui circulent (`sd-pktSV/VL/LS`), halos pulsés (`sd-pulse`),
  Lyra avec barres d'écoute (`sd-listen`).
- CTA en pilule dégradée, ombre bleue, **respiration** (`sd-breathe`).
- Cartes produit : glow d'angle + bordure qui s'éclaire au survol.
- Reveal au chargement (`sd-reveal`, transform-only → contenu toujours visible).

## Structure de page

Header (sticky, blur) → Hero (texte + constellation) → Problème (3 cartes) →
Produits (Sielo/Vela/Lyra) → Sur-mesure (3 cartes) → Preuve/ROI (17→30 camions, témoignage) →
Démarche (3 étapes) → CTA final → Footer.

## Checklist

- [x] Fidèle à `Cieva.dc.html` (variante hero B par défaut).
- [x] Responsive : ≤860px → nav repliée (logo + CTA), grilles en 1 colonne.
- [x] `prefers-reduced-motion` neutralise les animations.
- [x] Starfield déterministe (pas de mismatch SSR/CSR).
- [x] `<html lang="fr">`, metadata SEO, `themeColor #0B1430`, domaine `cieva.fr`.
