# Diagnostic et résolution des problèmes d'authentification (401 Unauthorized)

## 🔍 Diagnostic complet des endpoints API

### Problèmes identifiés entre Local et Render

---

## 📋 Endpoints à vérifier

### 1. `/auth/refresh` - Rafraîchissement du token
**Statut**: 🔴 Problème probable avec les cookies sur Render

### 2. `/api/documents/statistics` - Statistiques des documents
**Statut**: ⚠️ Nécessite un access token valide

### 3. `/api/document-reviews/my-reviews/:userId/expired-and-due-soon-reviews`
**Statut**: ⚠️ Nécessite un access token valide

### 4. `/api/departments` - Liste des départements
**Statut**: ⚠️ Nécessite un access token valide

### 5. `/api/documents/published/:userId` - Documents publiés
**Statut**: ⚠️ Nécessite un access token valide

### 6. `/api/document-types` - Types de documents
**Statut**: ⚠️ Nécessite un access token valide

### 7. `/api/documents` - Liste des documents
**Statut**: ⚠️ Nécessite un access token valide

### 8. `/api/notifications` - Notifications
**Statut**: ⚠️ Nécessite un access token valide

### 9. `/api/iso-clauses` - Clauses ISO
**Statut**: ⚠️ Nécessite un access token valide

### 10. `/api/document-reviews/my-reviews/:userId` - Mes revues
**Statut**: ⚠️ Nécessite un access token valide

### 11. `/api/document-reviews/my-reviews/:userId/stats` - Statistiques de revues
**Statut**: ⚠️ Nécessite un access token valide

### 12. `/api/document-reviews/pending-reviews/:userId` - Revues en attente
**Statut**: ⚠️ Nécessite un access token valide

---

## 🔧 Améliorations apportées

### 1. Middleware de diagnostic d'authentification
**Fichier**: `server/src/middlewares/auth-diagnostic.middleware.ts`

Ce middleware log automatiquement :
- ✅ Présence du header Authorization
- ✅ Longueur et format du token
- ✅ Présence du refreshToken dans les cookies
- ✅ Origine de la requête (CORS)
- ✅ Environnement (development/production)

**Activation**: 
- Automatique en développement
- Sur Render: Ajouter `DEBUG_AUTH=true` dans les variables d'environnement

### 2. Logs améliorés dans `auth.middleware.ts`
- ✅ Log de chaque requête authentifiée
- ✅ Détails sur les erreurs de token (expiré, invalide, manquant)
- ✅ Information sur le chemin de la requête
- ✅ Preview masqué du token pour debugging

### 3. Logs améliorés dans `auth.controller.ts` (refresh endpoint)
- ✅ Log de la présence du refreshToken
- ✅ Log des cookies disponibles
- ✅ Log de la génération du nouveau access token
- ✅ Détails sur les erreurs de refresh

---

## 🚨 Causes probables des erreurs 401 sur Render

### 1. **Problème de cookies (CAUSE PRINCIPALE)**

#### Symptômes
- `/auth/refresh` retourne 401 avec `ERR_NO_REFRESH_TOKEN`
- Le refreshToken n'est pas présent dans les cookies

#### Causes possibles
1. **SameSite Cookie Policy**
   - Local: `sameSite: 'strict'` fonctionne car même domaine
   - Render: Doit être `sameSite: 'none'` pour cross-site + `secure: true`

2. **HTTPS requis**
   - Cookies sécurisés nécessitent HTTPS
   - Vérifier que Render utilise HTTPS

3. **Domain mismatch**
   - Client: `https://your-client.netlify.app`
   - Server: `https://your-api.onrender.com`
   - Les cookies ne sont pas partagés entre domaines différents

#### Solutions

**a) Modifier la configuration des cookies dans `auth.controller.ts`:**

```typescript
// Dans la méthode login
const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production', // HTTPS requis en production
    sameSite: env.NODE_ENV === 'production' ? 'none' as const : 'strict' as const,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
};

res.cookie('refreshToken', refreshToken, cookieOptions)
```

**b) Vérifier CORS_ORIGIN sur Render:**
```
CORS_ORIGIN=https://your-client-domain.netlify.app
```

**c) Ajouter dans les headers CORS (déjà fait) :**
```typescript
credentials: true,
exposedHeaders: ['Authorization', 'Content-Disposition'],
```

### 2. **Token expiré**

#### Symptômes
- Code d'erreur: `ERR_TOKEN_EXPIRED`
- Message: "Token expired"

#### Solutions
- Vérifier `JWT_ACCESS_EXPIRES_IN` sur Render (recommandé: `1h`)
- Vérifier `JWT_REFRESH_SHORT_EXPIRES_IN` (recommandé: `1d`)
- Vérifier `JWT_REFRESH_LONG_EXPIRES_IN` (recommandé: `30d`)
- Implémenter une logique de refresh automatique côté client

### 3. **JWT_SECRET différent**

#### Symptômes
- Code d'erreur: `ERR_INVALID_TOKEN`
- Tokens générés en local ne fonctionnent pas sur Render

#### Solutions
- ⚠️ **CRITIQUE**: S'assurer que `JWT_ACCESS_SECRET` et `JWT_REFRESH_SECRET` sont identiques en local et sur Render
- Utiliser les mêmes secrets sur les deux environnements pour le développement
- En production, utiliser des secrets uniques et sécurisés

### 4. **CORS mal configuré**

#### Symptômes
- Preflight requests (OPTIONS) échouent
- Header Authorization manquant
- Cookies non envoyés

#### Solutions
- Vérifier que `CORS_ORIGIN` correspond au domaine client exact
- Activer `credentials: true` (déjà fait)
- Exposer le header `Authorization` (déjà fait)

### 5. **Proxy/Load Balancer sur Render**

#### Symptômes
- IP ou headers incorrects
- Trust proxy non configuré

#### Solutions
```typescript
app.set('trust proxy', true); // ✅ Déjà configuré
```

---

## 📊 Comment tester et diagnostiquer

### 1. Activer les logs de diagnostic sur Render

Ajouter dans les variables d'environnement Render :
```
DEBUG_AUTH=true
```

### 2. Tester le flux d'authentification

#### A. Test du login
```bash
curl -X POST https://your-api.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt \
  -v
```

Vérifier :
- ✅ Status 200
- ✅ Header `Authorization: Bearer <token>`
- ✅ Cookie `refreshToken` présent dans la réponse
- ✅ Format du cookie (httpOnly, secure, sameSite)

#### B. Test du refresh
```bash
curl -X POST https://your-api.onrender.com/auth/refresh \
  -b cookies.txt \
  -v
```

Vérifier :
- ✅ Status 200
- ✅ Nouveau header `Authorization: Bearer <new_token>`
- ✅ Cookie `refreshToken` lu correctement

#### C. Test d'un endpoint protégé
```bash
curl -X GET https://your-api.onrender.com/api/documents \
  -H "Authorization: Bearer <access_token>" \
  -v
```

Vérifier :
- ✅ Status 200
- ❌ Status 401 → Token invalide ou expiré

### 3. Vérifier les logs sur Render

Console Render → Logs → Rechercher :
- `[AUTH_DIAGNOSTIC]` - Informations sur chaque requête authentifiée
- `[AUTH_MIDDLEWARE]` - Détails du processus de vérification du token
- `[AUTH_REFRESH]` - Détails du refresh token

---

## 🔐 Variables d'environnement requises sur Render

Vérifier que TOUTES ces variables sont configurées :

```env
# JWT Configuration
JWT_ACCESS_SECRET=<secret-complexe-32-caracteres>
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_SECRET=<autre-secret-complexe-32-caracteres>
JWT_REFRESH_SHORT_EXPIRES_IN=1d
JWT_REFRESH_LONG_EXPIRES_IN=30d
JWT_ISSUER=isms-platform

# CORS
CORS_ORIGIN=https://your-client-domain.com

# Environment
NODE_ENV=production

# Database
DATABASE_URL=<postgresql-url>

# Session
SESSION_SECRET=<secret-session-32-caracteres>

# Optional: Enable auth debugging
DEBUG_AUTH=true
```

---

## 🎯 Solution recommandée : Correction du cookie

### Fichier à modifier : `server/src/controllers/auth.controller.ts`

Remplacer cette ligne dans la méthode `login` :

```typescript
// ❌ AVANT
res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })

// ✅ APRÈS
const isProduction = env.NODE_ENV === 'production';
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' as const : 'strict' as const,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
    domain: isProduction ? undefined : 'localhost',
};

res.cookie('refreshToken', refreshToken, cookieOptions)
```

---

## 🧪 Tests de validation

### Checklist après application des corrections

- [ ] Login fonctionne (local)
- [ ] Login fonctionne (Render)
- [ ] Refresh fonctionne (local)
- [ ] Refresh fonctionne (Render)
- [ ] Cookies présents dans Network tab (DevTools)
- [ ] Access token reçu dans response headers
- [ ] Endpoints protégés accessibles avec token
- [ ] Token expired déclenche un refresh automatique
- [ ] Logs `[AUTH_DIAGNOSTIC]` visibles sur Render

---

## 📞 Prochaines étapes

1. **Appliquer la correction des cookies** (priorité haute)
2. **Vérifier les variables d'environnement sur Render**
3. **Activer DEBUG_AUTH=true sur Render**
4. **Tester le flux complet** : Login → Refresh → API calls
5. **Analyser les logs Render** pour identifier les problèmes restants
6. **Implémenter un interceptor côté client** pour refresh automatique

---

## 🐛 Debugging en temps réel

### Commandes utiles

```bash
# Voir les logs Render en temps réel
render logs --tail -s your-service-name

# Tester avec curl verbose
curl -v -X POST <endpoint> -H "Authorization: Bearer <token>"

# Vérifier les cookies
curl -c - <endpoint>
```

---

## 📚 Documentation de référence

- [Express Cookie Options](https://expressjs.com/en/api.html#res.cookie)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)
- [CORS with credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## ✅ Résumé de la solution

### Problème principal
Les cookies `refreshToken` ne sont pas envoyés/reçus correctement entre le client et Render à cause de la politique `sameSite: 'strict'`.

### Solution
1. Modifier les options de cookies pour utiliser `sameSite: 'none'` et `secure: true` en production
2. Vérifier que CORS_ORIGIN est correctement configuré
3. S'assurer que le client utilise HTTPS
4. Activer les logs de diagnostic

### Résultat attendu
- ✅ Login retourne un refreshToken dans un cookie
- ✅ Refresh utilise ce cookie pour générer un nouveau access token
- ✅ Tous les endpoints API sont accessibles avec le token
- ✅ Comportement identique entre local et Render
