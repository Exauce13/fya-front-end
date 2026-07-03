# Diagrammes d'activites - FYA

Ce fichier contient des diagrammes d'activites prets a etre integres dans un memoire au format A4. Les flux ont ete decoupes en plusieurs diagrammes courts afin d'eviter les figures trop longues, difficiles a lire ou mal adaptees a une page.

## Recommandations d'insertion A4

- Inserer un seul diagramme par figure.
- Exporter chaque diagramme en SVG ou PNG haute resolution.
- Utiliser une orientation portrait pour les diagrammes verticaux.
- Utiliser une orientation paysage seulement si le diagramme parait trop large.
- Garder une taille de texte entre 13 px et 15 px.
- Eviter les libelles trop longs dans les noeuds : preferer des formulations courtes.

Pour agrandir ou reduire les textes, modifier `fontSize` et les `font-size` dans le bloc Mermaid du diagramme concerne.

## Style Mermaid conseille

Chaque diagramme contient sa propre configuration Mermaid afin de pouvoir etre copie, exporte et insere separement dans le memoire.

## 1. Parcours general d'un utilisateur

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 30, "rankSpacing": 42}}}%%
flowchart TD
    A([Debut]) --> B[Acceder a FYA]
    B --> C{Utilisateur connecte ?}

    C -- Non --> D[Consulter les contenus publics]
    D --> E{Action protegee ?}
    E -- Non --> D
    E -- Oui --> F[Connexion ou inscription]

    C -- Oui --> G[Charger la session]
    F --> G
    G --> H{Role}

    H -- Client --> I[Espace client]
    H -- Artisan --> J[Espace artisan]
    H -- Admin --> K[Espace administration]

    I --> L[Utiliser les services client]
    J --> M[Utiliser les services artisan]
    K --> N[Superviser la plateforme]

    L --> Z([Fin])
    M --> Z
    N --> Z

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class B,D,F,G,I,J,K,L,M,N action
    class C,E,H decision
```

## 2. Inscription d'un client ou d'un artisan

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 30, "rankSpacing": 42}}}%%
flowchart TD
    A([Debut]) --> B[Choisir le type de compte]
    B --> C{Type de compte}

    C -- Client --> D[Remplir formulaire client]
    C -- Artisan --> E[Remplir formulaire artisan]

    D --> F[Controler les champs]
    E --> F
    F --> G{Formulaire valide ?}

    G -- Non --> H[Afficher les erreurs]
    H --> D

    G -- Oui --> I[Envoyer a l'API]
    I --> J[Valider cote backend]
    J --> K{Donnees acceptees ?}

    K -- Non --> H
    K -- Oui --> L[Creer le compte]
    L --> M[Creer le profil]
    M --> N[Afficher le succes]
    N --> Z([Fin])

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class B,D,E,F,H,I,J,L,M,N action
    class C,G,K decision
```

## 3. Connexion et redirection selon le role

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 30, "rankSpacing": 42}}}%%
flowchart TD
    A([Debut]) --> B[Saisir email et mot de passe]
    B --> C[Envoyer la demande de connexion]
    C --> D[Verifier les identifiants]
    D --> E{Identifiants valides ?}

    E -- Non --> F[Afficher une erreur]
    F --> B

    E -- Oui --> G{Compte actif ?}
    G -- Non --> H[Refuser l'acces]
    H --> Z([Fin])

    G -- Oui --> I[Recevoir le token]
    I --> J[Enregistrer la session]
    J --> K{Role}

    K -- Client --> L[Rediriger vers client]
    K -- Artisan --> M[Rediriger vers artisan]
    K -- Admin --> N[Rediriger vers admin]
    K -- Autre --> O[Rediriger vers accueil]

    L --> Z
    M --> Z
    N --> Z
    O --> Z

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class B,C,D,F,H,I,J,L,M,N,O action
    class E,G,K decision
```

## 4. Recherche et consultation d'un artisan

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 30, "rankSpacing": 42}}}%%
flowchart TD
    A([Debut]) --> B[Ouvrir Explorer]
    B --> C[Choisir metier ou ville]
    C --> D[Lancer la recherche]
    D --> E[Afficher les artisans]
    E --> F{Artisan choisi ?}

    F -- Non --> C
    F -- Oui --> G[Ouvrir le profil]
    G --> H[Afficher infos et avis]
    H --> I{Action souhaitee ?}

    I -- Consulter --> Z([Fin])
    I -- Contacter --> J{Utilisateur connecte ?}
    I -- Commenter --> J
    I -- Signaler --> J

    J -- Non --> K[Rediriger vers connexion]
    J -- Oui --> L[Executer l'action]
    K --> Z
    L --> Z

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class B,C,D,E,G,H,K,L action
    class F,I,J decision
```

## 5. Publication artisan, reactions et commentaires

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 30, "rankSpacing": 42}}}%%
flowchart TD
    A([Debut]) --> B{Utilisateur connecte ?}
    B -- Non --> C[Rediriger vers connexion]
    C --> Z([Fin])

    B -- Oui --> D{Action}

    D -- Publier --> E{Role artisan ?}
    E -- Non --> F[Refuser la publication]
    E -- Oui --> G[Saisir texte et medias]
    G --> H[Envoyer a l'API]
    H --> I[Enregistrer le post]

    D -- Aimer --> J[Cliquer sur J'aime]
    J --> K[Mettre a jour le like]

    D -- Commenter --> L[Saisir commentaire]
    L --> M[Enregistrer commentaire]

    I --> N[Actualiser le fil]
    K --> N
    M --> N
    F --> Z
    N --> Z

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class C,F,G,H,I,J,K,L,M,N action
    class B,D,E decision
```

## 6. Appel d'offres et candidature artisan

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 28, "rankSpacing": 38}}}%%
flowchart TD
    A([Debut]) --> B{Role}

    B -- Client --> C[Creer un appel d'offres]
    C --> D[Renseigner les details]
    D --> E{Formulaire valide ?}
    E -- Non --> F[Afficher erreurs]
    F --> D
    E -- Oui --> G[Publier l'offre]

    B -- Artisan --> H[Consulter les offres]
    H --> I[Choisir une offre]
    I --> J[Rediger une proposition]
    J --> K[Envoyer candidature]

    G --> L[Recevoir candidatures]
    K --> M[Notifier le client]
    M --> L
    L --> N{Candidature acceptee ?}

    N -- Non --> O[Offre reste ouverte]
    N -- Oui --> P[Accepter la candidature]
    P --> Q[Cloturer l'offre]
    O --> Z([Fin])
    Q --> Z

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class C,D,F,G,H,I,J,K,L,M,O,P,Q action
    class B,E,N decision
```

## 7. Messagerie entre client et artisan

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 30, "rankSpacing": 42}}}%%
flowchart TD
    A([Debut]) --> B{Utilisateur connecte ?}
    B -- Non --> C[Rediriger vers connexion]
    C --> Z([Fin])

    B -- Oui --> D[Ouvrir une conversation]
    D --> E[Charger les messages]
    E --> F{Type de message}

    F -- Texte --> G[Saisir le message]
    F -- Media --> H[Selectionner le fichier]
    F -- Vocal --> I[Enregistrer l'audio]

    G --> J[Envoyer]
    H --> J
    I --> J

    J --> K[Enregistrer le message]
    K --> L[Afficher dans la discussion]
    L --> M{Continuer ?}
    M -- Oui --> F
    M -- Non --> Z

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class C,D,E,G,H,I,J,K,L action
    class B,F,M decision
```

## 8. Creation et suivi d'un service

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 30, "rankSpacing": 42}}}%%
flowchart TD
    A([Debut]) --> B[Echange client-artisan]
    B --> C[Artisan propose un service]
    C --> D[Client consulte]
    D --> E{Decision client}

    E -- Refuser --> F[Annuler le service]
    F --> Z([Fin])

    E -- Accepter --> G[Service en cours]
    G --> H[Artisan realise la prestation]
    H --> I[Artisan marque termine]
    I --> J[Client confirme]
    J --> K[Service termine]
    K --> L{Avis donne ?}

    L -- Non --> Z
    L -- Oui --> M[Enregistrer l'avis]
    M --> Z

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class B,C,D,F,G,H,I,J,K,M action
    class E,L decision
```

## 9. Verification artisan et paiement sandbox

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 28, "rankSpacing": 38}}}%%
flowchart TD
    A([Debut]) --> B[Artisan ouvre verification]
    B --> C[Renseigner les informations]
    C --> D[Ajouter les documents]
    D --> E[Envoyer la demande]
    E --> F[Initialiser le paiement]
    F --> G{Paiement reussi ?}

    G -- Non --> H[Afficher echec ou attente]
    H --> Z([Fin])

    G -- Oui --> I[Afficher paiement reussi]
    I --> J[Transmettre a l'admin]
    J --> K[Admin consulte le dossier]
    K --> L{Decision admin}

    L -- Valider --> M[Certifier l'artisan]
    L -- Refuser --> N[Refuser la verification]
    M --> O[Mettre a jour le profil]
    N --> P[Informer l'artisan]
    O --> Z
    P --> Z

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class B,C,D,E,F,H,I,J,K,M,N,O,P action
    class G,L decision
```

## 10. Mot de passe oublie

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 30, "rankSpacing": 42}}}%%
flowchart TD
    A([Debut]) --> B[Ouvrir mot de passe oublie]
    B --> C[Saisir l'adresse email]
    C --> D[Envoyer la demande]
    D --> E{Email connu ?}

    E -- Non --> F[Afficher un message neutre]
    E -- Oui --> G[Generer un token]
    G --> H[Envoyer le lien par email]

    F --> I[Utilisateur consulte sa boite]
    H --> I
    I --> J[Ouvrir le lien de reset]
    J --> K{Lien valide ?}

    K -- Non --> L[Afficher lien invalide]
    L --> Z([Fin])

    K -- Oui --> M[Saisir nouveau mot de passe]
    M --> N[Mettre a jour le mot de passe]
    N --> O[Rediriger vers connexion]
    O --> Z

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class B,C,D,F,G,H,I,J,L,M,N,O action
    class E,K decision
```

## 11. Signalement et traitement administratif

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 30, "rankSpacing": 42}}}%%
flowchart TD
    A([Debut]) --> B[Utilisateur signale un contenu]
    B --> C[Saisir le motif]
    C --> D[Envoyer le signalement]
    D --> E{Signalement valide ?}

    E -- Non --> F[Afficher les erreurs]
    F --> C

    E -- Oui --> G[Enregistrer la plainte]
    G --> H[Notifier l'administration]
    H --> I[Admin consulte le signalement]
    I --> J{Decision}

    J -- Traiter --> K[Marquer comme traite]
    J -- Ignorer --> L[Marquer comme ignore]
    K --> M[Actualiser le tableau admin]
    L --> M
    M --> Z([Fin])

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class B,C,D,F,G,H,I,K,L,M action
    class E,J decision
```

## 12. Administration globale

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 28, "rankSpacing": 38}}}%%
flowchart TD
    A([Debut]) --> B[Admin se connecte]
    B --> C{Acces autorise ?}

    C -- Non --> D[Refuser l'acces]
    D --> Z([Fin])

    C -- Oui --> E[Charger tableau de bord]
    E --> F{Module choisi}

    F -- Utilisateurs --> G[Gerer les comptes]
    F -- Verifications --> H[Traiter les certifications]
    F -- Offres --> I[Controler les appels d'offres]
    F -- Signalements --> J[Traiter les plaintes]
    F -- Paiements --> K[Consulter les paiements]

    G --> L[Actualiser les donnees]
    H --> L
    I --> L
    J --> L
    K --> L

    L --> M{Continuer ?}
    M -- Oui --> F
    M -- Non --> Z

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef decision fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class A,Z start
    class B,D,E,G,H,I,J,K,L action
    class C,F,M decision
```
