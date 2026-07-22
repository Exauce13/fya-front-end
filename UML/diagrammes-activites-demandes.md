# Diagrammes d'activites demandes

Ce fichier contient uniquement les diagrammes d'activites suivants :

- Inscription
- Appel d'offres
- Candidature a un appel d'offres
- Recherche d'un artisan
- Services
- Publications
- Likes
- Commentaires

Les diagrammes sont au format Mermaid et peuvent etre importes dans Draw.io.

## 1. Inscription

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "13px", "primaryColor": "#FFFFFF", "primaryBorderColor": "#222222", "lineColor": "#222222", "textColor": "#111111"}, "flowchart": {"curve": "linear", "nodeSpacing": 28, "rankSpacing": 34}}}%%
flowchart TD
    A((Debut)) --> B[Le visiteur ouvre la page d'inscription]
    B --> C[Le visiteur choisit le type de compte]
    C --> D[Le visiteur renseigne le formulaire]
    D --> E[Le visiteur soumet le formulaire]
    E --> F{Formulaire complet ?}

    F -- non --> G[Afficher les champs manquants]
    G --> D

    F -- oui --> H[Verifier l'adresse email]
    H --> I{Email deja utilise ?}

    I -- oui --> J[Afficher un message d'erreur]
    J --> D

    I -- non --> K[Creer le compte utilisateur]
    K --> L[Creer le profil associe]
    L --> M[Envoyer la confirmation]
    M --> N[L'utilisateur recoit la confirmation]
    N --> Z((Fin))
```

## 2. Appel d'offres

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "13px", "primaryColor": "#FFFFFF", "primaryBorderColor": "#222222", "lineColor": "#222222", "textColor": "#111111"}, "flowchart": {"curve": "linear", "nodeSpacing": 28, "rankSpacing": 34}}}%%
flowchart TD
    A((Debut)) --> B[Le client se connecte]
    B --> C[Le client accede aux appels d'offres]
    C --> D[Le client cree un appel d'offres]
    D --> E[Renseigner les informations de l'offre]
    E --> F[Ajouter les pieces jointes]
    F --> G[Soumettre l'appel d'offres]
    G --> H{Donnees valides ?}

    H -- non --> I[Afficher les erreurs]
    I --> E

    H -- oui --> J[Publier l'appel d'offres]
    J --> K[Enregistrer l'appel d'offres]
    K --> L[Afficher la confirmation]
    L --> Z((Fin))
```

## 3. Candidature a un appel d'offres

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "13px", "primaryColor": "#FFFFFF", "primaryBorderColor": "#222222", "lineColor": "#222222", "textColor": "#111111"}, "flowchart": {"curve": "linear", "nodeSpacing": 28, "rankSpacing": 34}}}%%
flowchart TD
    A((Debut)) --> B[L'artisan se connecte]
    B --> C[L'artisan consulte les appels d'offres]
    C --> D[L'artisan selectionne une offre]
    D --> E{Offre encore active ?}

    E -- non --> F[Afficher que l'offre est indisponible]
    F --> Z((Fin))

    E -- oui --> G[Afficher les details de l'offre]
    G --> H{L'artisan veut postuler ?}

    H -- non --> Z
    H -- oui --> I[Remplir le formulaire de candidature]
    I --> J[Ajouter une proposition ou un devis]
    J --> K[Soumettre la candidature]
    K --> L{Candidature deja envoyee ?}

    L -- oui --> M[Afficher un message de refus]
    M --> Z

    L -- non --> N[Enregistrer la candidature]
    N --> O[Notifier le client]
    O --> P[Afficher la confirmation]
    P --> Z
```

## 4. Recherche d'un artisan

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "13px", "primaryColor": "#FFFFFF", "primaryBorderColor": "#222222", "lineColor": "#222222", "textColor": "#111111"}, "flowchart": {"curve": "linear", "nodeSpacing": 28, "rankSpacing": 34}}}%%
flowchart TD
    A((Debut)) --> B[L'utilisateur va dans Explorer]
    B --> C[L'utilisateur choisit les criteres de recherche]
    C --> D[Le systeme affiche les artisans correspondants]
    D --> E[L'utilisateur choisit un artisan]
    E --> F[L'utilisateur clique sur le profil]
    F --> G[Le systeme affiche le profil de l'artisan]
    G --> H[L'utilisateur contacte l'artisan]
    H --> Z((Fin))
```

## 5. Services

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "13px", "primaryColor": "#FFFFFF", "primaryBorderColor": "#222222", "lineColor": "#222222", "textColor": "#111111"}, "flowchart": {"curve": "linear", "nodeSpacing": 28, "rankSpacing": 34}}}%%
flowchart TD
    A((Debut)) --> B[L'artisan se connecte]
    B --> C[L'artisan accede a ses services]
    C --> D[L'artisan choisit d'ajouter un service]
    D --> E[Renseigner les informations du service]
    E --> F[Ajouter une image ou un document]
    F --> G[Soumettre le service]
    G --> H{Donnees valides ?}

    H -- non --> I[Afficher les erreurs]
    I --> E

    H -- oui --> J[Enregistrer le service]
    J --> K[Publier le service]
    K --> L[Afficher le service aux clients]
    L --> M[Le client consulte le service]
    M --> N{Client interesse ?}

    N -- non --> Z((Fin))
    N -- oui --> O[Le client contacte l'artisan]
    O --> P[Demarrer l'echange]
    P --> Z
```

## 6. Publications

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "13px", "primaryColor": "#FFFFFF", "primaryBorderColor": "#222222", "lineColor": "#222222", "textColor": "#111111"}, "flowchart": {"curve": "linear", "nodeSpacing": 28, "rankSpacing": 34}}}%%
flowchart TD
    A((Debut)) --> B[L'utilisateur se connecte]
    B --> C[L'utilisateur ouvre la page des publications]
    C --> D[L'utilisateur choisit de creer une publication]
    D --> E[Saisir le contenu de la publication]
    E --> F[Ajouter un media si necessaire]
    F --> G[Soumettre la publication]
    G --> H{Contenu valide ?}

    H -- non --> I[Afficher les erreurs]
    I --> E

    H -- oui --> J[Enregistrer la publication]
    J --> K[Afficher la publication dans le fil]
    K --> L[Notifier ou actualiser les abonnes]
    L --> M[Les utilisateurs consultent la publication]
    M --> Z((Fin))
```

## 7. Likes

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "13px", "primaryColor": "#FFFFFF", "primaryBorderColor": "#222222", "lineColor": "#222222", "textColor": "#111111"}, "flowchart": {"curve": "linear", "nodeSpacing": 28, "rankSpacing": 34}}}%%
flowchart TD
    A((Debut)) --> B[L'utilisateur se connecte]
    B --> C[L'utilisateur consulte une publication]
    C --> D[L'utilisateur clique sur J'aime]
    D --> E{Utilisateur deja connecte ?}

    E -- non --> F[Rediriger vers la connexion]
    F --> Z((Fin))

    E -- oui --> G{Publication deja aimee ?}
    G -- oui --> H[Retirer le like]
    G -- non --> I[Ajouter le like]

    H --> J[Mettre a jour le compteur]
    I --> J
    J --> K[Afficher le nouvel etat du like]
    K --> Z
```

## 8. Commentaires

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "13px", "primaryColor": "#FFFFFF", "primaryBorderColor": "#222222", "lineColor": "#222222", "textColor": "#111111"}, "flowchart": {"curve": "linear", "nodeSpacing": 28, "rankSpacing": 34}}}%%
flowchart TD
    A((Debut)) --> B[L'utilisateur se connecte]
    B --> C[L'utilisateur consulte une publication]
    C --> D[L'utilisateur saisit un commentaire]
    D --> E[L'utilisateur soumet le commentaire]
    E --> F{Commentaire vide ?}

    F -- oui --> G[Afficher un message d'erreur]
    G --> D

    F -- non --> H{Contenu autorise ?}
    H -- non --> I[Refuser le commentaire]
    I --> D

    H -- oui --> J[Enregistrer le commentaire]
    J --> K[Associer le commentaire a la publication]
    K --> L[Afficher le commentaire]
    L --> M[Mettre a jour le nombre de commentaires]
    M --> Z((Fin))
```
