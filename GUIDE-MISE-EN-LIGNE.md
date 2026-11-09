# Mettre le prototype en ligne (sans écrire de code)

Le prototype comprend une page (`public/index.html`) et une petite fonction serveur (`api/aide.js`) qui appelle l'IA. La clé d'accès à l'IA reste sur le serveur.

## Ce qu'il vous faut
1. Un compte **GitHub** avec ce dépôt (vous l'avez).
2. Un compte **Anthropic Console** (console.anthropic.com) pour obtenir une clé d'API. L'usage est payant, à la consommation.
3. Un compte **Vercel** (vercel.com), gratuit pour un petit projet, connecté avec votre compte GitHub.

## Étapes
1. **Clé d'API** : dans la Console Anthropic, créez une clé (*API keys → Create key*). Copiez-la tout de suite, elle ne s'affiche qu'une fois. Dans *Limits* (ou *Billing*), **fixez une limite de dépense mensuelle** (par exemple 10 €) pour éviter toute mauvaise surprise.
2. **Importer le projet** : sur Vercel, *Add New… → Project*, choisissez votre dépôt GitHub.
3. **Dossier du projet** : dans *Root Directory*, cliquez sur *Edit* et sélectionnez le dossier **`prototype`**. Laissez les autres réglages par défaut.
4. **Variables d'environnement** (*Environment Variables*), à ajouter avant de déployer :
   - `ANTHROPIC_API_KEY` : votre clé d'API.
   - `CODE_CLASSE` : un mot de passe que vous donnerez à vos élèves (ex. `mine4eme`). Il évite que n'importe qui utilise votre quota.
   - Facultatif : `ANTHROPIC_MODEL` pour changer de modèle (par défaut `claude-sonnet-5-5`), et `CONTROLE=off` pour désactiver le contrôle anti-solution (déconseillé).
5. Cliquez sur **Deploy**. Après une minute, Vercel donne une adresse du type `https://votre-projet.vercel.app`.
6. **Testez** : ouvrez l'adresse, entrez le code de classe, recopiez un exercice, demandez de l'aide.

Chaque modification envoyée sur GitHub redéploie automatiquement le site.

## Ce que fait le serveur
- **Lit la photo** de l'exercice (`api/lire.js`) : l'élève prend son cahier ou son manuel en photo, l'IA recopie le texte, l'élève le vérifie et le corrige avant de demander de l'aide. Les noms et informations personnelles éventuels sont remplacés par `[nom]`. L'application n'enregistre pas la photo, mais elle transite par Vercel et Anthropic.
- Ajoute les consignes de `docs/prompt-systeme.md` (copiées dans `api/prompt.js`).
- Limite la taille des messages et le nombre de demandes (30 toutes les 10 minutes par adresse).
- **Contrôle** chaque réponse de l'IA avec un second appel : si elle donne la solution, elle est régénérée, puis remplacée par un message neutre si le problème persiste.

## Gamification et progression
- Étoiles, niveaux, badges, défis de la semaine et personnage « Mine » personnalisable sont intégrés (bouton en haut à droite).
- La progression est **conservée dans le navigateur de l'élève** : pas de compte, pas de nom, aucune donnée envoyée au serveur. Si l'élève efface les données du navigateur ou change d'appareil, il la perd, sauf s'il a copié son **code de sauvegarde** (écran Profil).
- Les étoiles récompensent l'effort : +2 pour essayer avant une aide supplémentaire (4 fois par jour) et +10 pour faire vérifier une réponse, avec un plafond de 40 ★ par jour.
- Limites : un élève motivé peut modifier sa progression sur son propre appareil. Ce n'est pas un enjeu de sécurité, mais cela empêche d'utiliser ces points pour une note. Le **défi collectif de classe** et un suivi par l'enseignante demandent une base de données et des comptes : c'est l'étape suivante.

## Si vous modifiez les consignes
Le fichier de référence est `docs/prompt-systeme.md`. Après l'avoir modifié, il faut mettre à jour `prototype/api/prompt.js` (même texte). Un développeur peut automatiser cette copie.

## Avant de l'utiliser avec des élèves
- **Testez longuement** avec des exercices réels et des « élèves tricheurs » (vous, en insistant pour obtenir la réponse). Aucun contrôle n'est infaillible.
- **Vérifiez l'exactitude** des explications de grammaire sur quelques cas.
- **RGPD** : information des familles, validation par le chef d'établissement ou le DPO. Les textes tapés par les élèves transitent par les serveurs de Vercel et d'Anthropic. Consultez leurs conditions et la politique de l'établissement.
- **Photos** : demandez aux élèves de ne cadrer que l'exercice (pas de visage, pas de nom). La lecture d'une écriture manuscrite peut être imparfaite : d'où l'étape de vérification du texte. Une photo est limitée à environ 3 Mo après réduction automatique.
- **Coûts** : suivez la consommation dans la Console. Chaque demande déclenche 2 appels (réponse et contrôle).
- **Sécurité** : le code de classe est une protection simple. Changez-le régulièrement. Ne mettez jamais la clé dans un fichier du dépôt.

## Prochaines étapes possibles
Sauvegarde de la progression et gamification connectée, espace enseignant, comptes via l'ENT.
