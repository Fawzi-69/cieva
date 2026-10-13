# Cieva — Portfolio (version Blanc)

Deck autonome de 14 slides en 1920 × 1080, construit à partir de `project/Cieva Portfolio Blanc.dc.html`. Il n'a besoin ni de build ni du runtime Claude Design.

- `index.html` : les slides. Le texte, les prix et les notes de l'orateur sont repris mot pour mot.
- `deck.css` : les couleurs et les styles.
- `deck.js` : la mise à l'échelle et la navigation.
- `Cieva-Portfolio.pdf` : l'export, une page par slide (1,5 Mo).
- `fonts/` : Space Grotesk et Hanken Grotesk en fichiers statiques (licence OFL). Le deck fonctionne hors ligne, et le PDF garde un texte sélectionnable.

## Utilisation

Ouvrez `index.html` dans un navigateur.

| Touche | Action |
|---|---|
| → / Espace / PgDn | slide suivante |
| ← / PgUp | slide précédente |
| 1 à 9, Début / Fin | aller à une slide |
| N | afficher les notes de l'orateur |
| F | plein écran |

Un clic sur le tiers gauche de l'écran recule d'une slide, ailleurs il avance. L'adresse `#7` ouvre directement la slide 7.

Pour obtenir un PDF : Imprimer → Enregistrer en PDF. L'impression produit une page par slide au format 1920 × 1080.

## Visuel : ce qui change par rapport à la maquette

- **Rythme** : la 4 (pourquoi maintenant), la 12 (garanties) et la 14 (contact) sont sur fond noir chaud ; la 5 (chiffres) est en dégradé orange → pêche avec les chiffres en noir. La 10, la 11 et la 13 ont un fond crème.
- **Slide 4** : cartes sombres avec un fin contour, reliées par des flèches (grise, puis orange) ; la dernière carte a un contour orange lumineux.
- **Slide 10** : petites icônes au trait pour la pointeuse, l'extraction comptable et le suivi des camions, regroupées dans un panneau beige ; bandeau en pilule noire avec le texte en orange.
- **Slide 11** : cartes claires avec les numéros 01 et 03 en contour orange ; la carte du milieu est sombre avec un halo orange, le « 02 » en dégradé et le badge « 2 semaines » à l'intérieur.
- **Slide 12** : une icône au trait devant chaque garantie ; deux cartes avec un contour orange.
- **Slide 13** : badge « Offre rentrée » noir, étiquette « offerts » pêche, mensualités alignées sur une ligne, case « Économie » noire avec le montant en orange, conditions en texte simple sous les cartes.
- **Dégradés** : le coin orange en haut à droite et le gris en bas à gauche sont plus marqués.
- **Cartes allégées** : les valeurs, les avantages et les chiffres produits sont présentés en colonnes avec un filet orange au lieu de cartes.
- **Mockups** : un seul cadre de téléphone, plus grand, pour les quatre produits, sans carré derrière. Autour, un halo orange et des arcs de particules inspirés du C du logo (`img/particles.svg`), qui oscillent lentement à l'écran.
- **Étiquettes** : les petits points orange lumineux deviennent des étiquettes arrondies (« 2015 », « Transport & logistique »…).
- **Titres** : un mot-clé passe en orange (« de père en fils », « vos outils », « n'est plus un luxe », « ensemble »).
- **Animations** : le contenu apparaît en léger fondu à chaque slide. Elles sont désactivées si l'utilisateur réduit les animations dans son système, et à l'impression.

L'image Vela est celle déposée dans la maquette (`.image-slots.state.json`), pas `vela-mobile.png`.

À l'impression, les ombres floues et les dégradés des cartes arrondies sont remplacés par des aplats : Chrome les convertit en images, ce qui triplait le poids du PDF.
