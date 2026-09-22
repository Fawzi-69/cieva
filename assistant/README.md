# Copilote — assistant de réunion temps réel

Écoute la conversation, affiche en direct **ce que vous avez à dire**. Tourne
entièrement en local : un petit serveur Node sur votre machine, une page dans
votre navigateur. Rien n'est hébergé, rien n'est enregistré sur disque.

```
interlocuteur ──▶ micro / audio de l'onglet
                        │
                        ▼
                  transcription          Web Speech API (navigateur, sans clé)
                        │                ou Deepgram (son d'un onglet / écran)
                        ▼
                  fenêtre des dernières minutes
                        │
                        ▼
                  Claude Opus 5 en streaming  ──▶  réponse à dire + arguments
```

## Démarrer

```bash
cd assistant
npm install
cp .env.example .env        # puis renseignez ANTHROPIC_API_KEY
npm start                   # http://127.0.0.1:4321
```

Ouvrez la page dans **Chrome ou Edge** (la reconnaissance vocale du navigateur
n'existe pas ailleurs), renseignez le **Dossier** (touche `P`), cliquez
**Écouter**.

Placez la fenêtre sur un second écran et passez en **Compact** (`C`) : la
transcription disparaît, il ne reste que la réponse, dans une fenêtre étroite.

## Les deux sources audio

| Source | Ce qu'elle capte | Prérequis |
|---|---|---|
| **Micro** | ce que le micro entend : votre interlocuteur en face de vous, ou la visio si vos haut-parleurs sont ouverts | rien — Web Speech API de Chrome/Edge |
| **Onglet / écran** | le son d'un onglet (Meet, Teams, Zoom web) même au casque | `DEEPGRAM_API_KEY` dans `.env` |

Pour la seconde, le navigateur demande quoi partager : choisissez un **onglet**
et cochez **« Partager l'audio de l'onglet »**. Sans piste audio, le copilote
vous le dit au lieu d'écouter dans le vide. L'audio part par segments de 4 s
chez Deepgram, revient en texte, et n'est pas conservé.

## Les trois contextes

- **Réunion / client** — traite l'objection posée, ancre sur un fait du dossier,
  pousse vers la prochaine étape. Marque les engagements `ACTION :`.
- **Discussion technique** — revue d'archi, pairing, point produit : la réponse
  juste, le compromis assumé, le coût réel.
- **Entretien : entraînement** — mode coach pour s'exercer ou débriefer un
  entretien : l'angle d'attaque, les points de fond dans l'ordre, et ce que la
  question cherche vraiment à évaluer. Pas un souffleur pour un entretien réel.

## Le Dossier

C'est la **seule source de faits** que le copilote est autorisé à citer :
produits, chiffres, références, votre parcours. Hors de ce cadre il dit
explicitement qu'il ne sait pas, plutôt que d'inventer un chiffre que vous
répéteriez à voix haute. Stocké dans le `localStorage` du navigateur, jamais
envoyé ailleurs que dans l'appel à l'API.

## Format de réponse

Pensé pour être lu en une seconde, du coin de l'œil :

```
Deux semaines, sur une base déjà éprouvée.
- La base métier existe : on personnalise, on ne repart pas de zéro.
- Un client transport est passé de 17 à 30 camions avec Sielo.
! Le délai suppose les accès aux données en J+1.
```

Deux sorties particulières : `? …` quand la transcription est trop ambiguë
(c'est alors la clarification à demander), et `-` quand ce qui vient d'être dit
n'appelle aucune réponse.

## Déclenchement

En **Auto** (par défaut) : une question détectée part presque aussitôt
(250 ms), le reste attend un vrai silence — 1,1 s par défaut, réglable — et au
moins huit mots nouveaux. Une nouvelle sollicitation annule la précédente,
côté serveur aussi : l'appel abandonné n'est pas payé jusqu'au bout.

| Touche | Effet |
|---|---|
| `Espace` | répondre maintenant |
| `D` | détailler (effort `high`, jusqu'à 6 puces) |
| `C` | mode compact |
| `P` | ouvrir le dossier |
| `Échap` | couper l'écoute |

## Réglages (`.env`)

| Variable | Défaut | Rôle |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | obligatoire pour les suggestions |
| `COPILOT_MODEL` | `claude-opus-5` | modèle |
| `COPILOT_FAST` | `0` | `1` = mode rapide Opus 5, ~2,5× plus de tokens/s, tarif premium |
| `DEEPGRAM_API_KEY` | — | active la source « onglet / écran » |
| `PORT` / `HOST` | `4321` / `127.0.0.1` | `127.0.0.1` = accessible depuis cette machine seulement |

Le serveur garde la clé API de son côté : la page du navigateur ne la voit
jamais. Ne changez `HOST` pour `0.0.0.0` que si vous savez qui est sur le
réseau — cela ouvre le proxy API à toute la machine voisine.

### Latence et coût

Les suggestions courtes tournent à effort `low` avec `max_tokens` serré ;
`D` repasse à `high`. Le préfixe stable (instructions + contexte + dossier)
est marqué cacheable, donc les appels d'une même session ne le repaient pas —
la barre affiche `cache ✓` quand la lecture de cache a eu lieu. Les replis
serveur sont activés (`fallbacks: "default"`) : si un appel est décliné, l'API
le rejoue sur un modèle de repli au lieu de vous laisser sans réponse.

## Tests

```bash
npm run check   # syntaxe de tous les modules
npm test        # parsing du format de réponse + détection de question
```

## Limites connues

- **Chrome/Edge uniquement** pour la source micro : Firefox et Safari n'ont pas
  la Web Speech API. La source « onglet / écran » ne dépend pas du navigateur.
- La reconnaissance micro de Chrome coupe d'elle-même après un long silence ;
  le copilote la relance, avec une perte de quelques centaines de millisecondes.
- Les segments de 4 s de la source « onglet » introduisent une micro-coupure
  entre deux segments : un mot à cheval sur la frontière peut manquer.
- Le copilote n'est pas conçu pour dissimuler sa présence à un examinateur :
  ni exclusion du partage d'écran, ni contournement de surveillance d'examen.
  Le mode entretien est un mode d'entraînement et de débrief.
