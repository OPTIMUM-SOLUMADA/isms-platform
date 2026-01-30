# ✅ Guide de test - Fix erreur 403 Google Drive

## 🧪 Tests à effectuer

### 1. Test Backend (API)

#### a) Vérifier que l'endpoint répond correctement

```bash
# Remplacer YOUR_JWT_TOKEN et DOCUMENT_ID
curl -X GET "http://localhost:8000/documents/preview-url/DOCUMENT_ID?userEmail=test@example.com" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Réponse attendue :**
```json
{
  "previewUrl": "https://drive.google.com/file/d/{FILE_ID}/preview?authuser=test@example.com",
  "downloadUrl": "https://drive.google.com/uc?id={FILE_ID}&export=download",
  "fileId": "{FILE_ID}",
  "version": "1.0.0"
}
```

#### b) Test sans userEmail (sans authentification spécifique)

```bash
curl -X GET "http://localhost:8000/documents/preview-url/DOCUMENT_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Test Frontend

#### a) Ouvrir la page de révision d'un document

1. Se connecter à l'application
2. Naviguer vers `/reviews` ou ouvrir directement `ReviewApprovalPage`
3. Ouvrir la console du navigateur (F12)
4. Vérifier qu'il n'y a **pas d'erreur 403**

#### b) Vérifier les requêtes réseau

Dans l'onglet **Network** (Réseau) :
- Chercher une requête vers `/documents/preview-url/{ID}`
- Status devrait être **200 OK**
- Response devrait contenir `previewUrl`, `downloadUrl`, `fileId`

#### c) Vérifier l'iframe

Dans l'onglet **Elements** (Éléments) :
- Chercher `<iframe>` dans le DOM
- L'attribut `src` devrait contenir `/preview` au lieu de `/view?usp=docs_web`
- Exemple : `https://drive.google.com/file/d/{FILE_ID}/preview`

### 3. Tests de cas limites

#### a) Document sans version actuelle

```typescript
// Le backend devrait retourner 404
// Frontend devrait afficher un message d'erreur gracieux
```

#### b) Document Google Docs natif (vs PDF uploadé)

- Tester avec un Google Docs/Sheets/Slides
- Tester avec un PDF uploadé sur Google Drive
- Les deux devraient fonctionner

#### c) Mode édition vs mode lecture

```tsx
// Mode édition (draftUrl)
<DocumentPreview version={version} mode="edit" />

// Mode lecture (fileUrl)
<DocumentPreview version={version} mode="view" />
```

### 4. Test de performance

#### a) Vérifier le cache

```typescript
// Dans la console navigateur
// 1ère requête : devrait faire un appel API
// 2ème requête dans les 5 minutes : devrait utiliser le cache React Query
```

#### b) Loading state

- Vérifier qu'un spinner apparaît pendant le chargement
- Le composant `CircleLoading` devrait s'afficher brièvement

### 5. Test de régression

Vérifier que les anciennes URLs fonctionnent toujours :

```typescript
// URLs non-Google Drive devraient continuer à fonctionner
version.fileUrl = "https://docs.google.com/document/d/ABC123/edit";
version.fileUrl = "https://autre-service.com/document.pdf";
```

---

## 🐛 Problèmes possibles et solutions

### Problème 1 : Toujours erreur 403

**Causes possibles :**
- Token Google invalide/expiré
- Permissions Drive insuffisantes
- Fichier non partagé avec le service account

**Solution :**
```bash
# Vérifier les variables d'environnement
echo $GOOGLE_REFRESH_TOKEN
echo $GOOGLE_CLIENT_ID

# Régénérer un refresh token si nécessaire
# https://developers.google.com/oauthplayground/
```

### Problème 2 : Page blanche dans l'iframe

**Causes possibles :**
- URL incorrecte (contient encore `/view` au lieu de `/preview`)
- X-Frame-Options bloque l'iframe

**Solution :**
```javascript
// Dans la console, vérifier l'URL de l'iframe
document.querySelector('iframe').src
// Devrait contenir '/preview'
```

### Problème 3 : Erreur "Document not found"

**Causes possibles :**
- ID document incorrect
- Version supprimée
- Permissions utilisateur insuffisantes

**Solution :**
```sql
-- Vérifier dans la base de données
SELECT id, title, status FROM "Document" WHERE id = 'DOCUMENT_ID';
SELECT id, version, "isCurrent", "googleDriveFileId" 
FROM "DocumentVersion" 
WHERE "documentId" = 'DOCUMENT_ID';
```

### Problème 4 : Requête réseau lente

**Causes possibles :**
- API Google Drive lente
- Middleware d'authentification lent

**Solution :**
```typescript
// Vérifier les logs backend
// Chercher les temps de réponse
console.time('getDocumentPreviewUrl');
// ... code
console.timeEnd('getDocumentPreviewUrl');
```

---

## ✨ Checklist finale

- [ ] Backend démarre sans erreur
- [ ] Route `/documents/preview-url/:id` accessible
- [ ] Hook `useGetDocumentPreviewUrl` fonctionne
- [ ] Composant `DocumentPreview` affiche l'iframe
- [ ] Pas d'erreur 403 dans la console
- [ ] URLs contiennent `/preview` au lieu de `/view?usp=docs_web`
- [ ] Loading state s'affiche correctement
- [ ] Cache React Query fonctionne (5 min)
- [ ] Mode édition et lecture fonctionnent tous les deux
- [ ] Authentification utilisateur Google préservée

---

## 📊 Métriques de succès

- **Taux d'erreur 403** : devrait être 0%
- **Temps de chargement iframe** : < 2 secondes
- **Cache hit rate** : > 80% après la 1ère visite
- **Satisfaction utilisateur** : documents visibles sans erreur

---

## 📞 Support

Si problème persiste :
1. Vérifier les logs backend : `tail -f logs/server.log`
2. Vérifier la console frontend : F12 → Console
3. Vérifier les permissions Google Drive
4. Consulter [GOOGLE_DRIVE_PREVIEW_FIX.md](./GOOGLE_DRIVE_PREVIEW_FIX.md)
