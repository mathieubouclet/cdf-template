# Historique des versions

## 1.0.5 – 2026-10-11
- Retrait des déclarations `@font-face` de Fraunces et DM Sans tant que les fichiers ne sont pas fournis (évite des erreurs 404). Les titres utilisent Georgia, le texte la police système.

## 1.0.4 – 2026-10-11
- Sous-catégories (ex. « Crèmes ») affichées en cartes avec l'image de la catégorie et le nombre de recettes, en haut de la page catégorie.

## 1.0.3 – 2026-10-10
- Fiche « recettes en chaîne » (`.cdf-chain`) : étapes numérotées, ingrédient hérité de l'étape précédente mis en avant, flèches de liaison.

## 1.0.2 – 2026-10-05
- Pied de page : ligne de crédits (`.cdf-credits`).

## 1.0.1 – 2026-10-04
- Recettes : les champs « Information recette » laissés vides sont masqués.
- Recettes : prise en charge des étapes saisies en liste numérotée (`<ol>`).
- Manifeste : installation en mode mise à jour (`method="upgrade"`), retrait des fichiers de langue hérités de Cassiopeia.

## 1.0.0 – 2026-10-03
- Première version du template enfant de Cassiopeia : thème, cartes des pages catégorie, mise en forme automatique des recettes.
