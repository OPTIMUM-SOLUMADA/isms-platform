# Guide de diagnostic et résolution des erreurs 401

Ce guide explique comment utiliser les outils de diagnostic ajoutés pour identifier et résoudre les problèmes d'authentification entre l'environnement local et Render.

## 📋 Outils ajoutés

### 1. Middleware de diagnostic (`auth-diagnostic.middleware.ts`)
- Logs automatiques sur toutes les requêtes authentifiées
- Information sur les tokens, cookies, et headers
- Activé automatiquement en développement
- Activable sur Render avec `DEBUG_AUTH=true`

### 2. Logs améliorés dans `auth.middleware.ts`
- Chaque étape de vérification du token est loggée
- Erreurs détaillées avec le chemin de la requête
- Preview masqué des tokens pour debugging

### 3. Logs améliorés dans `auth.controller.ts`
- Détails du processus de login
- Informations sur le refresh token
- Configuration des cookies loggée

### 4. Script de test (`test-auth-endpoints.js`)
- Test automatique de tous les endpoints critiques
- Vérification du flux complet d'authentification
- Rapport de diagnostic avec recommandations

### 5. Correction du problème de cookies
- Configuration adaptée pour production (Render)
- Support de `sameSite: 'none'` et `secure: true`
- Durée de vie configurable basée sur "Remember Me"

## 🚀 Utilisation

### En local

1. **Activer les logs de diagnostic** (déjà activé en développement):
```bash
# Dans .env
DEBUG_AUTH=true
```

2. **Lancer le serveur**:
```bash
npm run dev
```

3. **Observer les logs**:
Les logs apparaîtront dans la console avec les préfixes:
- `[AUTH_DIAGNOSTIC]` - Informations générales sur les requêtes
- `[AUTH_MIDDLEWARE]` - Vérification du token
- `[AUTH_REFRESH]` - Processus de refresh
- `[AUTH_LOGIN]` - Processus de login

4. **Tester avec le script**:
```bash
node test-auth-endpoints.js http://localhost:8000
```

### Sur Render

1. **Configurer les variables d'environnement**:

Aller dans Render Dashboard → Your Service → Environment

Ajouter/Vérifier ces variables:

```env
# JWT Configuration
JWT_ACCESS_SECRET=<votre-secret-access>
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_SECRET=<votre-secret-refresh>
JWT_REFRESH_SHORT_EXPIRES_IN=1d
JWT_REFRESH_LONG_EXPIRES_IN=30d
JWT_ISSUER=isms-platform

# CORS - IMPORTANT !
CORS_ORIGIN=https://your-exact-client-domain.com

# Environment
NODE_ENV=production

# Database
DATABASE_URL=<your-postgresql-url>

# Session
SESSION_SECRET=<votre-secret-session>

# Debugging (optionnel)
DEBUG_AUTH=true
```

2. **Déployer les changements**:
```bash
git add .
git commit -m "fix: Add authentication diagnostics and fix cookie configuration"
git push
```

3. **Vérifier les logs Render**:
```bash
# Via Render CLI
render logs --tail -s your-service-name

# Ou via le Dashboard
Render → Your Service → Logs
```

4. **Tester avec le script**:
```bash
# Définir les credentials de test
export TEST_USER_EMAIL=your-test@email.com
export TEST_USER_PASSWORD=your-test-password

# Tester
node test-auth-endpoints.js https://your-api.onrender.com
```

## 🔍 Interpréter les logs

### Logs de diagnostic (`[AUTH_DIAGNOSTIC]`)

```json
{
  "timestamp": "2026-02-03T10:30:00.000Z",
  "environment": "production",
  "method": "GET",
  "path": "/api/documents",
  "origin": "https://client.com",
  "hasAuthHeader": true,
  "authHeaderPrefix": "Bearer",
  "tokenLength": 156,
  "hasRefreshToken": true,
  "refreshTokenLength": 189,
  "accessTokenPreview": "eyJhbGciOi...VCJ9.eyJz"
}
```

**Interprétation**:
- ✅ `hasAuthHeader: true` - Token présent
- ✅ `hasRefreshToken: true` - Cookie présent
- ❌ `hasAuthHeader: false` - Token manquant → Vérifier que le client envoie le header
- ❌ `hasRefreshToken: false` - Cookie manquant → Problème de configuration des cookies

### Logs du middleware (`[AUTH_MIDDLEWARE]`)

```
[AUTH_MIDDLEWARE] Request: {
  path: '/api/documents',
  hasAuthHeader: true,
  tokenPresent: true,
  tokenLength: 156
}

[AUTH_MIDDLEWARE] SUCCESS: Token verified for user admin@example.com
```

**Interprétation**:
- ✅ `SUCCESS` - Token vérifié avec succès
- ❌ `ERROR: No token provided` - Header Authorization manquant
- ❌ `ERROR: Token expired` - Token expiré, besoin de refresh
- ❌ `ERROR: Invalid token` - Token corrompu ou secret JWT incorrect

### Logs du refresh (`[AUTH_REFRESH]`)

```
[AUTH_REFRESH] Request received: {
  hasRefreshToken: true,
  refreshTokenLength: 189,
  cookies: ['refreshToken', 'session']
}

[AUTH_REFRESH] SUCCESS: New access token generated for admin@example.com
```

**Interprétation**:
- ✅ `SUCCESS` - Nouveau token généré
- ❌ `ERROR: No refresh token in cookies` - Cookie non reçu → Vérifier la configuration des cookies
- ❌ Token expired/invalid - Refresh token expiré ou invalide

## 🐛 Problèmes courants et solutions

### Problème 1: "ERR_NO_REFRESH_TOKEN" sur Render

**Symptômes**:
```json
{
  "error": "Access Denied. No refresh token provided.",
  "code": "ERR_NO_REFRESH_TOKEN"
}
```

**Diagnostic**:
```
[AUTH_REFRESH] ERROR: No refresh token in cookies
availableCookies: []
```

**Solution**:
Les cookies ne sont pas envoyés du client vers le serveur.

1. Vérifier la configuration CORS:
```typescript
// Doit être exact
CORS_ORIGIN=https://your-exact-client-domain.com
```

2. Vérifier que le client envoie `credentials`:
```typescript
// Côté client (axios)
axios.defaults.withCredentials = true;

// Côté client (fetch)
fetch(url, { credentials: 'include' })
```

3. Vérifier que les cookies utilisent `sameSite: 'none'` en production (✅ déjà corrigé)

### Problème 2: "ERR_TOKEN_EXPIRED" fréquent

**Symptômes**:
```json
{
  "error": "Token expired",
  "code": "ERR_TOKEN_EXPIRED"
}
```

**Diagnostic**:
```
[AUTH_MIDDLEWARE] ERROR: Token expired for /api/documents
```

**Solution**:
1. Augmenter la durée de vie du token:
```env
JWT_ACCESS_EXPIRES_IN=2h  # Au lieu de 1h
```

2. Implémenter un refresh automatique côté client:
```typescript
// Interceptor axios pour refresh automatique
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && error.response?.data?.code === 'ERR_TOKEN_EXPIRED') {
      await refreshAccessToken();
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Problème 3: "ERR_INVALID_TOKEN"

**Symptômes**:
```json
{
  "error": "Invalid token",
  "code": "ERR_INVALID_TOKEN"
}
```

**Diagnostic**:
```
[AUTH_MIDDLEWARE] ERROR: Invalid token for /api/documents
details: "invalid signature"
```

**Solution**:
Les secrets JWT sont différents entre local et Render.

1. Vérifier que `JWT_ACCESS_SECRET` et `JWT_REFRESH_SECRET` sont identiques:
```bash
# Local (.env)
JWT_ACCESS_SECRET=my-super-secret-key-32-chars

# Render (Environment Variables)
JWT_ACCESS_SECRET=my-super-secret-key-32-chars  # ⚠️ Doit être EXACTEMENT pareil
```

2. Régénérer les tokens après changement:
- Se déconnecter
- Se reconnecter

### Problème 4: CORS errors

**Symptômes**:
```
Access to XMLHttpRequest blocked by CORS policy
```

**Diagnostic**:
Vérifier dans les logs:
```
[AUTH_DIAGNOSTIC] origin: "https://different-domain.com"
corsOrigin: "https://expected-domain.com"
```

**Solution**:
1. Mettre à jour `CORS_ORIGIN` sur Render pour correspondre exactement au domaine client
2. Ne pas utiliser de wildcard (`*`) si vous utilisez `credentials: true`
3. Vérifier que le client utilise HTTPS (requis pour `sameSite: 'none'`)

## 📊 Tester le flux complet

### 1. Tester localement

```bash
# Terminal 1: Lancer le serveur avec logs
DEBUG_AUTH=true npm run dev

# Terminal 2: Tester les endpoints
node test-auth-endpoints.js http://localhost:8000
```

### 2. Tester sur Render

```bash
# Configurer les credentials
export TEST_USER_EMAIL=admin@example.com
export TEST_USER_PASSWORD=Admin@123

# Tester
node test-auth-endpoints.js https://your-api.onrender.com

# Voir les logs en temps réel
render logs --tail -s your-service-name
```

### 3. Analyser les résultats

Le script de test affiche:
- ✅ Tests réussis
- ❌ Tests échoués
- 📊 Taux de réussite
- 🔍 Recommandations spécifiques

Exemple de sortie:
```
✅ Login
✅ Refresh Token
✅ Document Statistics
✅ Departments
❌ Documents (401 Unauthorized)

📊 Test Summary
Total Tests: 10
✅ Passed: 9
❌ Failed: 1
Success Rate: 90%

🔍 Diagnosis
1. Check if access token is being sent in Authorization header
2. Ensure token is not expired
3. Review auth middleware logs
```

## 🎯 Checklist de validation

Après avoir appliqué les corrections:

- [ ] Login fonctionne en local
- [ ] Login fonctionne sur Render
- [ ] Refresh fonctionne en local
- [ ] Refresh fonctionne sur Render
- [ ] Cookie `refreshToken` visible dans Network tab (Application → Cookies)
- [ ] Header `Authorization` présent dans les réponses
- [ ] Tous les endpoints protégés retournent 200 (pas 401)
- [ ] Token expiré déclenche bien une erreur 401
- [ ] Logs de diagnostic visibles dans la console Render
- [ ] Script de test retourne 100% de succès

## 📞 Support

Si les problèmes persistent après avoir suivi ce guide:

1. Activer `DEBUG_AUTH=true` sur Render
2. Reproduire le problème
3. Capturer les logs complets:
   - Logs Render (côté serveur)
   - Network tab (côté client)
   - Console du navigateur (côté client)
4. Vérifier le fichier `AUTHENTICATION_401_DIAGNOSIS.md` pour plus de détails

## 🔗 Ressources

- [Documentation complète](./AUTHENTICATION_401_DIAGNOSIS.md)
- [Express Cookie Options](https://expressjs.com/en/api.html#res.cookie)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [CORS with Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)
