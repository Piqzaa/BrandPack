# Direction visuelle — une identité, trois étapes

BrandPack livre une identité existante. La scène est une illustration de cette livraison, sans upload, génération ni partage réel.

## Expérience
Un seul canvas Three.js 0.186.0 reste visible pendant un parcours de trois étapes. Le scroll est natif : aucun blocage de molette, aucun déplacement forcé. Le premier écran conserve rotation, choix Forma/Sora/Alto et pack/unpack.

1. INPUT : les masters se présentent dans un studio clair.
2. REFINE : les supports se rangent, le pack pivote, le fond et l'éclairage passent vers une ambiance sombre.
3. DELIVER : le pack s'assemble et se décale sous un aperçu HTML de Brand Page. Le studio s'ouvre vers le vert clair.

Le fond CSS, le sol, le fog et les lumières suivent la même progression. Les objets et textures sont réutilisés : aucune reconstruction à chaque scroll, aucune nouvelle bibliothèque. Les références Lusion et Ciao Kombucha inspirent la continuité de la mise en scène ; aucune de leurs ressources n'est utilisée.

## Mobile et accessibilité
La scène occupe la partie haute et les chapitres restent dessous. La caméra recadre les limites du pack après rotation. Les commandes ont des zones tactiles plus confortables. Le canvas est décoratif, les textes et liens sont du HTML. L'aperçu est explicitement illustratif et ne propose pas de faux téléchargement.

La pause arrête la boucle automatique et les changements de pose se font alors directement. La préférence de réduction des mouvements utilise des états de chapitre sans interpolation. La scène s'arrête hors écran et en arrière-plan. Un repli CSS reste disponible sans WebGL. Les scripts ne traitent aucun SVG utilisateur.

## Fichiers et restauration
- templates/home/index.html.twig : stage, contenu, commandes et illustration Brand Page.
- public/styles/app.css : composition, stage sticky et responsive.
- public/scripts/page-motion.js : progression partagée et couleurs au scroll, une frame programmée par événement.
- public/scripts/studio.js : modèles, poses, matériaux, lumières et interaction.
- public/vendor/three/ : dépendance locale et licence MIT.

La version précédente de ces fichiers et des documents est conservée dans backups/2026-10-06-before-scroll-story, avec les empreintes SHA256 dans manifest.json. Recopier les six fichiers à leurs chemins relatifs permet la restauration. Aucun secret ni dépendance n'est inclus.

## Vérifications
Twig valide, routes et ressources en HTTP 200. Parcours inspecté dans le navigateur sur ordinateur et en largeur mobile. Pack/unpack, choix d'identité et pause testés. Les états INPUT, REFINE et DELIVER sont vérifiés pendant un scroll réel. Les contrôles mobiles sont des simulations de largeur ; performance et gestes tactiles restent à confirmer sur téléphone physique.

## Décor photographique et rapprochement
Le studio utilise maintenant public/images/studio-glass-v1.jpg (environ 171 Ko), généré par l'outil imagegen intégré puis encodé en JPEG. Le sol WebGL ne masque plus le décor : il reçoit uniquement les ombres. Le même décor évolue au scroll par cadrage, assombrissement et éclairage vert. La caméra se rapproche pendant REFINE puis recule pour la livraison. Sur mobile, le cadrage garde la priorité sur le zoom pour éviter tout débordement.

La version précédente des styles, scripts et de ce document est conservée dans backups/2026-10-06-before-image-stage.

Prompt de génération :
Generate a wide landscape premium photographic architectural studio backdrop for BrandPack, a designer logo handoff tool. EMPTY SET, no products, no logos, no typography, no symbols. Warm ivory gallery space, subtle plaster surfaces, a large monumental fluted translucent glass panel on the far right catching raking afternoon light, gentle architectural shadows, an orange translucent acrylic edge barely visible at right border, restrained pale sage reflections. Left 45 percent should be almost empty calm ivory wall for black text; middle-right should remain open negative space for an interactive 3D product overlay. Fine tactile materials and believable optical caustics, editorial product photography, sophisticated modern design studio, not generic AI gradients, no floating blobs or sci-fi. Camera straight-on slight architectural perspective, no dramatic vanishing point. Wide 16:9 composition, very high visual quality.

## Direction actuelle — l'identité devient le décor
La photographie de studio reste conservée comme ressource historique, mais n'est plus affichée. Une composition SVG/HTML remplace le fond : mot de marque monumental, symbole agrandi, grille vectorielle et points de contrôle. La progression de scroll agrandit et tourne le symbole pendant que le pack se rapproche puis s'efface, avant de réapparaître assemblé pour la livraison. Le même récit existe pour Forma (forme organique orange), Sora (orbites bleues) et Alto (construction angulaire verte), avec palettes propres.

Cette étape réalise la transition pack → symbole → grille. Les mises en situation écran/affiche de la proposition restent à construire ultérieurement, sans ajouter de fonctionnalités métier. Le texte reste en HTML et les formes de fond sont décoratives. Sur mobile, le décor est limité à la zone visuelle haute ; la lecture reste en dessous. Le mouvement réduit utilise des états fixes par chapitre.

Sauvegarde avant cette évolution : backups/2026-10-06-before-identity-world. Templates validés, pages et scripts en HTTP 200, progression contrôlée par défilement réel sur ordinateur et à 390 px. Captures : docs/previews/identity-world-desktop.jpg et identity-world-mobile.jpg. Les simulations ne remplacent pas un contrôle sur téléphone physique.
