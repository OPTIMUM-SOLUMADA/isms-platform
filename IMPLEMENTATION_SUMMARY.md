# Implémentation - Document Review Reminder Job

## 📋 Résumé

Fonction planifiée quotidienne qui gère automatiquement les documents arrivant à échéance de révision le lendemain.

## ✅ Fichiers créés/modifiés

### Nouveaux fichiers

1. **`server/src/jobs/document-review-reminder.job.ts`**
   - Job principal avec toute la logique métier
   - Architecture modulaire avec fonctions séparées
   - Gestion d'erreurs robuste
   - Logging détaillé

2. **`server/src/templates/emails/document-review-reminder.template.ts`**
   - Template HTML professionnel pour les emails
   - Design responsive
   - Informations claires et structurées

3. **`server/tests/jobs/document-review-reminder.job.test.ts`**
   - Suite complète de tests unitaires
   - Couvre tous les scénarios principaux
   - Tests de gestion d'erreurs

4. **`server/src/jobs/DOCUMENT_REVIEW_REMINDER.md`**
   - Documentation complète du job
   - Guide d'utilisation et de maintenance
   - Exemples de logs

### Fichiers modifiés

1. **`server/src/jobs/index.ts`**
   ```typescript
   // Ajout de l'import
   import { documentReviewReminderJob } from './document-review-reminder.job';
   
   // Ajout de la planification (tous les jours à 8h00)
   safeSchedule('0 8 * * *', 'DOCUMENT_REVIEW_REMINDER', documentReviewReminderJob);
   ```

2. **`server/prisma/schema.prisma`**
   ```prisma
   enum NotificationType {
     // ... autres types
     DOCUMENT_REVIEW_REMINDER  // ✅ Ajouté
     // ...
   }
   ```

3. **`server/src/utils/notification-messages.ts`**
   ```typescript
   case NotificationType.DOCUMENT_REVIEW_REMINDER:
       return {
           title: 'Rappel de révision de document',
           message: documentTitle
               ? `Le document "${documentTitle}" doit être révisé demain...`
               : 'Un document doit être révisé demain',
       };
   ```

## 🎯 Fonctionnalités implémentées

### 1. Identification des documents
- ✅ Recherche des documents avec `nextReviewDate` = demain
- ✅ Utilisation de `date-fns` pour la précision des dates
- ✅ Requête optimisée avec filtres sur dates

### 2. Actions automatiques
- ✅ Dépublication si le document est publié
- ✅ Changement de statut de `APPROVED` vers `IN_REVIEW`
- ✅ Mise à jour atomique du document

### 3. Notifications
- ✅ Notifications in-app pour tous les acteurs
- ✅ Emails HTML professionnels
- ✅ Déduplication des destinataires (auteurs + reviewers)
- ✅ Template personnalisé avec informations détaillées

## 🏗️ Architecture Clean Code

### Principes appliqués

1. **Single Responsibility Principle**
   - Chaque fonction a UNE responsabilité
   - `findDocumentsDueForReviewTomorrow()` : recherche
   - `processDocumentReview()` : traitement
   - `sendReviewNotifications()` : notifications

2. **DRY (Don't Repeat Yourself)**
   - Template email réutilisable
   - Fonction `getUniqueRecipients()` pour éviter duplication
   - Logging centralisé

3. **Error Handling**
   - Try-catch à tous les niveaux
   - Isolation des erreurs (un document en échec n'affecte pas les autres)
   - Logging détaillé des erreurs

4. **Testabilité**
   - Fonctions pures et testables
   - Services mockables
   - Tests unitaires complets

5. **Documentation**
   - JSDoc sur toutes les fonctions
   - Commentaires explicatifs
   - README complet

6. **Types TypeScript**
   - Interface `DocumentToReview` pour la clarté
   - Typage strict partout
   - Utilisation des enums Prisma

## 📊 Flux d'exécution

```
1. Job démarre (8h00 chaque jour)
   ↓
2. Recherche documents (nextReviewDate = demain)
   ↓
3. Pour chaque document:
   ├─ Vérifier si publié → Dépublier
   ├─ Vérifier si APPROVED → Changer en IN_REVIEW
   ├─ Mettre à jour le document
   └─ Envoyer notifications
      ├─ Récupérer destinataires uniques
      ├─ Créer notifications in-app
      └─ Envoyer emails
   ↓
4. Logger résultat (succès/erreurs)
   ↓
5. Fin du job
```

## 🧪 Tests

### Scénarios couverts

- ✅ Aucun document à traiter
- ✅ Dépublication seule
- ✅ Changement de statut seul
- ✅ Dépublication + changement de statut
- ✅ Notifications multiples destinataires
- ✅ Déduplication auteur/reviewer
- ✅ Gestion d'erreurs individuelles

### Exécution des tests

```bash
cd server
npm test document-review-reminder.job.test.ts
```

## 🔧 Configuration requise

### Variables d'environnement

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` : Pour les emails
- `CLIENT_URL` (optionnel) : URL du client pour les liens dans les emails

### Migration Prisma

```bash
cd server
npx prisma migrate dev --name add-document-review-reminder-notification
npx prisma generate
```

## 📅 Planification

- **Cron**: `0 8 * * *`
- **Fréquence**: Tous les jours à 8h00 du matin
- **Timezone**: Utilise le timezone du serveur

### Modifier l'horaire

Dans `server/src/jobs/index.ts`, modifier la cron expression :

```typescript
// Exemples d'autres horaires:
safeSchedule('0 7 * * *', ...)  // 7h00
safeSchedule('0 9 * * 1-5', ...)  // 9h00 du lundi au vendredi
safeSchedule('0 */6 * * *', ...)  // Toutes les 6 heures
```

## 🚀 Déploiement

1. **Backup de la base de données** (recommandé)
   ```bash
   mongodump --uri="mongodb://..." --out=backup
   ```

2. **Appliquer les migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Redémarrer le serveur**
   ```bash
   npm run build
   npm run start
   ```

4. **Vérifier les logs**
   ```bash
   # Le job s'exécutera automatiquement à 8h00
   # Logs visibles dans la console ou fichier de log
   ```

## 📧 Exemple d'email envoyé

**Sujet**: Révision requise : [Nom du document]

**Contenu** : Email HTML professionnel avec :
- Header coloré
- Informations du document
- Actions automatiques effectuées (encadré jaune)
- Bouton d'action vers le document
- Footer avec copyright

## 🎨 Avantages de cette implémentation

1. **Robustesse**
   - Gestion d'erreurs à tous les niveaux
   - Isolation des échecs
   - Logging complet

2. **Maintenabilité**
   - Code modulaire et lisible
   - Documentation complète
   - Tests unitaires

3. **Performance**
   - Requêtes optimisées
   - Traitement par lots
   - Notifications asynchrones

4. **Expérience utilisateur**
   - Emails professionnels
   - Notifications in-app
   - Informations claires

5. **Extensibilité**
   - Facile d'ajouter de nouvelles actions
   - Template email personnalisable
   - Configuration flexible

## 🔍 Monitoring

### Logs à surveiller

```
[REVIEW_REMINDER] Starting document review reminder job
[REVIEW_REMINDER] Found X documents due for review tomorrow
[REVIEW_REMINDER] Job completed. Processed: X, Errors: Y
```

### Alertes recommandées

- Si `errorCount > 0` → Investiguer
- Si job ne s'exécute pas → Vérifier cron
- Si aucun document trouvé pendant longtemps → Normal ou problème ?

## 📝 Notes importantes

1. **Timezone** : Le job utilise le timezone du serveur. S'assurer que le serveur est configuré correctement.

2. **Volume** : Si beaucoup de documents à traiter, considérer :
   - Augmenter les ressources serveur
   - Traiter par batches
   - Exécuter plus tôt dans la nuit

3. **SMTP** : S'assurer que les credentials SMTP sont valides et que le serveur peut envoyer des emails.

4. **Base de données** : Le job fait des requêtes et updates. S'assurer que les index sont optimisés sur `nextReviewDate`.

## ✨ Conclusion

Cette implémentation suit les principes du Clean Code avec :
- Code lisible et maintenable
- Architecture modulaire
- Tests complets
- Documentation détaillée
- Gestion d'erreurs robuste

Le job est prêt pour la production ! 🎉
