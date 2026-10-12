# cdf-template

Template Joomla de [CoupDeFouet.fr](https://coupdefouet.fr), site de recettes de pâtisserie.

`cassiopeia_cdf` est un **template enfant de Cassiopeia** (le template par défaut de Joomla 5/6) :
il ne réécrit pas Cassiopeia, il le personnalise, donc les mises à jour de Joomla ne le cassent pas.

- Thème « pâtisserie maison » : fond crème, texte chocolat, accent framboise, titres en serif.
- Pages catégorie en grille de cartes (photo + titre), sous-catégories en cartes.
- Mise en forme automatique des recettes : encadrés d'infos, ingrédients à cocher, étapes numérotées.
- Aucune extension tierce, uniquement des fonctions natives de Joomla.

## Contenu du dépôt

| Dossier | Contenu |
|---|---|
| `template/cassiopeia_cdf/` | Le template, organisé comme dans le paquet d'installation |
| `contenus/modules/` | HTML des modules de la page d'accueil (bloc d'accueil, catégories, pied de page) |
| `contenus/recettes/` | Modèle de recette et exemples |
| `images/` | Photos retravaillées pour le site |
| `docs/` | Guide de mise en place dans l'administration Joomla |
| `build.ps1` | Fabrique le paquet `.zip` à installer |

## Installer

1. Télécharger `tpl_cassiopeia_cdf-<version>.zip` depuis la page **Releases** du dépôt.
2. Joomla › **Système › Installer › Extensions › Téléverser un fichier**.
3. Suivre [docs/MISE-EN-PLACE.md](docs/MISE-EN-PLACE.md) pour le réglage du style et des modules.

Une nouvelle version s'installe par-dessus l'ancienne, sans perdre les réglages.
Pour revenir en arrière, réinstaller le zip d'une version précédente.

## Écrire une recette

Partir de [contenus/recettes/modele-recette.html](contenus/recettes/modele-recette.html) et le coller
dans l'article via **« Afficher/masquer l'éditeur »**. Le thème reconnaît les rubriques
« Information recette », « Ingrédients » et « Préparation ».

## Publier une nouvelle version

```powershell
.\build.ps1 -Version 1.0.6       # met à jour templateDetails.xml et crée dist\tpl_cassiopeia_cdf-1.0.6.zip
git add -A
git commit -m "Description du changement"
git tag v1.0.6
git push --follow-tags
```

Puis, sur GitHub, créer une **Release** à partir du tag `v1.0.6` et y joindre le zip du dossier `dist/`.
Noter les changements dans [CHANGELOG.md](CHANGELOG.md).

## Licence

GNU General Public License version 2 ou ultérieure, comme Joomla et Cassiopeia. Voir [LICENSE.txt](LICENSE.txt).
