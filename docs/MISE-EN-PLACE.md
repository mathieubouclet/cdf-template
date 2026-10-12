# Refonte CoupDeFouet.fr – mise en place

Tout se fait depuis l'administration Joomla (`/administrator`), sans toucher au serveur.
Les libellés peuvent varier légèrement selon la traduction.

## 0. Avant de commencer
- Faites une **sauvegarde** : base de données + fichiers (votre `tar` + un `mysqldump`).
- Retour arrière possible à tout moment : remettre « Cassiopeia – Default » comme style par défaut (étape 2).

## 1. Installer le template enfant
**Système › Installer › Extensions › Téléverser un fichier** → `tpl_cassiopeia_cdf-<version>.zip` (page *Releases* du dépôt GitHub, ou dossier `dist/` après `.\build.ps1`).

## 2. Régler le style et l'activer
**Système › Styles des templates (site) › cassiopeia_cdf – Default**, onglet **Avancé** :

| Réglage | Valeur |
|---|---|
| Marque | Oui |
| Logo | *(vide)* |
| Titre (texte) | `Coup de fouet` |
| Police | Aucune *(gérée par le thème)* |
| Couleurs | Standard *(le thème les remplace)* |
| Retour en haut | Oui |

Enregistrer, puis cliquer sur l'**étoile** pour en faire le style par défaut.
Si certaines pages de menu étaient assignées à l'ancien style (onglet « Affectation des menus »), les réassigner.

## 3. Modules (Contenu › Modules du site)

| Module (ID) | Position | Action |
|---|---|---|
| Module ID **125** (texte « CoupDeFouet.fr ») | topbar | **Dépublier** (remplacé par le titre du template) |
| **banner** (ID 112, type Bannières) | banner | **Dépublier** |
| **Accueil** (ID 116, Personnalisé) | banner | **Remplacer** le contenu par `contenus/modules/1-accueil-hero.html` |
| **biscuits**, **Les pâtes**, **Préparations** (ID 119, 120, 121) | top-a | **Dépublier** |
| **Boulangerie**, **Gâteaux**, **Barres énergétiques** (ID 123, 124, 122) | top-b | **Dépublier** |
| **Footer** (ID 118) | footer | Remplacer le contenu par `contenus/modules/3-pied-de-page.html` |
| **Liste recettes** (ID 129) | sidebar-right | À garder ou à limiter aux pages recettes, selon votre goût |
| Breadcrumbs (17), Main Menu (1), Login Form (16) | — | Ne rien changer |

Nouveaux modules à créer :

1. **Personnalisé – « Accueil – catégories »**
   - Contenu : `contenus/modules/2-accueil-categories.html`
   - Position : `top-a` · Titre : masqué · Affectation : *Accueil uniquement*
2. **Articles – « Dernières recettes »**
   - Position : `bottom-a` · Titre : affiché · Affectation : *Accueil uniquement*
   - 4 articles, triés par date de création (plus récent d'abord), toutes catégories de recettes
   - Afficher : titre (avec lien), catégorie, **image d'introduction**
   - Onglet Avancé › **Classe du module** : `cdf-latest`

> **Pour coller du HTML** dans un module Personnalisé : cliquez sur **« Afficher/masquer l'éditeur »** (ou Outils › Code source), collez, puis enregistrez. Sinon TinyMCE risque de modifier la structure.

Le bloc d'accueil (`1-accueil-hero.html`) utilise `images/accueil-fraisier.jpg`, à envoyer dans le dossier `images/accueil/` du site (Contenu › Médias).

## 4. Articles
**Contenu › Articles › Options › onglet Article** : **Titre = Afficher**.
Le titre devient ainsi un vrai H1. L'ancien titre que vous aviez saisi en haut de chaque recette est retiré automatiquement par le thème, vous n'avez rien à modifier dans les recettes.

## 5. Vérifier
Accueil, une page catégorie et deux ou trois recettes, sur ordinateur **et** sur téléphone.

---

### Ce que contient le template

- `media/css/user.css` : tout le thème (couleurs, typographie, header, cartes, pages recettes).
- `media/js/user.js` : met en forme les recettes existantes (encadrés d'infos, ingrédients à cocher, étapes numérotées), sans modifier les articles.
- `html/com_content/category/blog_item.php` : affiche chaque recette en carte (photo + titre) dans les pages catégorie.
- `html/com_content/category/blog_children.php` : affiche les sous-catégories (ex. « Crèmes ») en cartes, avec l'image de la catégorie.
- `media/fonts/` : emplacement des polices Fraunces et DM Sans (à ajouter). En attendant, le site utilise Georgia et la police système.
