# Guide de Migration - Validation des ObjectIds

## Utilisation des nouveaux middlewares et utilitaires

### 1. Validation dans les Routes

#### Avant
```typescript
router.get('/users/:userId', userController.getUser);
```

#### Après - Option 1: Middleware de validation
```typescript
import { validateObjectIdParam } from '@/middlewares/validation.middleware';

router.get('/users/:userId', validateObjectIdParam('userId'), userController.getUser);
```

#### Après - Option 2: Validation multiple
```typescript
import { validateObjectIdParams } from '@/middlewares/validation.middleware';

router.put(
    '/documents/:documentId/reviews/:reviewId',
    validateObjectIdParams(['documentId', 'reviewId']),
    documentController.updateReview
);
```

### 2. Validation dans les Services

#### Avant
```typescript
async getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
    });
}
```

#### Après - Option 1: Retourner null si invalide
```typescript
import { isValidObjectId } from '@/utils/validation';

async getUserById(id: string) {
    if (!isValidObjectId(id)) {
        return null;
    }
    return prisma.user.findUnique({
        where: { id },
    });
}
```

#### Après - Option 2: Lancer une exception
```typescript
import { validateObjectId } from '@/utils/validation';

async updateUser(id: string, data: any) {
    validateObjectId(id, 'userId'); // Throws if invalid
    return prisma.user.update({
        where: { id },
        data,
    });
}
```

#### Après - Option 3: Retour sécurisé
```typescript
import { safeObjectId } from '@/utils/validation';

async findUserSafely(id: string) {
    const safeId = safeObjectId(id);
    if (!safeId) {
        return null;
    }
    return prisma.user.findUnique({
        where: { id: safeId },
    });
}
```

### 3. Validation dans les Controllers

#### Avant
```typescript
getUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    // Peut crasher si userId est "undefined"
};
```

#### Après - Avec middleware
```typescript
// Route avec middleware
router.get('/users/:userId', validateObjectIdParam('userId'), userController.getUser);

// Controller - pas besoin de re-valider
getUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    // userId est déjà validé par le middleware
};
```

#### Après - Sans middleware (validation manuelle)
```typescript
import { isValidObjectId } from '@/utils/validation';

getUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    
    if (!isValidObjectId(userId)) {
        return res.status(400).json({
            error: `Invalid userId: ${userId}`,
            code: 'ERR_INVALID_OBJECT_ID',
        });
    }
    
    const user = await userService.getUserById(userId);
    // ...
};
```

### 4. Routes à Migrer en Priorité

Recherchez et mettez à jour toutes les routes avec des paramètres d'ID :

```bash
# Routes utilisateurs
/api/users/:userId
/api/users/:userId/invite
/api/users/:userId/deactivate
/api/users/:userId/activate

# Routes documents
/api/documents/:documentId
/api/documents/:documentId/versions/:versionId
/api/documents/:documentId/reviews

# Routes départements
/api/departments/:departmentId
/api/departments/:departmentId/roles

# Etc.
```

### 5. Pattern Recommandé

```typescript
// 1. Import du middleware
import { validateObjectIdParam, validateObjectIdParams } from '@/middlewares/validation.middleware';
import { authenticateToken } from '@/middlewares/auth.middleware';

// 2. Application sur les routes
router.get(
    '/documents/:documentId',
    authenticateToken,                      // Auth en premier
    validateObjectIdParam('documentId'),    // Puis validation
    documentController.getDocument          // Enfin le controller
);

// 3. Dans les services, double sécurité
import { isValidObjectId } from '@/utils/validation';

async getDocumentById(id: string) {
    if (!isValidObjectId(id)) {
        return null; // ou throw new Error()
    }
    return prisma.document.findUnique({ where: { id } });
}
```

### 6. Cas Particuliers

#### Query Parameters (non route params)
```typescript
// Si l'ID vient de query params
getUsersByIds = async (req: Request, res: Response) => {
    const { ids } = req.query; // ?ids=abc,def,ghi
    
    if (!ids || typeof ids !== 'string') {
        return res.status(400).json({ error: 'Invalid ids parameter' });
    }
    
    const idArray = ids.split(',');
    const validIds = idArray.filter(isValidObjectId);
    
    if (validIds.length === 0) {
        return res.status(400).json({ error: 'No valid ObjectIds provided' });
    }
    
    const users = await userService.getUsersByIds(validIds);
    res.json(users);
};
```

#### Body Parameters
```typescript
// Si l'ID vient du body
createRelation = async (req: Request, res: Response) => {
    const { userId, documentId } = req.body;
    
    if (!isValidObjectId(userId)) {
        return res.status(400).json({
            error: 'Invalid userId',
            code: 'ERR_INVALID_OBJECT_ID',
        });
    }
    
    if (!isValidObjectId(documentId)) {
        return res.status(400).json({
            error: 'Invalid documentId',
            code: 'ERR_INVALID_OBJECT_ID',
        });
    }
    
    // ...
};
```

### 7. Tests

Ajoutez des tests pour vos endpoints :

```typescript
describe('GET /api/users/:userId', () => {
    it('should return 400 for invalid userId', async () => {
        const response = await request(app)
            .get('/api/users/invalid-id')
            .set('Authorization', `Bearer ${validToken}`);
        
        expect(response.status).toBe(400);
        expect(response.body.code).toBe('ERR_INVALID_OBJECT_ID');
    });
    
    it('should return 400 for "undefined" userId', async () => {
        const response = await request(app)
            .get('/api/users/undefined')
            .set('Authorization', `Bearer ${validToken}`);
        
        expect(response.status).toBe(400);
    });
    
    it('should return user for valid userId', async () => {
        const response = await request(app)
            .get(`/api/users/${validObjectId}`)
            .set('Authorization', `Bearer ${validToken}`);
        
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(validObjectId);
    });
});
```

## Checklist de Migration

- [ ] Identifier toutes les routes avec des paramètres `:id`, `:userId`, etc.
- [ ] Ajouter les middlewares de validation sur ces routes
- [ ] Ajouter la validation dans les services correspondants
- [ ] Tester avec des IDs invalides ("undefined", "null", "", "invalid")
- [ ] Vérifier les logs pour d'autres erreurs "Malformed ObjectID"
- [ ] Mettre à jour les tests unitaires et d'intégration
- [ ] Documenter les nouveaux patterns dans le code

## Erreurs à Éviter

❌ **Ne pas** appeler Prisma sans validation :
```typescript
// MAUVAIS
const user = await prisma.user.findUnique({ where: { id } });
```

✅ **Toujours** valider avant Prisma :
```typescript
// BON
if (!isValidObjectId(id)) return null;
const user = await prisma.user.findUnique({ where: { id } });
```

❌ **Ne pas** ignorer les validations en développement :
```typescript
// MAUVAIS - même en dev, validez !
if (process.env.NODE_ENV === 'production' && !isValidObjectId(id)) {
    throw new Error('Invalid ID');
}
```

✅ **Toujours** valider, peu importe l'environnement :
```typescript
// BON
if (!isValidObjectId(id)) {
    throw new Error('Invalid ID');
}
```
