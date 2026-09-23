# Copilote — assistant de réunion temps réel

Écoute la conversation, affiche en direct **ce que vous avez à dire** et **ce
qui va arriver**. Tourne entièrement en local : un serveur Node sur votre
machine, et au choix une page de navigateur ou une fenêtre flottante exclue du
partage d'écran. Rien n'est hébergé, rien n'est enregistré sur disque.

```
interlocuteur ──▶ micro / audio du système
                        │
                        ▼
                  transcription          Web Speech API (navigateur, sans clé)
                        │                ou Deepgram (son d'un onglet / écran)
                        ▼
                  fenêtre des dernières minutes
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
   réponses (à la question)    suppositions (ce qui vient)
   Claude Opus 5, effort bas   en fond, rythme plus lent
```

## Démarrer

Deux façons de lancer, même moteur.

```bash
cd assistant
npm install
cp .env.example .env        # puis renseignez ANTHROPIC_API_KEY
```

**Dans le navigateur** — le plus simple, pour un second écran :

```bash
npm start                   # http://127.0.0.1:4321
```

Ouvrez la page dans **Chrome ou Edge** (la reconnaissance vocale du navigateur
n'existe pas ailleurs), renseignez le **Dossier** (touche `P`), cliquez
**Écouter**. `C` passe en compact : la transcription disparaît, il ne reste que
la réponse.

**En fenêtre flottante** — invisible dans un partage d'écran :

```bash
cd desktop && npm install && npm start
```

## La fenêtre flottante

La fenêtre se pose au-dessus de tout, sans cadre, sans icône dans le Dock ni
dans la barre des tâches, et **ne figure pas dans ce que voit l'autre** quand
vous partagez votre écran.

C'est `setContentProtection` d'Electron, qui pose `NSWindowSharingNone` sur
macOS et `WDA_EXCLUDEFROMCAPTURE` sur Windows — l'API que 1Password utilise
pour ses coffres et Keynote pour les notes du présentateur.

| Plateforme | Exclusion de capture |
|---|---|
| **macOS 14+** | oui. Best-effort à partir de macOS 15.4 selon la doc d'Apple |
| **Windows 10 2004+** | oui. Avant 2004, la fenêtre apparaît en rectangle noir |
| **Linux** | non — aucun équivalent X11/Wayland. Le badge de la barre l'indique |

Côté visio : Meet, Teams et QuickTime respectent le drapeau par défaut. **Zoom
demande d'activer « Advanced capture with window filtering »** dans ses
réglages pour l'honorer.

`COPILOT_NO_PROTECT=1 npm start` (ou `npm run start:visible`) rend la fenêtre
capturable à nouveau — pratique pour filmer une démo de l'outil.

### Raccourcis globaux

Ils répondent **sans que la fenêtre ait le focus** : vous restez dans Meet ou
Teams pendant que le copilote travaille.

| Raccourci | Effet |
|---|---|
| `Cmd/Ctrl + Shift + Espace` | répondre maintenant |
| `Cmd/Ctrl + Shift + D` | détailler |
| `Cmd/Ctrl + Shift + A` | rafraîchir les suppositions |
| `Cmd/Ctrl + Shift + H` | masquer / afficher la fenêtre |
| `Cmd/Ctrl + Shift + I` | mode traversant (la souris passe à travers) |
| `Cmd/Ctrl + Shift + O` | cycler l'opacité (100 / 85 / 65 %) |
| `Cmd/Ctrl + Shift + ↑↓←→` | déplacer la fenêtre par pas de 40 px |

Vérifier le câblage sans piloter l'interface : `COPILOT_SMOKE=1 npm start`
affiche une ligne `SMOKE {...}` avec l'état de la fenêtre puis quitte.

## Les deux lanes

**Réponses** — ce que vous dites maintenant. Déclenchées par une question
détectée, ou à la demande.

**Suppositions** — ce qui n'a pas encore été dit. Tournent en fond, se
rafraîchissent après ~45 mots nouveaux, et répondent à quatre questions :

```
CIBLE:    il compare déjà avec un concurrent moins cher.
SUITE:    il va demander une remise sur la première année.
SUITE:    il voudra parler au client transport en référence.
PREPARER: le détail du coût de reprise des données.
RISQUE:   laisser croire que les 2 semaines incluent la formation.
```

Le modèle est explicitement autorisé à **supposer à partir d'indices faibles** —
c'est l'intérêt de la lane — mais pas à fabriquer de fait absent du dossier :
une hypothèse doit se formuler comme une hypothèse. Les suppositions tournent
toujours à effort bas, même quand les réponses sont en mode détaillé, et une
supposition qui échoue laisse la précédente en place plutôt que de vider
l'écran.

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
| `A` | rafraîchir les suppositions |
| `C` | mode compact |
| `P` | ouvrir le dossier |
| `Échap` | couper l'écoute |

(Dans la fenêtre flottante, les mêmes actions passent par les raccourcis
globaux listés plus haut, qui marchent sans focus.)

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

## Ce qui vient d'ailleurs

Trois projets open source font le même genre d'overlay. La technique de
fenêtre vient d'eux ; aucun code n'a été copié.

| Projet | Licence | Ce qu'on en a repris |
|---|---|---|
| [OpenCluely](https://github.com/TechyCSR/OpenCluely) | MIT | le jeu de drapeaux de fenêtre, le mode traversant, le fait que Linux soit un no-op silencieux |
| [cue](https://github.com/Blueturboguy07/cue) | GPL-3.0 | les commutateurs Chromium `MacLoopbackAudioForScreenShare` / `MacSckSystemAudioLoopbackOverride` pour le son système macOS, et l'échappatoire `NO_PROTECT` |
| [Natively](https://github.com/Natively-AI-assistant/natively-cluely-ai-assistant) | source-available, non commerciale | le relevé des visios qui honorent le drapeau, et le cas Zoom |

Sur les licences : en **usage personnel**, les trois sont utilisables, y
compris cue — les obligations de la GPL se déclenchent à la redistribution,
pas à l'usage privé. Si ce copilote devait un jour être distribué ou servir en
prestation, il faudrait rouvrir la question : la GPL de cue contaminerait le
dépôt, et la licence de Natively interdit nommément le *client work* et
l'*agency work*.

Aucun n'a de lane « suppositions » : ils répondent, ils n'anticipent pas.

Pistes repérées et non retenues pour l'instant, sur la transcription :
[RealtimeSTT](https://github.com/KoljaB/RealtimeSTT) (MIT, 10,1k ★, serveur
WebSocket local, multi-moteurs) et [Kyutai
STT](https://huggingface.co/kyutai/stt-1b-en_fr) (CC-BY-4.0, streaming
français + anglais, 0,5 s de latence, VAD sémantique). À noter : **Moonshine,
le plus rapide en navigateur, n'a pas de modèle français** — seulement en,
es, ja, ar, uk, ko, zh, vi.

## Tests

```bash
npm run check   # syntaxe de tous les modules
npm test        # parsing des deux formats + détection de question
```

## Limites connues

- **Chrome/Edge uniquement** pour la source micro : Firefox et Safari n'ont pas
  la Web Speech API. La source « onglet / écran » ne dépend pas du navigateur.
- La reconnaissance micro de Chrome coupe d'elle-même après un long silence ;
  le copilote la relance, avec une perte de quelques centaines de millisecondes.
- Les segments de 4 s de la source « onglet » introduisent une micro-coupure
  entre deux segments : un mot à cheval sur la frontière peut manquer.
- L'exclusion de capture n'existe **pas sous Linux**, et le rectangle noir de
  Windows antérieur à la build 2004 est plus voyant que la fenêtre elle-même.
- Le micro capte aussi **votre** voix : elle entre dans la transcription au
  même titre que celle de l'interlocuteur. Séparer les deux canaux (mic =
  vous, son système = eux) reste à faire.
