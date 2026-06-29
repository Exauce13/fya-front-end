# Diagramme de deploiement - FYA

Ce diagramme presente l'architecture de deploiement de FYA : le frontend React/Vite est deploye sur Vercel, tandis que le backend Laravel est heberge sur InterServer.

## Architecture de deploiement

```mermaid
flowchart LR
    U[Utilisateur<br/>Navigateur web ou mobile] -->|HTTPS| V[Vercel<br/>Frontend React + Vite<br/>Build statique + CDN]

    V -->|Requetes API HTTPS<br/>VITE_API_BASE_URL| API[InterServer<br/>Serveur web Apache/Nginx<br/>Backend Laravel REST API]

    U -->|Chargement images/fichiers publics<br/>HTTPS| API

    API -->|Lecture / ecriture| DB[(Base de donnees MySQL<br/>Utilisateurs, artisans, clients,<br/>offres, services, messages, avis)]
    API -->|Stockage fichiers| FS[(Stockage serveur InterServer<br/>public/storage<br/>photos, devis, documents, medias)]
    API -->|Emails de verification| MAIL[Service SMTP / Email]
    API -->|Paiements verification<br/>callbacks| PAY[FedaPay]
    API -->|Broadcasting / notifications| PUSH[Pusher / Laravel Echo]

    PUSH -->|Evenements temps reel| V
    PAY -->|Confirmation paiement| API
    MAIL -->|Lien de verification| U
```

## Vue UML simplifiee

```mermaid
flowchart TD
    subgraph Client["Poste utilisateur"]
        Browser[Navigateur<br/>Interface FYA]
    end

    subgraph Vercel["Plateforme Vercel"]
        Front[Application React/Vite<br/>HTML, CSS, JS, assets]
        CDN[CDN Vercel]
        Front --> CDN
    end

    subgraph InterServer["Hebergement InterServer"]
        Web[Serveur web<br/>Apache ou Nginx]
        Laravel[Application Laravel<br/>API REST + Sanctum]
        Storage[Stockage public<br/>images, videos, PDF, audio]
        Database[(MySQL)]
        Web --> Laravel
        Laravel --> Database
        Laravel --> Storage
    end

    subgraph Services["Services externes"]
        Email[Service email SMTP]
        Fedapay[FedaPay]
        Realtime[Pusher / WebSocket]
    end

    Browser -->|HTTPS| CDN
    CDN -->|Livre le frontend| Browser
    Browser -->|HTTPS /api| Web
    Browser -->|Bearer token Sanctum| Laravel
    Laravel -->|Verification email| Email
    Laravel -->|Paiement certification| Fedapay
    Fedapay -->|Callback paiement| Laravel
    Laravel -->|Evenements| Realtime
    Realtime -->|Notifications / messages| Browser
```

## Flux de deploiement

```mermaid
flowchart TD
    A([Debut]) --> B[Developpeur pousse le code frontend sur GitHub]
    B --> C[Vercel detecte le commit]
    C --> D[Installer les dependances frontend]
    D --> E[Executer le build React/Vite]
    E --> F[Publier les fichiers statiques sur le CDN Vercel]

    A --> G[Developpeur pousse ou transfere le backend Laravel vers InterServer]
    G --> H[Configurer le fichier .env Laravel]
    H --> I[Installer les dependances Composer]
    I --> J[Executer migrations et configuration de stockage]
    J --> K[Configurer le serveur web vers le dossier public Laravel]

    F --> L[Configurer VITE_API_BASE_URL vers l'URL InterServer /api]
    K --> M[Configurer CORS et Sanctum pour autoriser le domaine Vercel]
    L --> N[Frontend disponible en production]
    M --> O[Backend disponible en production]
    N --> P[Utilisateur accede a FYA]
    O --> P
    P --> Q([Fin])
```

