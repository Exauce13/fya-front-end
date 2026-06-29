# Diagrammes d'etats-transitions - FYA

Ces diagrammes montrent les changements d'etat des principales entites de la plateforme FYA. Ils completent les diagrammes de sequence, d'activites et de deploiement.

## 1. Etat d'un compte utilisateur

```mermaid
stateDiagram-v2
    [*] --> Inscription
    Inscription --> EmailEnAttente: Compte cree
    EmailEnAttente --> Actif: Email verifie
    EmailEnAttente --> EmailEnAttente: Renvoyer email de verification

    Actif --> Suspendu: Suspension par admin
    Suspendu --> Actif: Reactivation par admin

    Actif --> Deconnecte: Deconnexion
    Deconnecte --> Actif: Connexion valide

    Suspendu --> [*]
```

## 2. Etat d'un appel d'offres

```mermaid
stateDiagram-v2
    [*] --> Brouillon
    Brouillon --> Ouvert: Publication par le client
    Brouillon --> Annule: Abandon de creation

    Ouvert --> Ouvert: Reception d'une candidature
    Ouvert --> Cloture: Fermeture manuelle par le client
    Ouvert --> Cloture: Acceptation d'une candidature
    Ouvert --> Supprime: Suppression par admin

    Cloture --> [*]
    Annule --> [*]
    Supprime --> [*]
```

## 3. Etat d'une candidature artisan

```mermaid
stateDiagram-v2
    [*] --> EnPreparation
    EnPreparation --> Envoyee: Artisan postule
    EnPreparation --> Annulee: Artisan abandonne

    Envoyee --> EnAttente: Candidature enregistree
    EnAttente --> Acceptee: Client accepte la candidature
    EnAttente --> Refusee: Client choisit une autre candidature ou cloture

    Acceptee --> [*]
    Refusee --> [*]
    Annulee --> [*]
```

## 4. Etat d'un service

```mermaid
stateDiagram-v2
    [*] --> EnAttente: Service propose par l'artisan

    EnAttente --> EnCours: Validation par le client
    EnAttente --> Annule: Annulation par le client
    EnAttente --> EnAttente: Modification par l'artisan

    EnCours --> TerminePartiel: Artisan ou client confirme la fin
    TerminePartiel --> Termine: Deuxieme confirmation si necessaire
    EnCours --> Termine: Service marque termine
    EnCours --> Annule: Annulation exceptionnelle

    Termine --> AvisEnAttente: Redirection vers avis
    AvisEnAttente --> AvisDonne: Avis enregistre
    AvisEnAttente --> [*]: Avis ignore ou reporte
    AvisDonne --> [*]
    Annule --> [*]
```

## 5. Etat d'une verification artisan

```mermaid
stateDiagram-v2
    [*] --> NonVerifie
    NonVerifie --> DossierEnPreparation: Artisan ouvre le centre de verification
    DossierEnPreparation --> PaiementEnAttente: Documents envoyes
    PaiementEnAttente --> EnCoursDeVerification: Paiement confirme
    PaiementEnAttente --> PaiementEchoue: Paiement refuse ou abandonne

    PaiementEchoue --> PaiementEnAttente: Nouvelle tentative de paiement
    EnCoursDeVerification --> Certifie: Validation admin
    EnCoursDeVerification --> Refuse: Refus ou annulation admin

    Certifie --> NonVerifie: Retrait de certification
    Refuse --> DossierEnPreparation: Nouvelle demande
    Certifie --> [*]
```

## 6. Etat d'un paiement

```mermaid
stateDiagram-v2
    [*] --> Initie
    Initie --> EnAttente: Redirection ou initialisation FedaPay
    EnAttente --> Paye: Callback de paiement confirme
    EnAttente --> Echoue: Paiement refuse
    EnAttente --> Expire: Paiement non finalise

    Echoue --> Initie: Nouvelle tentative
    Expire --> Initie: Nouvelle tentative
    Paye --> RecuDisponible: Generation du recu
    RecuDisponible --> [*]
```

## 7. Etat d'un signalement

```mermaid
stateDiagram-v2
    [*] --> EnSaisie
    EnSaisie --> EnAttente: Signalement envoye
    EnSaisie --> Annule: Utilisateur abandonne

    EnAttente --> Traite: Admin marque comme traite
    EnAttente --> Ignore: Admin ignore le signalement
    EnAttente --> EnAttente: Consultation ou filtrage admin

    Traite --> [*]
    Ignore --> [*]
    Annule --> [*]
```

## 8. Etat d'un message

```mermaid
stateDiagram-v2
    [*] --> Redaction
    Redaction --> UploadMedia: Image, video ou note vocale ajoutee
    UploadMedia --> PretAEnvoyer: Upload reussi
    UploadMedia --> ErreurUpload: Upload echoue
    ErreurUpload --> UploadMedia: Reessayer

    Redaction --> PretAEnvoyer: Message texte
    PretAEnvoyer --> Envoye: Enregistrement par l'API
    Envoye --> Recu: Message charge chez le destinataire
    Recu --> Lu: Conversation consultee

    Envoye --> [*]
    Lu --> [*]
```

## 9. Etat d'une publication

```mermaid
stateDiagram-v2
    [*] --> Creation
    Creation --> Publiee: Publication enregistree
    Creation --> Abandonnee: Artisan abandonne

    Publiee --> Publiee: Like ajoute ou retire
    Publiee --> Publiee: Commentaire ajoute
    Publiee --> Signalee: Signalement utilisateur
    Signalee --> Publiee: Signalement ignore
    Signalee --> Masquee: Action de moderation

    Abandonnee --> [*]
    Masquee --> [*]
```

