# Vérification des Comptes Gmail/Google Workspace

## Description

Ce système implémente une vérification réelle pour s'assurer que les adresses email des utilisateurs avec les rôles ADMIN, CONTRIBUTOR ou REVIEWER utilisent Gmail ou Google Workspace. Le système accepte :
- Les adresses **@gmail.com** (Gmail personnel)
- Les **domaines personnalisés** configurés avec **Google Workspace** (ex: utilisateur@entreprise.com si entreprise.com utilise Google Workspace)

Au lieu de simplement vérifier le domaine de l'email, le système vérifie maintenant que l'adresse utilise réellement les services Gmail/Google.

## Fonctionnalités

### Côté Serveur

1. **Service de vérification Gmail** (`server/src/services/gmail-verification.service.ts`)
   - Vérifie l'existence d'un compte via l'API Google
   - Vérifie les enregistrements MX du domaine pour détecter Google Workspace
   - Supporte Gmail (@gmail.com) et les domaines personnalisés Google Workspace
   - Inclut un mécanisme de fallback en cas d'échec de l'API
   - Supporte la vérification de plusieurs comptes en batch

2. **Endpoint API** (`/api/users/verify-gmail`)
   - POST `/api/users/verify-gmail`
   - Corps de la requête : `{ email: string }`
   - Réponse : `{ valid: boolean, email: string }`
   - Accepte tous les domaines (pas seulement @gmail.com)

3. **Contrôleur** (`server/src/controllers/user.controller.ts`)
   - Méthode `verifyGmailAccount` pour gérer les requêtes de vérification
   - Validation des paramètres d'entrée
   - Gestion des erreurs appropriée
   - Ne limite plus la vérification aux adresses @gmail.com

### Côté Client

1. **Service utilisateur** (`client/src/services/userService.ts`)
   - Méthode `verifyGmailAccount(email: string)` pour appeler l'API

2. **Formulaire d'ajout d'utilisateur** (`client/src/templates/users/forms/AddUserForm.tsx`)
   - Validation asynchrone en temps réel lors de la saisie de l'email
   - Accepte tous les domaines email
   - Indicateur de chargement pendant la vérification
   - Messages d'erreur personnalisés pour les emails qui n'utilisent pas Gmail
   - Re-vérification automatique lorsque le rôle change

3. **Traductions**
   - Messages d'erreur en français et anglais :
     - `gmailRequired`: Email doit utiliser Gmail/Google Workspace
     - `gmailInvalid`: Email n'utilise pas Gmail/Google Workspace
     - `gmailVerificationFailed`: Erreur lors de la vérification

## Comportement

### Déclenchement de la vérification

La vérification est déclenchée dans les cas suivants :
1. Lorsque l'utilisateur quitte le champ email (onBlur)
2. Lorsque l'utilisateur change le rôle pour ADMIN, CONTRIBUTOR ou REVIEWER
3. Pour **tous les domaines email** (plus seulement @gmail.com)

### Méthodes de vérification

Le système utilise deux méthodes complémentaires :

#### 1. Vérification via l'API Google
- Interroge l'API de connexion Google
- Vérifie si l'email existe dans l'écosystème Google
- Fonctionne pour Gmail et Google Workspace

#### 2. Vérification des enregistrements MX
- Examine les serveurs mail du domaine
- Détecte si le domaine utilise les serveurs Google
- Serveurs Google détectés :
  - `*.google.com`
  - `*.googlemail.com`
  - `aspmx.l.google.com`

### États de vérification

- **En cours** : Un spinner apparaît dans le champ email
- **Succès** : Aucun message, l'utilisateur peut continuer
- **Échec** : Message d'erreur rouge sous le champ email
- **Erreur de réseau** : Message d'avertissement jaune (non bloquant)

## Exemples d'emails acceptés

✅ **Acceptés** (si valides) :
- `utilisateur@gmail.com` - Gmail personnel
- `admin@entreprise.com` - Si entreprise.com utilise Google Workspace
- `contact@organisation.fr` - Si organisation.fr utilise Google Workspace

❌ **Refusés** :
- `utilisateur@outlook.com` - Utilise Microsoft
- `admin@entreprise.com` - Si entreprise.com utilise un autre service email
- Tout email qui n'utilise pas Gmail/Google Workspace

## Limitations

- La vérification utilise une API interne de Google qui peut changer
- La vérification des enregistrements MX nécessite un accès DNS
- En cas d'échec des deux méthodes, l'email est refusé par sécurité
- Timeout de 5 secondes pour éviter de bloquer l'interface

## Améliorations futures

1. Implémenter un cache côté serveur pour réduire les appels API
2. Ajouter une vérification par lots pour l'import d'utilisateurs
3. Intégrer l'API officielle Google People (nécessite OAuth)
4. Ajouter des analytics pour suivre le taux de succès de la vérification
5. Permettre une liste blanche de domaines approuvés manuellement
