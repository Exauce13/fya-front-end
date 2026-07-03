# FYA Frontend - Find Your Artisans

FYA est une plateforme web de mise en relation entre clients et artisans. Elle permet a un visiteur de decouvrir des artisans, a un client de publier des besoins et de suivre des services, a un artisan de valoriser son profil et ses realisations, et a un administrateur de superviser les utilisateurs, les verifications, les signalements, les appels d'offres et les paiements.

Le projet est une application React construite avec Vite, Tailwind CSS, React Router, Axios, React Hook Form, Zod, Laravel Echo et Pusher/Reverb pour le temps reel.

## Sommaire

- [Objectif de la plateforme](#objectif-de-la-plateforme)
- [Roles utilisateurs](#roles-utilisateurs)
- [Fonctionnalites principales](#fonctionnalites-principales)
- [Avantages](#avantages)
- [Limites et points a ameliorer](#limites-et-points-a-ameliorer)
- [Architecture du projet](#architecture-du-projet)
- [Technologies et dependances](#technologies-et-dependances)
- [Installation et lancement](#installation-et-lancement)
- [Variables d'environnement](#variables-denvironnement)
- [Backend attendu](#backend-attendu)
- [Documentation detaillee](#documentation-detaillee)

## Objectif de la plateforme

FYA ne se limite pas a un annuaire d'artisans. L'objectif est de couvrir une grande partie du cycle de relation entre un client et un artisan :

1. Decouvrir des metiers et artisans.
2. Consulter des profils publics.
3. Publier ou consulter des appels d'offres.
4. Discuter via messagerie.
5. Proposer et suivre des services.
6. Publier des realisations.
7. Donner des avis.
8. Signaler un probleme.
9. Verifier les artisans.
10. Administrer la plateforme.

## Roles utilisateurs

### Visiteur

Un visiteur peut :

- acceder a la page d'accueil ;
- rechercher des artisans ;
- consulter les profils publics ;
- voir les publications et appels d'offres publics ;
- acceder aux pages d'information comme CGU, confidentialite, contact et a propos ;
- etre redirige vers la connexion lorsqu'il tente d'acceder a une action protegee.

### Client

Un client peut :

- creer un compte client ;
- se connecter ;
- publier un appel d'offres ;
- gerer ses appels d'offres ;
- consulter les candidatures ;
- discuter avec un artisan ;
- suivre un service ;
- valider ou terminer un service selon le contexte ;
- donner un avis apres une prestation ;
- modifier son profil.

### Artisan

Un artisan peut :

- creer un compte artisan ;
- se connecter ;
- completer son profil ;
- publier des services, conseils, annonces ou realisations ;
- postuler aux appels d'offres ;
- discuter avec des clients ;
- proposer et suivre des services ;
- demander une verification artisan ;
- consulter ses avis et informations publiques.

### Administrateur

Un administrateur peut :

- acceder au tableau de bord admin ;
- consulter les statistiques globales ;
- gerer les utilisateurs ;
- suspendre ou reactiver des comptes ;
- gerer les demandes de verification artisan ;
- moderer les appels d'offres ;
- traiter ou ignorer les signalements ;
- consulter et exporter les paiements.

## Fonctionnalites principales

### Recherche et exploration

La plateforme propose une recherche d'artisans par metier, ville, quartier, certification et mots-cles. Les artisans sont affiches sous forme de liste ou de resultats visuels selon les composants de recherche.

### Profils publics

Les profils artisans affichent :

- informations personnelles et professionnelles ;
- metier ;
- localisation ;
- experience ;
- atelier ou association ;
- badge de verification ;
- publications ;
- portfolio ;
- avis ;
- statistiques.

Les profils clients publics permettent aussi d'identifier un client dans les interactions de la plateforme.

### Publications

Les artisans peuvent creer des publications avec description, images ou videos. Les publications peuvent etre aimees, commentees, consultees en detail et agrandies via une visionneuse media.

Le frontend envoie les publications au backend via `src/services/postsService.js`. Les types envoyes sont adaptes aux valeurs attendues par le backend Laravel : `services`, `realisations`, `promotion`.

### Appels d'offres

Les appels d'offres permettent aux clients d'exprimer un besoin. Les artisans peuvent consulter les offres et postuler. Le client peut ensuite suivre les candidatures, accepter une proposition et cloturer une offre.

### Messagerie

La messagerie permet les conversations entre utilisateurs. Elle prend en charge :

- liste de conversations ;
- messages texte ;
- fichiers ;
- notes vocales ;
- pieces jointes ;
- actions autour d'un service ;
- notifications temps reel lorsque la configuration est disponible.

### Services

La fonctionnalite service represente une prestation proposee entre un artisan et un client. Elle permet de suivre les statuts : en attente, en cours, termine, annule. Les services peuvent etre consultes depuis la messagerie ou depuis "Mes services".

### Avis

Apres une prestation, un utilisateur peut laisser un avis. Les avis alimentent la confiance dans les profils publics.

### Verification artisan

Un artisan peut envoyer une demande de verification avec pieces justificatives et paiement test sandbox. Le frontend affiche une UX de paiement reussi en mode test et marque localement le statut comme en attente.

### Administration

L'espace admin est separe du reste du site. Les routes admin sont protegees et accessibles uniquement au role `admin`.

## Avantages

- Parcours complet entre client et artisan, pas seulement une fiche annuaire.
- Gestion claire des roles : visiteur, client, artisan, admin.
- Architecture frontend separee en routes, pages, composants, services, hooks et utils.
- Appels API centralises avec Axios.
- Protection des routes par role.
- Validation robuste des formulaires avec React Hook Form et Zod.
- Gestion du temps reel avec Laravel Echo/Pusher/Reverb.
- Interface responsive optimisee pour mobile.
- Composants metier separes : admin, artisan, auth, home, messaging, offers, search, realtime.

## Limites et points a ameliorer

- Le frontend depend fortement du backend Laravel et de ses endpoints.
- Le stockage du token dans `localStorage` ou `sessionStorage` reste sensible aux attaques XSS ; une solution par cookies HttpOnly serait plus robuste si le backend l'autorise.
- Le paiement de verification est actuellement gere comme paiement sandbox/test.
- Le bundle de production signale un avertissement de taille ; du code splitting pourrait ameliorer les performances.
- Les tests automatises frontend ne sont pas encore configures.
- La configuration temps reel depend de variables d'environnement Pusher/Reverb.

## Architecture du projet

```txt
src/
  App.jsx                    Shell global de l'application
  main.jsx                   Point d'entree React
  routes/                    Definition des routes par domaine
  pages/                     Pages ecran par role ou domaine
  components/                Composants reutilisables et composants metier
  services/                  Acces API et normalisation des donnees
  context/                   Contexte utilisateur et role courant
  hooks/                     Hooks reutilisables
  utils/                     Helpers de stockage et validation
  data/                      Donnees locales de secours ou de demonstration
  layouts/                   Layouts reutilisables
  assets/                    Images et ressources statiques
```

Le detail complet de l'architecture est disponible dans [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Technologies et dependances

### React

React est utilise pour construire l'interface sous forme de composants reutilisables. Les principaux hooks utilises sont `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useLocation`, `useNavigate`, `useParams` et `useWatch`.

### Vite

Vite sert au lancement local, au build de production et au hot reload.

### React Router

React Router gere les routes publiques, protegees, client/artisan et admin.

### Axios

Axios est utilise pour communiquer avec le backend Laravel. Les clients API sont centralises dans `src/services/apiClient.js`.

### React Hook Form et Zod

React Hook Form gere les formulaires et Zod valide les schemas d'inscription, de creation ou de saisie.

### Tailwind CSS

Tailwind CSS gere la mise en forme via des classes utilitaires directement dans les composants.

### Laravel Echo, Pusher/Reverb

Ces bibliotheques gerent les notifications et evenements temps reel lorsque le backend est configure.

### Lucide React

Lucide fournit les icones de navigation, boutons, statuts, profils et actions.

## Installation et lancement

### Prerequis

- Node.js recent
- npm
- Backend Laravel FYA lance et accessible

### Installation

```bash
npm install
```

### Lancement en developpement

```bash
npm run dev
```

### Verification du code

```bash
npm run lint
```

### Build de production

```bash
npm run build
```

### Apercu du build

```bash
npm run preview
```

## Variables d'environnement

La variable la plus importante est :

```env
VITE_API_BASE_URL=http://192.168.1.83:3000/api
```

Variables utiles pour le temps reel :

```env
VITE_REALTIME_ENABLED=true
VITE_PUSHER_APP_KEY=
VITE_PUSHER_APP_CLUSTER=mt1
VITE_PUSHER_HOST=
VITE_PUSHER_PORT=6001
VITE_PUSHER_FORCE_TLS=false
VITE_PUSHER_AUTH_ENDPOINT=
```

Le fichier `src/services/apiClient.js` utilise `VITE_API_BASE_URL`, sinon il retombe sur une adresse locale par defaut.

## Backend attendu

Le frontend attend un backend Laravel avec :

- authentification par token Bearer ;
- routes d'inscription client et artisan ;
- routes de recherche artisans ;
- routes posts/publications ;
- routes appels d'offres ;
- routes messagerie ;
- routes services ;
- routes avis ;
- routes verification artisan ;
- routes admin ;
- broadcasting pour le temps reel.

Backend indique pendant le developpement : `Exauce13/FYA-backend`.

## Documentation detaillee

- [Architecture React et organisation du code](docs/ARCHITECTURE.md)
- [Guide d'utilisation de la plateforme](docs/GUIDE_UTILISATION.md)
- [Backend attendu pour le mot de passe oublie](docs/BACKEND_MOT_DE_PASSE_OUBLIE.md)

## Questions frequentes rapides

### Pourquoi un visiteur est-il redirige vers la connexion ?

Les pages sensibles sont protegees par `RoleGate`. Si le role courant est `visitor`, l'utilisateur est redirige vers `/login`.

### Pourquoi le footer n'apparait-il pas partout ?

Le footer est masque sur certaines pages operationnelles comme `/explorer`, `/offres`, `/messages` et `/mes-services` afin de garder une experience plus concentree.

### Pourquoi le paiement affiche directement "Paiement reussi" ?

Le paiement de verification est actuellement en mode sandbox/test. Pour eviter de montrer une page sandbox externe, le frontend confirme le paiement test dans l'interface puis marque la demande comme en attente.

### Pourquoi certaines images sont affichees en entier ?

Les publications utilisent une grille qui preserve le ratio des images afin d'eviter les coupures. Au clic, une visionneuse permet de consulter le media en grand.

### Comment ajouter une nouvelle page ?

1. Creer la page dans `src/pages/...`.
2. Creer ou reutiliser les composants dans `src/components/...`.
3. Ajouter la route dans le fichier de routes correspondant.
4. Ajouter un service API dans `src/services/...` si necessaire.
5. Verifier avec `npm run lint` et `npm run build`.
