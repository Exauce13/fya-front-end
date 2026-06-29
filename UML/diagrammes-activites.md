# Diagrammes d'activites - FYA

Ces diagrammes completent les diagrammes de sequence. Ils presentent les flux fonctionnels principaux de la plateforme FYA : visiteurs, clients, artisans et administrateurs.

## 1. Vue d'ensemble du parcours utilisateur

```mermaid
flowchart TD
    A([Debut]) --> B[Acceder a la plateforme FYA]
    B --> C{Utilisateur connecte ?}

    C -- Non --> D[Consulter l'accueil, les metiers, les profils et les appels d'offres publics]
    D --> E{Action protegee souhaitee ?}
    E -- Non --> D
    E -- Oui --> F[S'inscrire ou se connecter]

    C -- Oui --> G[Charger la session et le role]
    F --> G
    G --> H{Role}

    H -- Client --> I[Acceder a l'espace client]
    H -- Artisan --> J[Acceder a l'espace artisan]
    H -- Administrateur --> K[Acceder a l'espace admin]

    I --> L[Publier des appels d'offres, contacter des artisans, suivre les services]
    J --> M[Publier des realisations, postuler aux offres, gerer les services]
    K --> N[Superviser utilisateurs, verifications, signalements, offres et paiements]

    L --> O([Fin])
    M --> O
    N --> O
```

## 2. Inscription et verification email

```mermaid
flowchart TD
    A([Debut]) --> B[Choisir le type de compte]
    B --> C{Type de compte}
    C -- Client --> D[Remplir le formulaire client]
    C -- Artisan --> E[Remplir le formulaire artisan]

    D --> F[Verifier les champs cote frontend]
    E --> F
    F --> G{Formulaire valide ?}
    G -- Non --> H[Afficher les erreurs de saisie]
    H --> D

    G -- Oui --> I[Envoyer la demande d'inscription a l'API]
    I --> J[Valider les donnees cote backend]
    J --> K{Donnees acceptees ?}
    K -- Non --> L[Retourner les erreurs de validation]
    L --> H

    K -- Oui --> M[Creer l'utilisateur et son profil]
    M --> N[Envoyer l'email de verification]
    N --> O[Afficher le message de succes]
    O --> P{Token de session disponible ?}
    P -- Oui --> Q[Enregistrer la session locale]
    P -- Non --> R[Inviter l'utilisateur a se connecter]
    Q --> S[Rediriger vers l'accueil ou le tableau de bord]
    R --> T[Attendre la verification email]
    S --> T
    T --> U[Utilisateur clique sur le lien email]
    U --> V[Verifier la signature du lien]
    V --> W{Lien valide ?}
    W -- Non --> X[Afficher une erreur ou demander un renvoi]
    W -- Oui --> Y[Marquer l'email comme verifie]
    Y --> Z([Fin])
    X --> Z
```

## 3. Connexion et acces selon le role

```mermaid
flowchart TD
    A([Debut]) --> B[Saisir email et mot de passe]
    B --> C[Envoyer POST /api/login]
    C --> D[Verifier les identifiants]
    D --> E{Identifiants valides ?}

    E -- Non --> F[Afficher erreur de connexion]
    F --> B

    E -- Oui --> G{Compte suspendu ?}
    G -- Oui --> H[Refuser l'acces et afficher un blocage]
    H --> Z([Fin])

    G -- Non --> I[Recevoir le token Sanctum et l'utilisateur]
    I --> J[Stocker la session]
    J --> K{Role utilisateur}
    K -- Client --> L[Rediriger vers le tableau de bord client]
    K -- Artisan --> M[Rediriger vers le tableau de bord artisan]
    K -- Admin --> N[Rediriger vers le tableau de bord admin]
    K -- Autre --> O[Rediriger vers l'accueil]
    L --> Z
    M --> Z
    N --> Z
    O --> Z
```

## 4. Recherche d'artisans et consultation d'un profil

```mermaid
flowchart TD
    A([Debut]) --> B[Ouvrir Explorer ou une categorie de metier]
    B --> C[Charger la liste des metiers]
    C --> D[Renseigner les filtres: metier, ville, quartier, certification]
    D --> E[Lancer la recherche d'artisans]
    E --> F[Afficher les resultats]
    F --> G{Resultat choisi ?}
    G -- Non --> D
    G -- Oui --> H[Ouvrir le profil public de l'artisan]

    H --> I[Charger publications, avis et services termines]
    I --> J[Afficher le profil en lecture seule]
    J --> K{Action souhaitee}
    K -- Consulter seulement --> Z([Fin])
    K -- Contacter / commenter / signaler / donner avis --> L{Utilisateur connecte ?}

    L -- Non --> M[Rediriger vers la connexion]
    L -- Oui --> N[Executer l'action demandee]
    M --> Z
    N --> Z
```

## 5. Publication, like et commentaire

```mermaid
flowchart TD
    A([Debut]) --> B{Utilisateur connecte ?}
    B -- Non --> C[Rediriger vers connexion]
    C --> Z([Fin])

    B -- Oui --> D{Action}
    D -- Creer publication --> E{Utilisateur artisan ?}
    E -- Non --> F[Refuser la creation de publication]
    E -- Oui --> G[Saisir le contenu et ajouter medias si besoin]
    G --> H[Envoyer la publication a l'API]
    H --> I[Stocker les medias]
    I --> J[Enregistrer la publication]
    J --> K[Afficher la publication dans le fil]

    D -- Liker --> L[Cliquer sur J'aime]
    L --> M[Creer ou supprimer le like]
    M --> N[Mettre a jour l'etat et le compteur]

    D -- Commenter --> O[Saisir le commentaire]
    O --> P[Envoyer le commentaire]
    P --> Q[Enregistrer le commentaire]
    Q --> R[Afficher le commentaire]

    D -- Consulter commentaires --> S[Charger les commentaires du post]
    S --> T[Afficher le detail de publication]

    F --> Z
    K --> Z
    N --> Z
    R --> Z
    T --> Z
```

## 6. Appel d'offres et candidature artisan

```mermaid
flowchart TD
    A([Debut]) --> B{Role utilisateur}

    B -- Client --> C[Creer un appel d'offres]
    C --> D[Saisir titre, description, metier, lieu, budget et images]
    D --> E[Valider le formulaire]
    E --> F{Formulaire valide ?}
    F -- Non --> G[Afficher les erreurs]
    G --> D
    F -- Oui --> H[Envoyer l'appel d'offres a l'API]
    H --> I[Stocker les pieces jointes]
    I --> J[Enregistrer l'appel d'offres]
    J --> K[Afficher dans Mes appels d'offres]

    B -- Artisan --> L[Consulter le fil des appels d'offres]
    L --> M[Filtrer les offres selon le metier]
    M --> N[Selectionner une offre]
    N --> O[Rediger une proposition et joindre un devis PDF]
    O --> P[Envoyer la candidature]
    P --> Q[Enregistrer la candidature]
    Q --> R[Afficher Candidature envoyee]

    K --> S[Client consulte les candidatures recues]
    S --> T{Candidature acceptee ?}
    T -- Non --> U[Conserver l'appel ouvert ou le cloturer manuellement]
    T -- Oui --> V[Accepter la candidature]
    V --> W[Cloturer l'appel d'offres]
    W --> X[Informer les parties]
    U --> Z([Fin])
    R --> Z
    X --> Z
```

## 7. Messagerie et envoi de messages

```mermaid
flowchart TD
    A([Debut]) --> B{Utilisateur connecte ?}
    B -- Non --> C[Rediriger vers connexion]
    C --> Z([Fin])

    B -- Oui --> D[Cliquer sur Contacter ou ouvrir Messages]
    D --> E[Creer ou retrouver la conversation]
    E --> F[Afficher la discussion]
    F --> G{Type de message}

    G -- Texte --> H[Saisir le texte]
    H --> I[Envoyer le message]

    G -- Image ou video --> J[Selectionner le media]
    J --> K[Uploader le fichier]
    K --> I

    G -- Note vocale --> L[Enregistrer ou selectionner l'audio]
    L --> M[Uploader la note vocale]
    M --> I

    I --> N[Enregistrer le message]
    N --> O[Afficher le message dans la conversation]
    O --> P[Actualiser les messages ou recevoir les evenements temps reel]
    P --> Q{Continuer la conversation ?}
    Q -- Oui --> G
    Q -- Non --> Z
```

## 8. Creation et suivi d'un service

```mermaid
flowchart TD
    A([Debut]) --> B[Artisan et client echangent dans la messagerie]
    B --> C[Artisan propose un service]
    C --> D[Saisir libelle, prix, delai et details]
    D --> E[Creer le service avec statut en_attente]
    E --> F[Client consulte la proposition]
    F --> G{Decision du client}

    G -- Annuler --> H[Passer le service au statut annule]
    H --> Z([Fin])

    G -- Valider --> I[Passer le service au statut en_cours]
    I --> J[Artisan realise la prestation]
    J --> K[Artisan marque le service comme termine]
    K --> L{Confirmation client requise ?}
    L -- Oui --> M[Client confirme la fin du service]
    L -- Non --> N[Service termine]
    M --> N
    N --> O[Ouvrir la page d'avis]
    O --> P{Avis donne ?}
    P -- Non --> Z
    P -- Oui --> Q[Enregistrer l'avis sur l'autre utilisateur]
    Q --> Z
```

## 9. Verification artisan et validation admin

```mermaid
flowchart TD
    A([Debut]) --> B[Artisan ouvre le centre de verification]
    B --> C[Renseigner les informations d'association]
    C --> D[Ajouter les documents justificatifs]
    D --> E[Envoyer la demande de certification]
    E --> F[Stocker les documents]
    F --> G[Creer la demande en cours de verification]
    G --> H[Initialiser le paiement de verification]
    H --> I{Paiement confirme ?}
    I -- Non --> J[Afficher paiement en attente ou echec]
    J --> Z([Fin])

    I -- Oui --> K[Notifier ou rendre visible la demande admin]
    K --> L[Administrateur ouvre les verifications]
    L --> M[Consulter le profil et les documents]
    M --> N{Decision admin}
    N -- Valider --> O[Marquer l'artisan comme certifie]
    N -- Annuler / refuser --> P[Marquer la verification comme annulee]
    O --> Q[Mettre a jour le statut public de l'artisan]
    P --> R[Informer l'artisan]
    Q --> Z
    R --> Z
```

## 10. Signalement et traitement admin

```mermaid
flowchart TD
    A([Debut]) --> B[Utilisateur connecte consulte un profil ou une conversation]
    B --> C[Cliquer sur Signaler]
    C --> D[Saisir motif et description]
    D --> E[Envoyer le signalement]
    E --> F[Valider la cible, le plaignant et le motif]
    F --> G{Signalement valide ?}
    G -- Non --> H[Afficher les erreurs]
    H --> D

    G -- Oui --> I[Enregistrer la plainte avec statut en_attente]
    I --> J[Afficher la confirmation a l'utilisateur]
    J --> K[Administrateur ouvre les signalements]
    K --> L[Consulter les details du signalement]
    L --> M{Decision admin}
    M -- Traiter --> N[Marquer le signalement comme traite]
    M -- Ignorer --> O[Marquer le signalement comme ignore]
    N --> P[Mettre a jour la liste admin]
    O --> P
    P --> Z([Fin])
```

## 11. Administration globale

```mermaid
flowchart TD
    A([Debut]) --> B[Administrateur se connecte]
    B --> C[Verifier le role admin]
    C --> D{Acces autorise ?}
    D -- Non --> E[Refuser l'acces]
    E --> Z([Fin])

    D -- Oui --> F[Charger le tableau de bord admin]
    F --> G[Afficher statistiques et indicateurs]
    G --> H{Module choisi}

    H -- Utilisateurs --> I[Lister et filtrer les utilisateurs]
    I --> J{Action utilisateur}
    J -- Suspendre --> K[Suspendre le compte]
    J -- Reactiver --> L[Reactiver le compte]
    J -- Consulter --> M[Afficher les details]

    H -- Verifications --> N[Lister les demandes de certification]
    N --> O[Valider ou annuler une verification]

    H -- Appels d'offres --> P[Lister les appels d'offres]
    P --> Q[Consulter ou supprimer une offre abusive]

    H -- Signalements --> R[Lister les plaintes]
    R --> S[Traiter ou ignorer le signalement]

    H -- Paiements --> T[Lister les paiements]
    T --> U[Consulter, exporter ou telecharger un recu]

    K --> V[Actualiser les donnees admin]
    L --> V
    M --> V
    O --> V
    Q --> V
    S --> V
    U --> V
    V --> W{Continuer l'administration ?}
    W -- Oui --> H
    W -- Non --> Z
```

