# BrandPack — reference produit

## Promesse
Transformer une identité visuelle terminée en fichiers organisés et une page client qui aide à choisir le bon fichier.

Cible initiale : designers freelance et petites agences. Deuxième cible : propriétaires de marques ayant déjà reçu leur logo.

## Parcours prévu
Nommer une marque → déposer ses masters SVG → contrôler → prévisualiser → générer → télécharger le ZIP → partager la Brand Page.

Le designer fournit les compositions (principal, secondaire, symbole, wordmark). BrandPack n'invente pas ces compositions. Les variantes noires et blanches devront être vérifiées visuellement et désactivables.

## Première étape
Faire fonctionner Symfony dans Docker et afficher une page d'accueil. Le lien de création mène pour le moment à une explication du futur parcours, sans formulaire ni persistance.

## Ensuite
1. Création d'une marque et persistance PostgreSQL.
2. Dépôt sécurisé d'un seul SVG, preflight basique et aperçu PNG sûr.
3. Renderer, exports et variantes validées.
4. Favicon, ZIP et Brand Page guidant les téléchargements.
5. Validation auprès d'utilisateurs, puis paiement si pertinent.

## Plus tard
Brand System (couleurs, typographies, règles), génération d'assets à partir de cette identité, puis automatisations. Pas d'éditeur graphique complet, de génération de logo IA ou de collaboration avancée dans le MVP.

Les prix du brief sont des hypothèses à valider, pas des exigences d'implémentation.
