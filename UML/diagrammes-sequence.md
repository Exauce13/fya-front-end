# Diagrammes de sequence - FYA

Ces diagrammes sont prepares pour une soutenance. Ils decrivent les principaux parcours de la plateforme FYA en s'appuyant sur les routes du backend Laravel.

## 1. Inscription et verification email

```mermaid
%%{init: {'themeVariables': { 'fontSize': '20px'}}}%%
flowchart TD
A[Texte en 20px] --> B(Autre texte)
sequenceDiagram
    actor U as Utilisateur
    participant F as Frontend React
    participant API as API Laravel
    participant DB as Base de donnees
    participant Mail as Service email

    U->>F: Remplit le formulaire d'inscription
    F->>F: Verifie les champs et le mot de passe
    F->>API: POST /api/register/client ou /api/register/artisan
    API->>API: Valide email, telephone, mot de passe et role
    API->>DB: Cree User + Client ou Artisan
    API->>Mail: Envoie le lien de verification email
    API-->>F: Retourne succes + utilisateur/token si disponible
    F->>F: Affiche "Inscription reussie, validez l'email"
    U->>F: Clique sur OK
    F->>F: Cree la session locale si token disponible
    F-->>U: Redirection vers l'accueil

    U->>API: GET /api/email/verify/{id}/{hash}
    API->>DB: Marque email_verified_at
    API-->>U: Email verifie
```

## 2. Connexion et acces selon le role

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant F as Frontend React
    participant API as API Laravel
    participant DB as Base de donnees

    U->>F: Saisit email et mot de passe
    F->>API: POST /api/login
    API->>DB: Recherche l'utilisateur
    API->>API: Verifie le mot de passe et le statut du compte

    alt Identifiants invalides
        API-->>F: Erreur de validation/authentification
        F-->>U: Affiche l'erreur
    else Compte suspendu
        API-->>F: Utilisateur avec status suspendu
        F-->>U: Page 404 / Compte suspendu sur routes protegees
    else Connexion valide
        API-->>F: Token Sanctum + utilisateur
        F->>F: Stocke la session
        F-->>U: Redirection selon role
    end
```

## 3. Recherche d'artisans et consultation publique du profil

```mermaid
sequenceDiagram
    actor V as Visiteur ou utilisateur
    participant F as Frontend React
    participant API as API Laravel
    participant DB as Base de donnees

    V->>F: Ouvre Explorer ou clique sur une categorie
    F->>API: GET /api/metiers
    API->>DB: Recupere les metiers
    API-->>F: Liste des metiers

    F->>API: GET /api/recherche-artisans?metier_id=&ville=&quartier=&certifie=
    API->>DB: Recherche artisans selon filtres
    API-->>F: Liste artisans + user + metier
    F-->>V: Affiche les resultats

    V->>F: Clique sur un artisan
    F->>API: GET /api/artisans/{artisan}/posts
    F->>API: GET /api/artisans/{artisan}/avis
    F->>API: GET /api/services/artisans/{artisan}
    API->>DB: Recupere profil public, posts, avis et services termines
    API-->>F: Donnees publiques
    F-->>V: Affiche profil en lecture seule

    opt Action protegee
        V->>F: Clique contacter, liker, commenter, signaler ou donner avis
        F-->>V: Redirection vers connexion ou blocage d'action
    end
```

## 4. Publication, like et commentaire

```mermaid
sequenceDiagram
    actor A as Artisan
    actor U as Utilisateur connecte
    participant F as Frontend React
    participant API as API Laravel
    participant DB as Base de donnees
    participant Storage as Stockage fichiers

    A->>F: Cree une publication service ou realisation
    F->>API: POST /api/posts/creerposts
    API->>Storage: Stocke images/videos si presentes
    API->>DB: Enregistre Post
    API-->>F: Publication creee
    F-->>A: Ajoute la publication dans le fil sans rechargement

    U->>F: Like la publication
    F->>API: POST /api/posts/{postid}/like
    API->>DB: Cree ou supprime Like
    API-->>F: Etat like + compteur
    F-->>U: Met a jour couleur, texte et compteur

    U->>F: Ajoute un commentaire
    F->>API: POST /api/posts/commentaires
    API->>DB: Enregistre Commentaire
    API-->>F: Commentaire cree
    F-->>U: Affiche le commentaire

    U->>F: Consulte les commentaires
    F->>API: GET /api/{post}/commentaires
    API->>DB: Liste les commentaires
    API-->>F: Commentaires
    F-->>U: Affiche la page detail publication
```

## 5. Appel d'offres et candidature artisan

```mermaid
sequenceDiagram
    actor C as Client
    actor A as Artisan
    participant F as Frontend React
    participant API as API Laravel
    participant DB as Base de donnees
    participant Storage as Stockage fichiers

    C->>F: Publie un appel d'offres
    F->>API: POST /api/appeloffres/appeloffres
    API->>Storage: Stocke les images jointes
    API->>DB: Enregistre AppelOffre
    API-->>F: Appel d'offres cree
    F-->>C: Affiche dans Mes appels d'offres

    A->>F: Ouvre Tous les appels d'offres
    F->>API: GET /api/appeloffres/feed-appels-offres
    API->>DB: Filtre par metier de l'artisan
    API-->>F: Appels d'offres compatibles
    F-->>A: Affiche les offres

    A->>F: Postule avec description et devis PDF
    F->>API: POST /api/appeloffres/appels-offres/{appelOffre}/postuler
    API->>Storage: Stocke le devis PDF
    API->>DB: Enregistre Candidature
    API-->>F: Candidature envoyee
    F-->>A: Bouton devient "Candidature envoyee"

    C->>F: Ouvre son appel d'offres
    F->>API: GET /api/appeloffres/mes-appels-offres
    API->>DB: Recupere offres + candidatures
    API-->>F: Liste des candidatures
    F-->>C: Affiche artisans, description et devis telechargeable

    C->>F: Accepte une candidature
    F->>API: PATCH /api/appeloffres/candidatures/{candidature}/accepter
    API->>DB: Accepte candidature et cloture l'appel
    API-->>F: Appel cloture
    F-->>C: Redirection vers appels d'offres
```

## 6. Messagerie texte, image, video et note vocale

```mermaid
sequenceDiagram
    actor U1 as Utilisateur 1
    actor U2 as Utilisateur 2
    participant F as Frontend React
    participant API as API Laravel
    participant DB as Base de donnees
    participant Storage as Stockage fichiers

    U1->>F: Clique contacter
    F->>API: POST /api/messagerie/conversations
    API->>DB: Cree ou retrouve la conversation
    API-->>F: Conversation
    F-->>U1: Ouvre la discussion

    U1->>F: Envoie un texte
    F->>API: POST /api/messagerie/conversations/{conversation}/messages
    API->>DB: Enregistre message
    API-->>F: Message cree
    F-->>U1: Affiche le message

    U1->>F: Envoie image ou video
    F->>API: POST /api/messagerie/messages/upload
    API->>Storage: Stocke media temporaire
    API-->>F: URL media
    F->>API: POST /api/messagerie/conversations/{conversation}/messages
    API->>DB: Enregistre message avec media
    API-->>F: Message cree

    U1->>F: Envoie une note vocale
    F->>API: POST /api/messagerie/messages/voice/upload
    API->>Storage: Stocke audio
    API-->>F: Donnees voice_note
    F->>API: POST /api/messagerie/conversations/{conversation}/messages
    API->>DB: Enregistre message vocal
    API-->>F: Message vocal cree

    loop Actualisation courte
        F->>API: GET /api/messagerie/conversations/{conversation}/messages
        API->>DB: Recupere nouveaux messages
        API-->>F: Messages pagines
        F-->>U1: Met a jour la discussion sans rechargement page
    end
```

## 7. Creation et suivi d'un service depuis la messagerie

```mermaid
sequenceDiagram
    actor A as Artisan
    actor C as Client
    participant F as Frontend React
    participant API as API Laravel
    participant DB as Base de donnees

    A->>F: Ajoute un service dans la conversation
    F->>API: POST /api/services/services
    API->>DB: Cree Service statut en_attente
    API-->>F: Service propose
    F-->>A: Affiche service en attente

    C->>F: Consulte Mes Services ou la messagerie
    F->>API: GET /api/services/clients/{client}
    API->>DB: Recupere services du client
    API-->>F: Services par statut
    F-->>C: Affiche service a valider

    alt Le client valide
        C->>F: Clique Valider
        F->>API: PATCH /api/services/{service}/valider
        API->>DB: Passe statut en_cours
        API-->>F: Service en cours
    else Le client annule
        C->>F: Clique Annuler
        F->>API: PATCH /api/services/{service}/annuler
        API->>DB: Passe statut annule
        API-->>F: Service annule
    end

    A->>F: Marque le service termine
    F->>API: PATCH /api/services/{service}/terminer
    API->>DB: Marque confirmation artisan
    API-->>F: Etat du service
    F-->>A: Ouvre la page d'avis

    C->>F: Confirme la fin si necessaire
    F->>API: PATCH /api/services/{service}/terminer
    API->>DB: Marque service terminer
    API-->>F: Service termine
    F-->>C: Ouvre la page d'avis

    A->>F: Donne avis sur client
    F->>API: POST /api/avis/users/{user}
    API->>DB: Enregistre Avis
    API-->>F: Avis enregistre

    C->>F: Donne avis sur artisan
    F->>API: POST /api/avis/users/{user}
    API->>DB: Enregistre Avis
    API-->>F: Avis enregistre
```

## 8. Verification artisan et validation admin

```mermaid
sequenceDiagram
    actor A as Artisan
    actor Admin as Administrateur
    participant F as Frontend React
    participant API as API Laravel
    participant DB as Base de donnees
    participant Storage as Stockage fichiers
    participant Pay as FedaPay

    A->>F: Lance "Se faire verifier"
    F->>API: POST /api/artisans/demande-certification
    API->>Storage: Stocke CIP et diplome PDF
    API->>DB: Enregistre infos association + statut verification en cours
    API->>Pay: Demande paiement verification 1000 FCFA
    Pay-->>API: Statut paiement ou callback
    API-->>F: Paiement pending ou succes
    F-->>A: Affiche verification en cours

    Admin->>F: Ouvre espace admin > Verifications
    F->>API: GET /api/admin/verifications
    API->>DB: Recupere demandes de verification
    API-->>F: Liste demandes + documents
    F-->>Admin: Affiche les artisans a verifier

    Admin->>F: Consulte ou telecharge documents
    F->>API: GET /api/admin/verifications/{artisan}/documents/{document}/download
    API->>Storage: Lit document
    API-->>F: PDF

    alt Validation
        Admin->>F: Valide la verification
        F->>API: PATCH /api/admin/verifications/{artisan}/validate
        API->>DB: Met artisan certifie
        API-->>F: Verification validee
    else Annulation ou retrait
        Admin->>F: Annule ou retire la verification
        F->>API: PATCH /api/admin/verifications/{artisan}/cancel
        API->>DB: Met artisan non verifie
        API-->>F: Verification annulee
    end
```

## 9. Signalement utilisateur et traitement admin

```mermaid
sequenceDiagram
    actor U as Utilisateur connecte
    actor Admin as Administrateur
    participant F as Frontend React
    participant API as API Laravel
    participant DB as Base de donnees

    U->>F: Clique Signaler sur un profil
    F->>API: POST /api/plaintes
    API->>API: Valide plaignant, cible, motif et description
    API->>DB: Enregistre Plainte statut en_attente
    API-->>F: Signalement cree
    F-->>U: Confirmation

    Admin->>F: Ouvre Signalements
    F->>API: GET /api/admin/reports
    API->>DB: Recupere plaintes
    API-->>F: Liste des signalements
    F-->>Admin: Affiche reference, plaignant, cible, motif, description

    alt Traiter
        Admin->>F: Marque Traite
        F->>API: PATCH /api/admin/reports/{plainte}/treated
        API->>DB: Met statut traite
        API-->>F: Signalement traite
    else Ignorer
        Admin->>F: Ignore
        F->>API: PATCH /api/admin/reports/{plainte}/ignored
        API->>DB: Met statut ignore
        API-->>F: Signalement ignore
    end
```

## 10. Administration globale

```mermaid
sequenceDiagram
    actor Admin as Administrateur
    participant F as Frontend React
    participant API as API Laravel
    participant DB as Base de donnees

    Admin->>F: Se connecte a l'espace admin
    F->>API: GET /api/admin/overview
    API->>DB: Calcule utilisateurs, artisans, CA, inscriptions, repartitions
    API-->>F: Statistiques dashboard
    F-->>Admin: Affiche tableau de bord

    Admin->>F: Ouvre Utilisateurs
    F->>API: GET /api/admin/users
    API->>DB: Recupere utilisateurs filtres
    API-->>F: Liste utilisateurs

    alt Suspendre utilisateur
        Admin->>F: Clique Suspendre
        F->>API: PATCH /api/admin/users/{user}/suspend
        API->>DB: Change statut suspendu
        API-->>F: Utilisateur suspendu
    else Reactiver utilisateur
        Admin->>F: Clique Activer
        F->>API: PATCH /api/admin/users/{user}/activate
        API->>DB: Change statut actif
        API-->>F: Utilisateur actif
    end

    Admin->>F: Ouvre Paiements
    F->>API: GET /api/admin/payments
    API->>DB: Recupere paiements abonnement/renouvellement
    API-->>F: Liste paiements

    Admin->>F: Ouvre Appels d'offres
    F->>API: GET /api/admin/offers
    API->>DB: Recupere appels d'offres
    API-->>F: Liste appels d'offres
```

