# Organisateur de Père Noël Secret (Secret Santa)

Cette application est une solution complète pour organiser des échanges de cadeaux entre amis, collègues ou en famille. Elle est conçue pour être simple, sans création de compte utilisateur, et respectueuse de la vie privée.

## Fonctionnalités Principales

### 1. Création d'Événement
L'utilisateur commence par configurer son événement via un formulaire conversationnel intuitif.
*   **Détails personnalisables :** Nom de l'événement, budget par personne, date du tirage au sort et date de l'échange des cadeaux.
*   **Message personnalisé :** L'organisateur peut ajouter une note qui sera transmise à tous les participants.
*   **Gestion :** Un lien unique "administrateur" est généré. C'est la seule clé pour revenir gérer l'événement plus tard. L'application propose d'envoyer ce lien par email à l'organisateur pour ne pas le perdre.

### 2. Gestion des Participants (Les Lutins)
L'organisateur dispose de plusieurs méthodes pour constituer sa liste de participants :
*   **Ajout Manuel :** Saisie directe du nom, email, département et liste de souhaits.
*   **Groupes d'Exclusion :** Possibilité d'assigner un groupe (ex: "Couple A") à plusieurs participants. Les membres d'un même groupe ne pourront pas se tirer au sort entre eux.
*   **Import CSV :** Copier-coller une liste formatée (Nom, Email, Groupe).
*   **Système de "Billets" (Invitation) :**
    *   L'organisateur partage un lien d'invitation générique.
    *   Les invités remplissent leurs propres informations (nom, souhaits...) sur une page dédiée.
    *   L'application génère un "Code Billet" crypté que l'invité envoie à l'organisateur.
    *   L'organisateur "scanne" (copie-colle) ce code pour ajouter l'invité sans erreur de saisie.

### 3. Le Tirage au Sort Magique
*   **Algorithme intelligent :** L'application effectue le tirage en respectant deux règles strictes :
    1.  Une personne ne peut pas se tirer elle-même.
    2.  Une personne ne peut pas tirer quelqu'un de son propre groupe d'exclusion.
*   **Essais multiples :** Si les contraintes sont impossibles à satisfaire, l'application avertit l'organisateur pour qu'il ajuste les groupes.

### 4. Distribution et Confidentialité
Une fois le tirage effectué, l'organisateur accède à l'étape de partage :
*   **Mode Simulateur :** L'organisateur peut voir "à travers les yeux" d'un participant spécifique pour vérifier ce qu'il verra (qui il doit offrir, la liste de souhaits de sa cible).
*   **Cartes de Révélation :** Une interface ludique permet de cliquer pour révéler le résultat (utile si tout le monde est réuni autour d'un même écran).
*   **Envoi par Email :** Génère des liens `mailto:` pré-remplis pour envoyer les résultats individuellement via le logiciel de messagerie par défaut de l'organisateur.
*   **Copier le Message :** Permet de copier le texte de la mission pour l'envoyer par SMS, WhatsApp ou autre.
*   **Liste Maître (Admin) :** L'organisateur a accès à la liste complète des paires (Qui offre à Qui) en cas de besoin.

### 5. Internationalisation
L'application est entièrement traduite en trois langues, changeables instantanément :
*   Anglais
*   Français
*   Espagnol

## Flux Utilisateur Typique

1.  **L'Organisateur** crée l'événement et reçoit son lien de gestion.
2.  Il ajoute les participants (manuellement ou via les billets reçus).
3.  Il définit les exclusions (pour éviter que des conjoints s'offrent des cadeaux entre eux).
4.  Il lance le **Tirage au Sort**.
5.  Il distribue les missions secrètes à chaque participant par email ou messagerie.
6.  Les participants reçoivent leur mission : "Tu es le Père Noël Secret de [Nom] !".