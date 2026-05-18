# Corrections d'Architecture d'Authentification

## Problèmes Identifiés et Résolus

### 1. **Erreur Prisma ObjectID "undefined"**
**Cause:** Le endpoint `/auth/logout/:userId` était appelé avec `undefined` comme userId
**Solution:** 
- Suppression du paramètre userId de l'URL
- Utilisation de `req.user.id` depuis le JWT décodé
- Ajout de validation stricte des ObjectIds

### 2. **Boucle Infinie entre Refresh Token et Logout**
**Cause:** Quand le refresh token expirait, le frontend appelait logout avec un userId invalide, provoquant une nouvelle erreur
**Solution:**
- Le frontend ne redirige plus vers logout en cas d'erreur de refresh
- Redirection directe vers la page de login
- Nettoyage du localStorage sans appel API

### 3. **Gestion des Tokens Expirés**
**Cause:** Gestion inconsistante des erreurs JWT (TokenExpiredError)
**Solution:**
- Codes d'erreur standardisés et structurés
- Réponses JSON cohérentes au lieu de sendStatus()
- Distinction claire entre token expiré (401) et invalide (403)

## Fichiers Modifiés

### Backend

#### 1. `server/src/controllers/auth.controller.ts`
```typescript
// Avant
router.post('/logout/:userId', authController.logout);
logout = async (req: Request, res: Response) => {
    const { userId } = req.params;
    // ...
}

// Après
router.post('/logout', authenticateToken, authController.logout);
logout = async (req: Request, res: Response) => {
    const userId = req.user?.id; // Depuis JWT
    // ...
}
```

**Changements clés:**
- ✅ Logout utilise `req.user.id` au lieu d'un paramètre URL
- ✅ Validation stricte de l'utilisateur
- ✅ Gestion d'erreur avec try/catch
- ✅ Refresh token amélioré avec validations
- ✅ Codes d'erreur standardisés

#### 2. `server/src/routes/auth.routes.ts`
```typescript
// Avant
router.post('/logout/:userId', authController.logout);

// Après
import { authenticateToken } from '@/middlewares/auth.middleware';
router.post('/logout', authenticateToken, authController.logout);
```

**Changements clés:**
- ✅ Route sans paramètre userId
- ✅ Middleware `authenticateToken` obligatoire

#### 3. `server/src/middlewares/auth.middleware.ts`
```typescript
// Avant
if (token == null) return res.sendStatus(401);

// Après
if (!token) {
    return res.status(401).json({
        error: 'No token provided',
        code: 'ERR_NO_TOKEN',
    });
}
```

**Changements clés:**
- ✅ Réponses JSON structurées au lieu de sendStatus()
- ✅ Codes d'erreur explicites
- ✅ Validation du payload JWT
- ✅ Gestion détaillée des TokenExpiredError et JsonWebTokenError

#### 4. `server/src/services/user.service.ts`
```typescript
import { isValidObjectId } from '@/utils/validation';

async getUserById(id: string) {
    if (!isValidObjectId(id)) {
        return null;
    }
    // ...
}
```

**Changements clés:**
- ✅ Validation stricte dans toutes les méthodes
- ✅ Prévention des erreurs Prisma "Malformed ObjectID"

#### 5. `server/src/utils/validation.ts` (nouveau fichier)
```typescript
export function isValidObjectId(id: any): boolean {
    if (!id || typeof id !== 'string') return false;
    if (id === 'undefined' || id === 'null' || id.trim() === '') return false;
    return Types.ObjectId.isValid(id);
}
```

**Changements clés:**
- ✅ Utilitaire de validation MongoDB ObjectId
- ✅ Détection de chaînes "undefined" et "null"
- ✅ Validation stricte avant Prisma

#### 6. `server/src/middlewares/validation.middleware.ts` (nouveau fichier)
Middleware réutilisable pour valider les ObjectIds dans les routes.

### Frontend

#### 1. `client/src/configs/api.ts`
```typescript
// Avant
LOGOUT: (userId: string) => `/auth/logout/${userId}`,

// Après
LOGOUT: "/auth/logout",
```

**Changements clés:**
- ✅ Endpoint sans paramètre userId

#### 2. `client/src/services/authService.ts`
```typescript
// Avant
logout: async (id?: string) => {
    return axios.post(API.ENDPOINTS.AUTH.LOGOUT(id));
}

// Après
logout: async () => {
    return axios.post(API.ENDPOINTS.AUTH.LOGOUT);
}
```

**Changements clés:**
- ✅ Pas de paramètre userId
- ✅ Token JWT envoyé automatiquement via intercepteur

#### 3. `client/src/lib/axios.ts`
```typescript
// Avant
catch (refreshError) {
    AuthService.logout().then(() => {
        localStorage.setItem(env.ACCESS_TOKEN_KEY, "");
    });
    // ...
}

// Après
catch (refreshError: any) {
    accessToken = null;
    localStorage.removeItem(env.ACCESS_TOKEN_KEY);
    processQueue(undefined);
    
    if (refreshError?.response?.status === 401) {
        window.location.href = '/#/login';
    }
    // ...
}
```

**Changements clés:**
- ✅ Pas d'appel à logout() en cas d'erreur de refresh
- ✅ Redirection directe vers login
- ✅ Nettoyage du token local
- ✅ Prévention de la boucle infinie

## Codes d'Erreur Standardisés

| Code | Signification | Status HTTP |
|------|---------------|-------------|
| `ERR_INVALID_CREDENTIALS` | Email/mot de passe invalide | 400 |
| `ERR_USER_INACTIVE` | Utilisateur désactivé | 400 |
| `ERR_USER_NOT_FOUND` | Utilisateur introuvable | 404 |
| `ERR_NO_TOKEN` | Token absent | 401 |
| `ERR_TOKEN_EXPIRED` | Token expiré | 401 |
| `ERR_INVALID_TOKEN` | Token invalide | 403 |
| `ERR_NO_REFRESH_TOKEN` | Refresh token absent | 401 |
| `ERR_REFRESH_TOKEN_EXPIRED` | Refresh token expiré | 401 |
| `ERR_INVALID_REFRESH_TOKEN` | Refresh token invalide | 401 |
| `ERR_UNAUTHORIZED` | Non autorisé | 401 |
| `ERR_INVALID_OBJECT_ID` | ObjectId MongoDB invalide | 400 |
| `ERR_SERVER_ERROR` | Erreur serveur | 500 |

## Flux d'Authentification Corrigé

### Login
1. User envoie email/password
2. Backend valide et génère accessToken + refreshToken
3. accessToken dans header Authorization
4. refreshToken dans cookie HttpOnly
5. Frontend stocke accessToken dans localStorage

### Requêtes Authentifiées
1. Frontend ajoute `Authorization: Bearer <token>` (via intercepteur)
2. Backend valide le token avec middleware `authenticateToken`
3. `req.user` est populé avec les infos utilisateur

### Refresh Token
1. Si 401, frontend tente automatiquement refresh
2. Backend valide refreshToken (cookie)
3. Retourne nouveau accessToken
4. Frontend met à jour localStorage et retry la requête

### Logout
1. Frontend appelle `POST /auth/logout` (avec token JWT)
2. Backend identifie user via `req.user.id`
3. Cookie refreshToken supprimé
4. Frontend nettoie localStorage

### Gestion Token Expiré
1. Si refresh échoue avec 401
2. Frontend nettoie localStorage
3. Redirection vers `/login`
4. **AUCUN appel à logout** (évite la boucle)

## Bonnes Pratiques Appliquées

✅ **Validation avant Prisma:** Tous les IDs sont validés avant requête DB
✅ **Pas d'ID dans URL pour logout:** Utilisation JWT uniquement
✅ **Codes d'erreur structurés:** Format JSON cohérent
✅ **Gestion Token Expiry:** Distinction claire expiré vs invalide
✅ **Prévention Boucles:** Pas de logout sur refresh error
✅ **Sécurité:** refreshToken en HttpOnly cookie
✅ **TypeScript strict:** Validations de type
✅ **Middleware réutilisable:** Authentification et validation

## Tests à Effectuer

1. ✅ Login avec credentials valides
2. ✅ Login avec credentials invalides
3. ✅ Logout normal
4. ✅ Requête avec token expiré → auto-refresh
5. ✅ Requête avec refresh token expiré → redirect login
6. ✅ Requête avec token invalide → 403
7. ✅ Logout sans token → 401
8. ✅ Appels multiples simultanés avec token expiré (queue)
9. ✅ Validation ObjectId invalide → 400 ERR_INVALID_OBJECT_ID
10. ✅ Pas de boucle infinie entre refresh et logout

## Migration

Aucune migration DB nécessaire. Les changements sont uniquement dans la logique applicative.

## Points d'Attention

⚠️ **Breakpoint:** Les applications frontend existantes utilisant l'ancien endpoint `/auth/logout/:userId` doivent être mises à jour.

⚠️ **Cookie SameSite:** Assurez-vous que `sameSite: 'strict'` est compatible avec votre configuration domaine/sous-domaine.

⚠️ **Production:** Vérifiez que `secure: true` est activé en production pour les cookies.
