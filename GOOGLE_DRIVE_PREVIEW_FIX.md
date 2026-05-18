# 🔧 Solution erreur 403 Google Drive Preview

## 🔍 Problème identifié

L'application affichait une erreur **403 (Forbidden)** lors de l'affichage de documents Google Drive en iframe avec des URLs du type :
```
https://drive.google.com/file/d/{FILE_ID}/view?usp=docs_web
```

### Causes racines :
1. **URL incorrecte** : `/view?usp=docs_web` n'est pas optimisée pour l'embedding iframe
2. **Restrictions CORS** : Google Drive bloque les requêtes cross-origin directes
3. **X-Frame-Options** : Google empêche l'iframe de certaines URLs
4. **Authentification** : L'utilisateur doit être authentifié avec son compte Google

---

## ✅ Solution implémentée

### Architecture Backend-First
Au lieu d'accéder directement à Google Drive depuis le frontend, nous utilisons maintenant le backend comme proxy sécurisé.

### 1. **Service Google Drive** (`googledrive.service.ts`)

Ajout de nouvelles méthodes pour générer des URLs de prévisualisation :

```typescript
// URL optimisée pour iframe (sans authentification utilisateur)
getPreviewLink(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// URL avec authentification utilisateur spécifique
getPreviewLinkForUser(fileId: string, userEmail: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview?authuser=${encodeURIComponent(userEmail)}`;
}
```

### 2. **Controller Backend** (`document.controller.ts`)

Nouveau endpoint `/documents/preview-url/:id` :

```typescript
async getDocumentPreviewUrl(req: Request, res: Response) {
  // Récupère le document et sa version
  // Génère l'URL de prévisualisation sécurisée
  // Supporte l'authentification par email utilisateur
  return res.json({
    previewUrl,
    downloadUrl,
    fileId,
    version,
  });
}
```

**Route** : `GET /documents/preview-url/:id?versionId=&userEmail=`

### 3. **Hook React** (`useDocumentPreview.ts`)

```typescript
export const useGetDocumentPreviewUrl = (
  documentId: string | undefined,
  versionId?: string,
  enabled: boolean = true
) => {
  // Appelle le backend pour obtenir l'URL sécurisée
  // Cache les résultats pendant 5 minutes
  // Inclut l'email de l'utilisateur pour l'authentification
}
```

### 4. **Composant Frontend** (`DocumentPreview.tsx`)

```typescript
// Détecte si l'URL est Google Drive
const isGoogleDriveUrl = url?.includes('drive.google.com');

// Récupère l'URL sécurisée depuis le backend
const { data: previewData } = useGetDocumentPreviewUrl(
  documentId,
  versionId,
  isGoogleDriveUrl
);

// Utilise previewData.previewUrl au lieu de l'URL directe
```

---

## 🎯 Avantages de cette solution

### ✅ Sécurité
- Tokens d'accès non exposés au frontend
- Contrôle d'accès centralisé côté backend
- Authentification utilisateur Google préservée

### ✅ Fiabilité
- Plus d'erreurs 403 sur les iframes
- URLs optimisées pour l'embedding
- Gestion automatique du cache

### ✅ Flexibilité
- Support multi-versions
- Authentification par utilisateur
- URLs de téléchargement séparées

---

## 🔐 Configuration requise

Assurez-vous que les variables d'environnement suivantes sont définies :

```env
# .env (backend)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

---

## 🧪 Tests

### Backend
```bash
# Tester l'endpoint de prévisualisation
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  "http://localhost:8000/documents/preview-url/DOCUMENT_ID?userEmail=user@example.com"
```

### Frontend
```typescript
// Le composant DocumentPreview gère automatiquement :
// 1. Détection des URLs Google Drive
// 2. Appel au backend pour URL sécurisée
// 3. Affichage en iframe avec loading state
<DocumentPreview version={version} mode="view" />
```

---

## 📝 URLs Google Drive disponibles

| Type | Méthode | Usage |
|------|---------|-------|
| **Preview** | `getPreviewLink()` | Affichage iframe sans auth |
| **Preview User** | `getPreviewLinkForUser()` | Iframe avec compte Google spécifique |
| **View** | `getWebViewLink()` | Ouvrir dans nouvel onglet |
| **Download** | `getWebContentLink()` | Téléchargement direct |

---

## 🚀 Déploiement

1. **Backend** : Vérifier les variables d'environnement Google
2. **Frontend** : Aucune configuration supplémentaire requise
3. **Google Cloud** : Vérifier que les permissions OAuth incluent Google Drive API

---

## 🐛 Debugging

Si l'erreur 403 persiste :

1. **Vérifier les logs backend** :
   ```bash
   # Chercher les erreurs Google Drive
   grep "Error getting document preview URL" logs/server.log
   ```

2. **Vérifier les permissions Drive** :
   - Le fichier doit être accessible par le service account
   - Ou partagé avec l'utilisateur authentifié

3. **Tester l'URL directement** :
   ```typescript
   // Dans la console navigateur
   console.log(previewData?.previewUrl);
   // Copier l'URL et l'ouvrir dans un nouvel onglet
   ```

4. **Vérifier le refresh token** :
   ```bash
   # S'assurer que GOOGLE_REFRESH_TOKEN est valide
   echo $GOOGLE_REFRESH_TOKEN
   ```

---

## 📚 Références

- [Google Drive API - Files.get](https://developers.google.com/drive/api/v3/reference/files/get)
- [Google OAuth2](https://developers.google.com/identity/protocols/oauth2)
- [Embedding Google Drive files](https://developers.google.com/drive/api/guides/manage-sharing)
