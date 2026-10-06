# BrandPack

Le code et la configuration sont versionnés avec Git. Les secrets locaux, dépendances installées, caches, backups de design et captures de navigateur restent exclus du dépôt. Les backups et captures restent disponibles sur la machine qui les a créés.

Premier socle pédagogique : PHP 8.4, Symfony 7.4 LTS, Twig et Docker. Deux pages, sans données persistantes. PostgreSQL et le renderer seront ajoutés à l'étape où ils deviennent utiles.

## Démarrer
Ouvrir Docker Desktop et attendre que le moteur soit prêt. Dans ce dossier :

```powershell
docker compose up -d --build
```

Le premier démarrage télécharge l'image PHP et les dépendances Composer. Ouvrir ensuite http://localhost:8000. Suivre l'installation avec `docker compose logs -f app`.

Composer installe les dépendances au démarrage. `composer.lock` fige les versions et doit être versionné. `vendor` et le cache sont dans des volumes Docker, pour éviter de multiplier les petits fichiers dans OneDrive.

## Commandes utiles
```powershell
docker compose down
docker compose logs -f app
docker compose exec app sh
docker compose exec app php bin/console about
docker compose exec app php bin/console debug:router
docker compose exec app php bin/console lint:container
docker compose exec app php bin/console lint:twig templates
docker compose exec app php bin/console lint:yaml config
docker compose exec app composer validate --strict
```

Le serveur PHP intégré est réservé au développement local. Il écoute uniquement sur l'interface locale de l'ordinateur via Docker. Il ne constitue pas un déploiement de production.

## Le trajet d'une page
1. Le navigateur demande `/`.
2. `public/index.php` démarre Symfony.
3. La route `#[Route('/')]` sélectionne `HomeController::index()`.
4. Le contrôleur demande à Twig de rendre `templates/home/index.html.twig`.
5. Le template réutilise `templates/base.html.twig` et le navigateur charge `public/styles/app.css`.

Ton expérience MVC se retrouve ici : contrôleur = action, Twig = vue. Nous ajouterons le modèle avec les premières données de marque.

## Configuration
`.env` contient les paramètres de développement non secrets. `.env.local` contient le secret local généré lors de l'installation, et ne doit pas être commité. Aucun compte ni upload n'est encore disponible.

## Ce que tu viens d'apprendre
- Docker fournit PHP et Composer sans les installer sur Windows.
- Une route associe une URL à une action de contrôleur.
- Twig compose la vue et échappe les valeurs affichées par défaut.
- Le Kernel et la configuration assemblent l'application Symfony.

## Application dans BrandPack
Les routes `/` et `/brandpacks/new` utilisent le même contrôleur et le même layout. La seconde page décrit la prochaine étape ; elle ne crée encore aucune marque.

## Direction visuelle 3D
L'accueil met en scène une livraison fictive en WebGL. On peut faire tourner le pack, l'assembler, le déployer et changer de marque d'exemple (Forma, Sora, Alto). Ces interactions ne génèrent aucun fichier. Voir `docs/UI_UX.md`.

Twig garde le contenu et les boutons accessibles ; CSS compose la page ; `public/scripts/studio.js` construit les objets, les matières et la lumière avec Three.js. La bibliothèque et sa licence sont conservées dans `public/vendor/three/`. Aucun Node ni bundler n'est nécessaire pour cette étude. Le contrôleur Symfony reste identique.

La pause et la préférence de réduction des mouvements arrêtent l'animation automatique. Les objets peuvent être manipulés volontairement. La scène s'arrête hors écran et en arrière-plan, avec un repli CSS si WebGL n'est pas disponible. Elle est distincte du futur renderer Node chargé de traiter les SVG.

`public/scripts/page-motion.js` donne du rythme au reste de la page avec le défilement natif : transformation du pack, progression des étapes, changements de fond et signe final. La pause commande aussi ces effets. Sur mobile, le canvas possède un cadre dédié et la caméra recadre le pack à chaque rotation.

## État des vérifications
Le conteneur démarre et les deux pages ainsi que la feuille CSS répondent en HTTP 200. La configuration Compose, le conteneur de services Symfony, les fichiers YAML, les templates Twig et le manifeste Composer sont vérifiés. Symfony Flex maintient les composants du framework sur la branche 7.4 LTS ; les versions exactes sont figées dans `composer.lock`.

## Narration au scroll
La scène accompagne maintenant les trois étapes de livraison. Une progression commune pilote les poses, la lumière, le fond et un aperçu illustratif de Brand Page. Le scroll reste natif. La version précédente est sauvegardée dans `backups/2026-10-06-before-scroll-story` ; les six fichiers peuvent être recopiés à leurs chemins relatifs pour revenir en arrière. Voir `docs/UI_UX.md` pour les détails.
