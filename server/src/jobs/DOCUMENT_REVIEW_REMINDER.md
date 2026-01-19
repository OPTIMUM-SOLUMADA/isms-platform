# Document Review Reminder Job

## Description

Tâche planifiée quotidienne qui identifie les documents dont la date de révision (`nextReviewDate`) est prévue pour le lendemain et effectue automatiquement les actions suivantes :

1. **Dépublication** : Si le document est publié, il est automatiquement dépublié
2. **Changement de statut** : Si le statut du document est `APPROVED`, il est changé en `IN_REVIEW`
3. **Notifications** : Envoie des notifications par email et dans l'application à tous les auteurs et réviseurs du document

## Planification

Le job s'exécute **tous les jours à 8h00 du matin** (cron: `0 8 * * *`)

## Architecture

### Fichiers principaux

- **Job**: `server/src/jobs/document-review-reminder.job.ts`
- **Tests**: `server/tests/jobs/document-review-reminder.job.test.ts`
- **Enregistrement**: `server/src/jobs/index.ts`

### Fonctions clés

#### `documentReviewReminderJob()`
Fonction principale du job qui orchestre l'ensemble du processus.

#### `findDocumentsDueForReviewTomorrow()`
Recherche tous les documents dont la `nextReviewDate` est prévue pour le lendemain (de 00h00 à 23h59).

#### `processDocumentReview(document)`
Traite un document individuel :
- Vérifie si le document doit être dépublié
- Vérifie si le statut doit être changé
- Appelle la fonction d'envoi des notifications

#### `sendReviewNotifications(document)`
Envoie les notifications à tous les acteurs concernés (auteurs et réviseurs).

#### `getUniqueRecipients(document)`
Retourne une liste unique de destinataires pour éviter les doublons (ex: un utilisateur qui est à la fois auteur et réviseur).

#### `createInAppNotification(document, userId)`
Crée une notification dans l'application pour un utilisateur.

#### `sendEmailNotification(document, recipient)`
Envoie un email de rappel à un destinataire.

## Gestion des erreurs

Le job implémente une gestion des erreurs robuste :

- **Isolation des erreurs** : Si un document échoue lors du traitement, les autres documents continuent d'être traités
- **Logging détaillé** : Toutes les actions et erreurs sont enregistrées avec le logger
- **Compteurs** : Le job garde un compte des documents traités avec succès et des erreurs

## Types de notifications

### Notification in-app
- **Type**: `DOCUMENT_REVIEW_REMINDER`
- **Titre**: "Rappel de révision de document"
- **Message**: Informe que le document doit être révisé demain et que le statut a été modifié

### Email
- **Sujet**: "Review Required: [Titre du document]"
- **Contenu**: 
  - Salutation personnalisée
  - Nom du document
  - Date de révision
  - Information sur le changement de statut
  - Lien pour se connecter au système

## Exemple de log

```
[REVIEW_REMINDER] Starting document review reminder job
[REVIEW_REMINDER] Found 3 documents due for review tomorrow
[REVIEW_REMINDER] Processing document: Policy Document (ID: doc-123)
[REVIEW_REMINDER] Unpublishing document: Policy Document
[REVIEW_REMINDER] Changing status to IN_REVIEW: Policy Document
[REVIEW_REMINDER] Sending notifications to 5 recipients for document: Policy Document
[REVIEW_REMINDER] Notification sent to John Doe (john@example.com)
[REVIEW_REMINDER] Job completed. Processed: 3, Errors: 0
```

## Tests

Le fichier de tests unitaires couvre les scénarios suivants :

1. ✅ Aucun document à traiter
2. ✅ Dépublication d'un document publié
3. ✅ Changement de statut de APPROVED à IN_REVIEW
4. ✅ Dépublication et changement de statut simultanés
5. ✅ Envoi de notifications à multiples auteurs et réviseurs
6. ✅ Évitement de notifications dupliquées
7. ✅ Gestion des erreurs pour des documents individuels

Pour exécuter les tests :
```bash
npm test document-review-reminder.job.test.ts
```

## Dépendances

- **DocumentService** : Pour rechercher et mettre à jour les documents
- **NotificationService** : Pour créer les notifications in-app
- **EmailService** : Pour envoyer les emails
- **date-fns** : Pour la manipulation des dates
- **node-cron** : Pour la planification du job

## Configuration

Aucune configuration supplémentaire n'est nécessaire. Le job utilise les services existants et la configuration SMTP déjà en place.

## Modification du schéma

Le type de notification `DOCUMENT_REVIEW_REMINDER` a été ajouté à l'enum `NotificationType` dans le schéma Prisma :

```prisma
enum NotificationType {
  // ...
  DOCUMENT_REVIEW_REMINDER
  // ...
}
```

Après modification du schéma, exécutez :
```bash
npx prisma migrate dev --name add-document-review-reminder-notification
```

## Principes de Clean Code appliqués

1. **Single Responsibility Principle** : Chaque fonction a une responsabilité unique et bien définie
2. **Fonction de petite taille** : Les fonctions sont courtes et lisibles
3. **Nommage explicite** : Les noms de fonctions et variables décrivent clairement leur rôle
4. **Gestion des erreurs** : Try-catch appropriés et logging détaillé
5. **DRY (Don't Repeat Yourself)** : Code réutilisable et évite la duplication
6. **Testabilité** : Code structuré pour faciliter les tests unitaires
7. **Documentation** : Commentaires JSDoc pour toutes les fonctions principales
8. **Types TypeScript** : Utilisation d'interfaces pour une meilleure sécurité de type

## Maintenance

Pour désactiver temporairement le job, commentez la ligne dans `server/src/jobs/index.ts` :

```typescript
// safeSchedule('0 8 * * *', 'DOCUMENT_REVIEW_REMINDER', documentReviewReminderJob);
```

Pour modifier l'horaire d'exécution, modifiez l'expression cron :
- `0 8 * * *` : Tous les jours à 8h00
- `0 9 * * *` : Tous les jours à 9h00
- `0 */6 * * *` : Toutes les 6 heures
- `0 0 * * 1` : Tous les lundis à minuit
