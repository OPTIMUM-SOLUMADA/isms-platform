# Guide de test rapide pour le login

## 🚀 Test rapide du login

### Option 1: Script de diagnostic simple

```bash
# Test en local avec credentials par défaut
node quick-test-login.js

# Test en local avec credentials personnalisés
node quick-test-login.js http://localhost:8000 your@email.com YourPassword

# Test sur Render
node quick-test-login.js https://your-api.onrender.com admin@example.com Admin@123
```

### Option 2: Test avec curl

```bash
# Test en local
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}' \
  -v

# Test sur Render
curl -X POST https://your-api.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}' \
  -v
```

### Option 3: Test complet des endpoints

```bash
# Test en local
node test-auth-endpoints.js http://localhost:8000

# Test sur Render (avec credentials)
TEST_USER_EMAIL=admin@example.com TEST_USER_PASSWORD=Admin@123 \
  node test-auth-endpoints.js https://your-api.onrender.com
```

## 🔍 Interpréter les erreurs

### Erreur: "ECONNREFUSED"
```
❌ Request error: connect ECONNREFUSED 127.0.0.1:8000
```
**Solution**: Le serveur n'est pas démarré
```bash
npm run dev
```

### Erreur: "ERR_INVALID_CREDENTIALS"
```json
{
  "error": "Invalid email or password",
  "code": "ERR_INVALID_CREDENTIALS"
}
```
**Solutions**:
1. Vérifier que l'utilisateur existe dans la base de données
2. Vérifier le mot de passe
3. Créer un utilisateur de test :

```bash
# Depuis le serveur, créer un utilisateur
npm run prisma:studio
# Ou
npx prisma studio
```

### Erreur: "ERR_USER_INACTIVE"
```json
{
  "error": "User is inactive. Please contact admin.",
  "code": "ERR_USER_INACTIVE"
}
```
**Solution**: Activer l'utilisateur dans la base de données
```sql
UPDATE "User" SET "isActive" = true WHERE email = 'admin@example.com';
```

### Erreur: Response vide ou malformée
```
body: { rawBody: "", parseError: "..." }
```
**Solutions**:
1. Vérifier les logs du serveur
2. Vérifier la configuration de la base de données
3. Vérifier que toutes les variables d'environnement sont définies

## ✅ Réponse attendue en cas de succès

```
📥 Response received:
   Status: 200 OK
   Headers: {
     "authorization": "Bearer eyJhbGc...",
     "set-cookie": ["refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=None"]
   }

📄 Response body:
{
  "id": "uuid-here",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "ADMIN"
}

✅ Login successful!

🔑 Token information:
   Authorization header: ✅ Present
   Token length: 156 chars
   Refresh cookie: ✅ Present
   Cookies: refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=None
```

## 🔧 Créer un utilisateur de test

Si vous n'avez pas d'utilisateur de test, créez-en un :

### Option 1: Via Prisma Studio
```bash
npx prisma studio
```
Puis créer un utilisateur avec :
- Email: `admin@example.com`
- Name: `Admin User`
- Role: `ADMIN`
- Password Hash: (générer avec bcrypt)
- isActive: `true`

### Option 2: Via un script seed
Créer `server/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      passwordHash: hashedPassword,
      isActive: true,
    },
  });

  console.log('Created admin user:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Puis exécuter :
```bash
npx tsx prisma/seed.ts
```

## 📊 Checklist de vérification

Avant de tester le login, vérifier :

- [ ] Le serveur est démarré (`npm run dev`)
- [ ] La base de données est accessible (vérifier `DATABASE_URL`)
- [ ] Un utilisateur de test existe dans la DB
- [ ] L'utilisateur est actif (`isActive = true`)
- [ ] Le mot de passe est correct
- [ ] Les variables d'environnement JWT sont configurées :
  - `JWT_ACCESS_SECRET`
  - `JWT_REFRESH_SECRET`
  - `JWT_ACCESS_EXPIRES_IN`
  - `JWT_REFRESH_SHORT_EXPIRES_IN`
- [ ] CORS est correctement configuré (`CORS_ORIGIN`)

## 🆘 En cas de problème persistant

1. **Vérifier les logs du serveur** :
   ```bash
   # Les logs devraient montrer
   [AUTH_LOGIN] Setting cookie with options: {...}
   ```

2. **Activer le mode debug** :
   ```bash
   DEBUG_AUTH=true npm run dev
   ```

3. **Vérifier la base de données** :
   ```bash
   npx prisma studio
   ```

4. **Consulter la documentation complète** :
   - `AUTHENTICATION_401_DIAGNOSIS.md`
   - `AUTH_DIAGNOSTIC_GUIDE.md`
