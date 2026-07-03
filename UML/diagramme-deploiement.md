# Diagramme de deploiement local - FYA

Ce diagramme presente l'architecture de deploiement utilisee dans le cadre du projet FYA. La plateforme est executee entierement en local sur une machine de developpement : le frontend React/Vite, le backend Laravel, la base de donnees et le stockage des fichiers fonctionnent sur l'environnement local.

## Architecture de deploiement local

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 35, "rankSpacing": 45}}}%%
flowchart LR
    U[Utilisateur<br/>Navigateur web] -->|http://localhost:5173| FRONT[Serveur local Vite<br/>Frontend React]

    FRONT -->|Requetes HTTP / API<br/>VITE_API_BASE_URL| API[Serveur local Laravel<br/>Backend REST API]

    API -->|Lecture / ecriture| DB[(Base de donnees locale<br/>MySQL)]
    API -->|Stockage fichiers| FS[(Stockage local Laravel<br/>storage/app/public<br/>public/storage)]
    API -->|Emails de test| MAIL[Mail local / logs Laravel]
    API -->|Paiement de test| PAY[Retour sandbox / simulation locale]

    API -->|Reponses JSON| FRONT
    FRONT -->|Affichage interface| U

    classDef user fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef app fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef data fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class U user
    class FRONT,API app
    class DB,FS,MAIL,PAY data
```

## Vue UML simplifiee

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 35, "rankSpacing": 45}}}%%
flowchart TD
    subgraph Poste["Machine locale de developpement"]
        Browser[Navigateur<br/>Interface FYA]

        subgraph Frontend["Frontend local"]
            Vite[Vite dev server<br/>React + CSS + assets]
        end

        subgraph Backend["Backend local"]
            Laravel[Application Laravel<br/>API REST + Sanctum]
            Storage[Stockage local<br/>images, videos, PDF, audio]
            Database[(MySQL local)]
            Mail[Emails de test<br/>log ou mailer local]
            Payment[Paiement test<br/>sandbox ou simulation]
        end
    end

    Browser -->|http://localhost:5173| Vite
    Vite -->|HTTP vers /api| Laravel
    Laravel -->|Authentification| Laravel
    Laravel -->|Lecture / ecriture| Database
    Laravel -->|Upload / lecture fichiers| Storage
    Laravel -->|Lien reset / verification| Mail
    Laravel -->|Verification artisan| Payment
    Laravel -->|JSON + URLs medias| Vite
    Vite -->|Pages FYA| Browser

    classDef node fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    classDef data fill:#FFF4DE,stroke:#B7791F,color:#182433,font-size:14px
    class Browser,Vite,Laravel node
    class Storage,Database,Mail,Payment data
```

## Flux de lancement local

```mermaid
%%{init: {"theme": "base", "themeVariables": {"fontFamily": "Arial", "fontSize": "14px", "primaryColor": "#EEF6FF", "primaryBorderColor": "#145DA0", "lineColor": "#4B5563", "textColor": "#182433"}, "flowchart": {"curve": "basis", "nodeSpacing": 30, "rankSpacing": 42}}}%%
flowchart TD
    A([Debut]) --> B[Installer les dependances frontend]
    B --> C[Configurer .env frontend]
    C --> D[Definir VITE_API_BASE_URL]
    D --> E[Lancer npm run dev]

    A --> F[Installer les dependances backend]
    F --> G[Configurer .env Laravel]
    G --> H[Configurer MySQL local]
    H --> I[Executer migrations et seeders]
    I --> J[Creer le lien de stockage]
    J --> K[Lancer le serveur Laravel]

    E --> L[Frontend disponible en local]
    K --> M[API disponible en local]
    L --> N[Ouvrir le navigateur]
    M --> N
    N --> O[Tester les parcours FYA]
    O --> P([Fin])

    classDef start fill:#E9F7EF,stroke:#1E7E34,color:#182433,font-size:14px
    classDef action fill:#EEF6FF,stroke:#145DA0,color:#182433,font-size:14px
    class A,P start
    class B,C,D,E,F,G,H,I,J,K,L,M,N,O action
```

## Remarque pour le memoire

Dans ce contexte, il ne s'agit pas d'un deploiement en production. Le diagramme montre plutot un deploiement local de developpement, ou tous les composants sont executes sur la meme machine. Les plateformes comme Vercel, InterServer ou un CDN ne sont donc pas representees.
