# Copilote — assistant de réunion temps réel

Écoute la conversation, affiche en direct **ce que vous avez à dire** et **ce
qui va arriver**. Tourne entièrement en local : un serveur Node sur votre
machine, et au choix une page de navigateur ou une fenêtre flottante exclue du
partage d'écran. Rien n'est hébergé, rien n'est enregistré sur disque.

```
  EUX  son du système ─┐                    ┌─▶ EUX : Votre solution coûte combien ?
                       ├─▶ transcription ───┤
 VOUS  micro choisi ───┘   streaming, 16 kHz └─▶ VOUS : Deux semaines sur base éprouvée.
                                │
                        fenêtre des dernières minutes, étiquetée
                                │
                  ┌─────────────┴─────────────┐
                  ▼                           ▼
           réponses (à EUX)          suppositions (ce qui vient)
           Claude Opus 5             en fond, rythme plus lent
```

## Installer l'app

Plus de terminal ni de `npm` : un installeur par plateforme.

### Récupérer l'installeur

Les installeurs sont fabriqués par GitHub Actions (workflow
`.github/workflows/copilote.yml`) à chaque modification de `assistant/` :

1. Onglet **Actions** du dépôt → **Copilote — installeurs** → la dernière
   exécution verte.
2. En bas, section **Artifacts** : `Copilote-win`. C'est un `.zip` qui
   contient `Copilote-<version>-installation.exe` (Windows 10 / 11).

**macOS** : la CI ne construit plus le `.dmg` (les runners macOS ne prenaient
pas la tâche). La configuration est restée en place : sur un Mac,
`cd assistant && npm install && npm run dist:mac` produit les `.dmg` Apple
Silicon et Intel dans `assistant/dist/`.

Pour une version durable plutôt qu'un artefact gardé 30 jours, poussez un tag :
`git tag copilote-v0.2.0 && git push origin copilote-v0.2.0`. Une **Release**
GitHub est alors publiée avec l'installeur.

> Le dépôt est public : artefacts et Releases sont téléchargeables par
> d'autres. Ils ne contiennent aucune clé — elles se saisissent dans l'app et
> restent sur votre machine.

### Première ouverture : l'app n'est pas signée

Signer auprès d'Apple demande un compte développeur payant (99 $/an), et
auprès de Microsoft un certificat. Sans eux, chaque système bloque une fois.

**macOS** — glissez Copilote dans Applications, ouvrez-le : macOS refuse.
Allez dans **Réglages Système → Confidentialité et sécurité**, tout en bas :
« Copilote a été bloqué » → **Ouvrir quand même**. Une seule fois.

Si macOS dit que l'app est « endommagée » (fichier en quarantaine après
téléchargement), dans le Terminal :

```bash
xattr -dr com.apple.quarantine /Applications/Copilote.app
```

**Windows** — SmartScreen affiche « Windows a protégé votre ordinateur » :
**Informations complémentaires** → **Exécuter quand même**.

### Autorisations macOS

- **Micro** : demandé au premier lancement.
- **Son de la visio** (canal Eux) : passe par l'enregistrement d'écran.
  Réglages Système → Confidentialité et sécurité → **Enregistrement de l'écran
  et audio système** → cochez Copilote, puis relancez l'app.

Sur une app non signée, macOS peut redemander ces autorisations après chaque
mise à jour : il voit chaque version comme une app différente.

### Premier lancement

L'app s'installe dans la **barre de menus** (macOS) ou la **zone de
notification** (Windows) : pas d'icône dans le Dock ni la barre des tâches.
L'écran **Réglages** s'ouvre de lui-même : collez votre clé Anthropic et votre
clé Deepgram. **Dans l'app, les deux sont nécessaires** : Electron n'embarque
pas la reconnaissance vocale de Chrome, donc sans Deepgram l'app n'entend rien.
Le repli sans clé n'existe que dans le navigateur (`npm start`).

Les clés sont chiffrées par le trousseau du système (Trousseau macOS, DPAPI
Windows) et la fenêtre n'en affiche jamais que les quatre derniers caractères.

Menu de l'icône : afficher / masquer la fenêtre, Réglages, **Hors capture
d'écran** (à cocher ou décocher à chaud), **Lancer à l'ouverture de session**,
Quitter. Fermer la fenêtre ne quitte pas l'app : on la quitte par ce menu.

## Lancer depuis le code

Pour développer, ou si vous préférez le navigateur :

```bash
cd assistant
npm install
cp .env.example .env        # puis renseignez ANTHROPIC_API_KEY
npm start                   # dans le navigateur : http://127.0.0.1:4321
npm run desktop             # en fenêtre flottante, comme l'app installée
npm run dist                # fabrique l'installeur de la plateforme courante
```

Dans le navigateur, ouvrez la page dans **Chrome ou Edge**, renseignez le
**Dossier** (touche `P`), cliquez **Écouter**. `C` passe en compact.

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

Pour filmer une démo de l'outil, décochez **Hors capture d'écran** dans le menu
de l'icône : la fenêtre redevient capturable, sans redémarrer.

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

Vérifier le câblage sans piloter l'interface : `COPILOT_SMOKE=1 npm run
desktop` affiche une ligne `SMOKE {...}` avec l'état de la fenêtre puis quitte.

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

## Les deux voix

Touche `S`, ou le bouton **Son** : le panneau audio se déplie.

| Canal | Ce qu'il capte | Réglage |
|---|---|---|
| **Eux** | le son du système ou de l'onglet partagé — la visio, même au casque | partage d'écran, à autoriser une fois |
| **Vous** | votre micro, **celui que vous choisissez** dans la liste | sélecteur d'appareil |

Chaque canal a son propre flux, sa propre transcription et son vu-mètre. Le
modèle reçoit une transcription étiquetée :

```
EUX : Votre solution coûte combien exactement ?
VOUS : Deux semaines, sur une base déjà éprouvée.
EUX : Et la reprise des données ?
```

Ce que ça change concrètement : le copilote **ne répond plus à vous-même**, il
ne vous fait pas répéter ce que vous venez de dire, et si l'interlocuteur
revient sur un point déjà traité il change d'angle au lieu de resservir la
même phrase. À l'écran, ce que vous avez dit s'efface en gris : l'œil va à
l'autre voix.

Pour le canal **Eux**, le navigateur demande quoi partager : choisissez un
**onglet** et cochez **« Partager l'audio de l'onglet »**. Sans piste audio, le
copilote vous le dit au lieu d'écouter dans le vide. (Dans la fenêtre
flottante, Electron fournit directement le son du système, sans sélecteur.)

### Brancher un appareil en cours de route

Le panneau écoute l'événement `devicechange` : casque branché ou débranché, la
liste se met à jour toute seule et la barre le signale. Le bouton **Rechercher
les appareils** force un rafraîchissement. Changer de micro pendant que le
canal tourne le relance sur le nouvel appareil sans toucher au canal **Eux**.

Deux limites à connaître : les libellés des micros restent anonymes tant que
l'autorisation micro n'a pas été accordée une première fois, et changer la
**langue** en cours de route relance le canal Vous automatiquement, mais
demande de réactiver Eux à la main — le relancer redemanderait l'autorisation
de partage.

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

## Réglages du lancement depuis le code (`.env`)

Dans l'app installée, tout passe par l'écran **Réglages** : ce fichier ne sert
que pour `npm start` et `npm run desktop`. Si les deux existent, l'écran
Réglages l'emporte.

| Variable | Défaut | Rôle |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | obligatoire pour les suggestions |
| `COPILOT_MODEL` | `claude-opus-5` | modèle |
| `COPILOT_FAST` | `0` | `1` = mode rapide Opus 5, ~2,5× plus de tokens/s, tarif premium |
| `DEEPGRAM_API_KEY` | — | active les deux canaux et le choix d'appareil |
| `DEEPGRAM_URL` | api.deepgram.com | pour viser un Deepgram auto-hébergé, ou tout service parlant le même protocole |
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

### Pourquoi Deepgram plutôt qu'un moteur local

Parce que le panneau audio l'impose : dès qu'on veut **choisir** un micro, la
Web Speech API est hors jeu — elle ne sait prendre ni un appareil ni un flux,
elle écoute le micro par défaut du système. Il fallait donc capturer nous-mêmes
et envoyer le PCM quelque part. Deepgram est le chemin le plus court : bon en
français, partiels au fil de l'eau, une connexion par canal, rien à installer.
Elle reste le repli sans clé, pour le seul canal **Eux**.

Rester local est possible et le code y est prêt — `DEEPGRAM_URL` pointe où vous
voulez. Deux pistes, par ordre de facilité :

- **[RealtimeSTT](https://github.com/KoljaB/RealtimeSTT)** (MIT, 10,1k ★) —
  serveur Python avec endpoint WebSocket, plusieurs moteurs au choix
  (faster-whisper, Parakeet, sherpa-onnx). Son protocole diffère du nôtre : il
  faudrait un petit adaptateur dans `lib/transcriber.mjs`.
- **[Kyutai STT](https://huggingface.co/kyutai/stt-1b-en_fr)** (CC-BY-4.0) —
  streaming français + anglais, 0,5 s de latence, VAD sémantique. Le meilleur
  choix en français si vous acceptez de faire tourner un modèle.

À noter, pour éviter une fausse piste : **Moonshine, le plus rapide en
navigateur, n'a pas de modèle français** — seulement en, es, ja, ar, uk, ko,
zh, vi.

## Tests

```bash
npm run check   # syntaxe de tous les modules
npm test        # 34 tests : formats, étiquetage par locuteur, chaîne de
                # transcription contre un faux service, refus des autres
                # origines, et stockage chiffré des clés
```

La CI rejoue ces tests avant chaque construction d'installeur.

### Sécurité du serveur local

Le serveur n'écoute que sur `127.0.0.1`, mais n'importe quelle page ouverte
dans votre navigateur peut viser cette adresse — un POST en `text/plain` part
sans contrôle CORS, et les WebSockets n'y sont pas soumises du tout. Le serveur
refuse donc toute requête dont l'en-tête `Origin` n'est pas le sien : un site
tiers ne peut pas consommer vos crédits Anthropic ou Deepgram. Dans l'app
installée, le port est en plus choisi au hasard à chaque lancement.

## Limites connues

- **Sans `DEEPGRAM_API_KEY`**, dans le navigateur, on retombe sur la Web Speech
  API : Chrome/Edge seulement, un seul canal, micro par défaut du système, pas
  de choix d'appareil. Le panneau audio l'affiche en clair. **Dans l'app, pas
  de repli** : Electron n'a pas ce service, la clé Deepgram est nécessaire.
- Si vos haut-parleurs sont ouverts (pas de casque), le canal **Vous** capte
  aussi la voix de l'interlocuteur : elle sera comptée comme la vôtre.
  L'annulation d'écho du micro limite les dégâts sans les supprimer. Au casque,
  la séparation est nette.
- L'exclusion de capture n'existe **pas sous Linux**, et le rectangle noir de
  Windows antérieur à la build 2004 est plus voyant que la fenêtre elle-même.
- Un long silence peut faire fermer le flux par le service ; le copilote le
  signale dans la barre plutôt que d'écouter dans le vide.
