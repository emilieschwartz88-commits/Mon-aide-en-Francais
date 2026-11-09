# Appli Français 4ème / 3ème – aide au travail personnel

Projet d'application pour les élèves de **4ème et de 3ème** en français. Elle vise l'**autonomie** : l'élève photographie un exercice ou une leçon et reçoit des **aides graduées, jamais la réponse**.

## Principes

- **Deux entrées** : par **besoin** (« je ne comprends pas la consigne », « je veux vérifier mon travail »…) et par **compétence** (lire, écrire, grammaire, orthographe, lexique, oral).
- **Scan** d'un exercice ou d'une leçon, puis aide en 4 paliers : reformulation, rappel de cours, question-guide, exemple semblable.
- **Gamification** qui récompense l'effort et non la rapidité : étoiles, niveaux, badges, personnage personnalisable (« Mine »), défis hebdomadaires, défi collectif de classe.
- **Pas de classement individuel**, pour ne pas décourager les élèves en difficulté.

## Contenu du dépôt

| Dossier / fichier | Contenu |
|---|---|
| `maquette/index.html` | Maquette cliquable (accueil, besoins, compétences, aide guidée, profil gamifié). Contenus d'exemple, sans IA. |
| `prototype/` | Prototype fonctionnel (photo ou texte saisi, aide en paliers par l'IA, contrôle anti-solution). Guide : `prototype/GUIDE-MISE-EN-LIGNE.md`. |
| `docs/prompt-systeme.md` | Consignes pédagogiques qui cadrent l'IA (le « prompt système »). |
| `docs/cahier-des-charges.md` | Cahier des charges fonctionnel et technique, jalons. |

## Voir la maquette

Ouvrez `maquette/index.html` dans un navigateur. Pour la publier en ligne avec GitHub Pages, copiez `maquette/index.html` à la racine du dépôt, puis *Settings → Pages* : « Deploy from a branch », branche `main`, dossier `/ (root)`. (GitHub Pages ne propose que la racine ou `/docs`.)

## État d'avancement

- [x] Maquette de l'interface et de la gamification
- [x] Consignes pédagogiques de l'IA (version 1)
- [x] Gamification connectée au prototype (progression locale) – à tester
- [ ] Défi collectif de classe et suivi enseignante (base de données)
- [ ] Cahier des charges validé
- [x] Prototype avec vraie IA (saisie de texte) – à tester
- [x] Scan et reconnaissance du texte (photo) – à tester
- [ ] Tests avec un jeu d'exercices types et des élèves « tricheurs »
- [ ] Déclaration RGPD et information des familles
- [ ] Expérimentation en classe

## Licence

À choisir avant diffusion (par exemple CC BY-NC-SA pour les contenus pédagogiques, MIT ou AGPL pour le code).
