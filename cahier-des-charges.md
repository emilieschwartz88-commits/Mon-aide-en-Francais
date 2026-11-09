# Cahier des charges – version 0.1 (brouillon)

## 1. Objectif
Permettre aux élèves de 4ème et de 3ème de travailler en autonomie en français : obtenir de l'aide sur un exercice ou une leçon sans recevoir la réponse.

## 2. Public
- Élèves de 4ème et de 3ème (13 à 15 ans), sur téléphone, tablette ou ordinateur.
- Enseignante (espace de suivi et de réglages, en seconde phase).

## 3. Fonctionnalités

### 3.1 Entrées
- **Par besoin** : comprendre la consigne, savoir par où commencer, comprendre une notion, vérifier son travail, préparer un contrôle, s'entraîner.
- **Par compétence** : lire et comprendre, écrire, grammaire, orthographe, lexique, oral, avec des sous-thèmes par niveau.
- Sélecteur de niveau 4ème / 3ème.

### 3.2 Scan
- Photo d'un exercice ou d'une leçon, lecture du texte (OCR ou modèle d'IA à vision).
- Confirmation du texte reconnu par l'élève avant toute aide.
- Détection de la compétence travaillée.

### 3.3 Aide guidée en 4 paliers
Reformulation de la consigne, rappel de cours, question-guide, exemple semblable. Un palier à la fois. Voir `prompt-systeme.md`.
- Vérification de la réponse de l'élève avec des indices, sans correction.

### 3.4 Gamification
- Étoiles pour l'effort : essayer avant de demander une aide supplémentaire (+2), faire vérifier une réponse (+10).
- Niveaux, série de jours, badges (généraux et liés aux compétences).
- Personnage « Mine » personnalisable : couleur, accessoire, fond, achetés avec les étoiles.
- Défis hebdomadaires individuels.
- Défi collectif de classe avec récompense choisie par l'enseignante.
- Pas de classement individuel.

### 3.4 bis Espace enseignant (phase 2)
- Choisir les défis et les récompenses de classe.
- Voir les compétences les plus sollicitées (statistiques agrégées, sans nom).
- Ajouter ses fiches de cours et méthodes.

## 4. Contraintes pédagogiques
- Aucune réponse d'exercice donnée par l'IA.
- Respect des programmes de cycle 4.
- Messages courts, ton bienveillant.

## 5. Contraintes techniques (pistes)
- Application web responsive (PWA) pour fonctionner sur tous les appareils sans installation.
- Appel à un modèle d'IA via une API, **uniquement côté serveur** (ne jamais exposer la clé dans l'application).
- Contrôle automatique des réponses de l'IA avant affichage.
- Stockage minimal : progression de l'élève sous un pseudonyme.

## 6. Données personnelles (RGPD)
- Élèves de moins de 15 ans : prévoir l'information des familles et, selon le cas, leur consentement.
- Ne pas stocker les photos au-delà du traitement. Ne pas demander de nom, ni de données d'identité.
- Déclarer le traitement avec le délégué à la protection des données (DPO) de l'établissement ou du rectorat.
- Vérifier l'hébergement des données et les conditions du fournisseur d'IA.

## 7. Tests
- Jeu de 30 à 50 exercices types par niveau.
- Scénarios d'élèves « tricheurs » (insistance, fausse autorisation du professeur…).
- Tests d'usage avec un petit groupe d'élèves.
- Critères de réussite : l'IA ne donne pas la réponse dans plus de 99 % des cas testés ; les élèves comprennent les aides.

## 8. Jalons
1. Maquette (fait).
2. Prompt système (version 1 faite).
3. Prototype texte : l'élève saisit l'exercice, l'IA guide.
4. Ajout du scan.
5. Gamification connectée (sauvegarde de la progression).
6. Expérimentation en classe, puis ajustements.
7. Espace enseignant.

## 9. Questions ouvertes
- Qui héberge et finance l'application, et sous quel cadre (établissement, académie, projet personnel) ?
- Compte élève (via l'ENT) ou accès par code de classe ?
- Quelles ressources de cours intégrer (manuel, fiches personnelles) ?
