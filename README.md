<div align="center">

# 🛡️ ISMS Platform — Solumada

### Système de Management de la Sécurité de l'Information

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Prisma_ORM-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-OPTIMUM--SOLUMADA-181717?style=flat-square&logo=github)](https://github.com/OPTIMUM-SOLUMADA/isms-platform)

</div>

---

## 📋 Table des matières

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Scripts disponibles](#-scripts-disponibles)
- [Workflow documentaire](#-workflow-documentaire)
- [Sécurité](#-sécurité)
- [API](#-api)
- [Base de données](#-base-de-données)
- [Déploiement](#-déploiement)
- [Bonnes pratiques](#-bonnes-pratiques)
- [Roadmap](#-roadmap)
- [Auteur & Licence](#-auteur--licence)

---

## 🎯 Présentation

**ISMS Platform** est une application fullstack d'entreprise développée par **Solumada** pour centraliser et automatiser la gestion des documents de sécurité de l'information conformément aux normes **ISO 27001** et aux exigences d'un Système de Management de la Sécurité de l'Information (SMSI).

### Objectifs

- 📂 **Centraliser** la gestion documentaire liée à la sécurité de l'information
- 🔄 **Automatiser** le cycle de vie des documents (création → revue → approbation → archivage)
- 👥 **Structurer** la collaboration entre auteurs, reviewers et approbateurs
- 📊 **Assurer** la traçabilité complète via un journal d'audit
- ✅ **Mesurer** la conformité ISO en temps réel
- 🔔 **Notifier** automatiquement les parties prenantes à chaque étape

---

## ✨ Fonctionnalités

| Catégorie | Fonctionnalités |
|-----------|----------------|
| 🔐 **Authentification** | Connexion JWT, refresh token, reset mot de passe, invitation par email |
| 📄 **Documents** | Création, édition, versioning, upload, prévisualisation Google Drive |
| 🔁 **Workflow** | Soumission → Revue → Approbation → Publication → Archivage |
| 👓 **Reviews** | Assignation de reviewers, décisions (approuver / rejeter / demander modifications) |
| ✅ **Approbation** | Workflow d'approbation finale par les responsables |
| 📜 **Versions** | Historique complet des versions, diff entre versions |
| 👤 **Utilisateurs** | Gestion des comptes, rôles, départements, postes |
| 🔔 **Notifications** | Alertes in-app et emails transactionnels (Resend / SMTP) |
| 📊 **Tableau de bord** | Vue globale : documents en attente, statistiques, conformité |
| 🗂️ **Conformité** | Suivi de conformité par clause ISO, statuts COMPLIANT / NON_COMPLIANT |
| 📋 **Audit** | Journal d'audit complet de toutes les actions (connexion, modification, approbation…) |
| 📁 **Google Drive** | Stockage des fichiers sur Google Drive avec gestion des permissions |
| 🏢 **Départements** | Arborescence Département → Poste → Utilisateur |
| 📤 **Export Excel** | Export des données en format Excel |

---

## 🏗️ Architecture

```
isms-platform/
├── client/                     # Frontend React + Vite + TypeScript
│   ├── src/
│   │   ├── components/         # Composants UI réutilisables (shadcn/ui)
│   │   ├── pages/              # Pages de l'application (routing)
│   │   ├── templates/          # Templates de layout et de formulaires
│   │   ├── hooks/              # Custom hooks (React Query, logique métier)
│   │   ├── services/           # Couche API (Axios)
│   │   ├── stores/             # Gestion d'état global (Zustand)
│   │   ├── contexts/           # Contextes React (Auth, Theme…)
│   │   ├── types/              # Types TypeScript partagés
│   │   ├── lib/                # Utilitaires et helpers
│   │   └── configs/            # Configuration i18n, routing
│   └── public/
│
├── server/                     # Backend Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/        # Logique métier des endpoints
│   │   ├── services/           # Services métier (BDD, email, Google…)
│   │   ├── routes/             # Définition des routes Express
│   │   ├── middlewares/        # Auth, validation, audit, upload
│   │   ├── configs/            # Configuration (env, email, Google OAuth)
│   │   ├── validators/         # Schémas de validation Zod
│   │   ├── utils/              # Fonctions utilitaires
│   │   ├── types/              # Types TypeScript (Express, custom)
│   │   ├── jobs/               # Tâches planifiées (reminders)
│   │   └── database/           # Client Prisma
│   └── prisma/
│       └── schema.prisma       # Modèles de données MongoDB
│
└── package.json                # Root workspace
```

### Flux d'une requête

```
Client (React) → Axios → Express Router → Middleware Auth/Validate
              → Controller → Service → Prisma → MongoDB Atlas
              ← JSON Response ← ← ← ← ← ← ← ← ←
```

---

## 🛠️ Technologies

### Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 18.x | Framework UI |
| **TypeScript** | 5.x | Typage statique |
| **Vite** | 5.x | Build tool & dev server |
| **React Router DOM** | 7.x | Routing client-side (Hash Router) |
| **TanStack Query** | 5.x | Gestion du cache et des requêtes serveur |
| **Zustand** | 5.x | État global |
| **React Hook Form** | 7.x | Gestion des formulaires |
| **Zod** | 3.x | Validation des données |
| **shadcn/ui + Radix UI** | — | Composants accessibles |
| **Tailwind CSS** | 3.x | Styles utilitaires |
| **Framer Motion** | 12.x | Animations |
| **Recharts** | 2.x | Graphiques et tableaux de bord |
| **i18next** | 25.x | Internationalisation |
| **Axios** | 1.x | Client HTTP |
| **Lucide React** | — | Icônes |

### Backend

| Technologie | Version | Usage |
|------------|---------|-------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | 4.x | Framework HTTP |
| **TypeScript** | 5.x | Typage statique |
| **Prisma ORM** | — | Accès base de données |
| **Zod** | 3.x | Validation des entrées |
| **jsonwebtoken** | — | Authentification JWT |
| **bcrypt** | — | Hachage des mots de passe |
| **Nodemailer** | — | Envoi d'emails SMTP |
| **Resend** | — | Service email transactionnel |
| **Multer** | — | Upload de fichiers |
| **express-rate-limit** | — | Protection contre le brute force |
| **googleapis** | — | Intégration Google Drive |
| **ts-node-dev** | — | Hot reload en développement |

### Base de données & Infrastructure

| Technologie | Usage |
|------------|-------|
| **MongoDB Atlas** | Base de données NoSQL cloud |
| **Prisma ORM** | Modélisation & requêtes type-safe |
| **Google Drive API** | Stockage des fichiers documentaires |
| **Resend** | Emails transactionnels fiables |

---

## 🚀 Installation

### Prérequis

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Un compte **MongoDB Atlas** (ou instance MongoDB locale)
- Un compte **Google Cloud** avec Google Drive API activée
- Un compte **Resend** (ou serveur SMTP)

### 1. Cloner le projet

```bash
git clone https://github.com/OPTIMUM-SOLUMADA/isms-platform.git
cd isms-platform
```

### 2. Installer les dépendances

```bash
# Dépendances racine (husky)
npm install

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configurer les variables d'environnement

```bash
# Créer le fichier .env du backend
cp server/.env.example server/.env
# Éditez server/.env avec vos valeurs
```

Voir la section [Variables d'environnement](#-variables-denvironnement) pour le détail complet.

### 4. Générer le client Prisma

```bash
cd server
npx prisma generate
```

### 5. Initialiser les données de base

```bash
cd server
npm run dev
# Les tables de base (Owners, DocumentTypes, ISO Clauses) sont initialisées automatiquement au démarrage
```

### 6. Lancer l'application

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

L'application est accessible sur :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8080

### 7. Connecter Google Drive *(optionnel)*

Accédez à `http://localhost:8080/google-drive/auth` pour autoriser l'accès à Google Drive. Cette étape est nécessaire pour l'upload et la prévisualisation de documents. Les tokens OAuth2 sont stockés en base de données et persistent entre les redémarrages.

---

## 🔑 Variables d'environnement

Créez le fichier `server/.env` à partir du modèle suivant :

```env
# ─── BASE DE DONNÉES ─────────────────────────────────────────
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority

# ─── SERVEUR ─────────────────────────────────────────────────
PORT=8080
NODE_ENV=development         # development | production | test

# ─── CORS ────────────────────────────────────────────────────
CORS_ORIGIN=http://localhost:5173

# ─── JWT ─────────────────────────────────────────────────────
JWT_ACCESS_SECRET=votre_secret_access_tres_long_et_complexe
JWT_REFRESH_SECRET=votre_secret_refresh_tres_long_et_complexe
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SHORT_EXPIRES_IN=1d
JWT_REFRESH_LONG_EXPIRES_IN=30d
JWT_RESET_EXPIRES_IN=2h
JWT_ISSUER=isms-solumada

# ─── SÉCURITÉ ────────────────────────────────────────────────
BCRYPT_SALT_ROUNDS=12
REFRESH_TOKEN_COOKIE_NAME=refreshToken
REFRESH_TOKEN_COOKIE_SECURE=true

# ─── EMAIL (SMTP) ─────────────────────────────────────────────
SMTP_HOST=smtp.votre-serveur.com
SMTP_PORT=587
SMTP_USER=votre@email.com
SMTP_USER_NOREPLY=noreply@votredomaine.com
SMTP_PASS=votre_mot_de_passe_smtp
SMTP_SECURE=false

# ─── EMAIL (RESEND — recommandé en production) ───────────────
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ─── ORGANISATION ─────────────────────────────────────────────
ORG_NAME=Nom de votre organisation

# ─── GOOGLE DRIVE ────────────────────────────────────────────
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:8080/google-drive/oauth2callback
GOOGLE_DRIVE_WORKING_FOLDER_NAME=ISMS Documents

# ─── STOCKAGE FICHIERS ────────────────────────────────────────
# STORAGE_PATH=/var/data          # En production sur Render
```

### Description des variables

| Variable | Description | Obligatoire |
|----------|-------------|:-----------:|
| `DATABASE_URL` | URI de connexion MongoDB Atlas | ✅ |
| `JWT_ACCESS_SECRET` | Clé secrète pour signer les access tokens (min. 32 chars) | ✅ |
| `JWT_REFRESH_SECRET` | Clé secrète pour signer les refresh tokens (min. 32 chars) | ✅ |
| `JWT_ACCESS_EXPIRES_IN` | Durée de validité de l'access token (ex : `15m`) | ✅ |
| `JWT_REFRESH_LONG_EXPIRES_IN` | Durée du refresh token avec "Se souvenir de moi" (ex : `30d`) | ✅ |
| `SMTP_HOST` | Hôte du serveur SMTP | ⚠️ Si pas Resend |
| `SMTP_PORT` | Port SMTP (587 pour TLS, 465 pour SSL) | ⚠️ Si pas Resend |
| `SMTP_USER` | Adresse email expéditrice | ⚠️ Si pas Resend |
| `SMTP_PASS` | Mot de passe SMTP | ⚠️ Si pas Resend |
| `RESEND_API_KEY` | Clé API Resend (prioritaire sur SMTP si défini) | ⚠️ Recommandé |
| `GOOGLE_CLIENT_ID` | ID client OAuth2 Google Cloud | ⚠️ Pour Drive |
| `GOOGLE_CLIENT_SECRET` | Secret OAuth2 Google Cloud | ⚠️ Pour Drive |
| `GOOGLE_REDIRECT_URI` | URI de callback OAuth2 (doit correspondre à Google Cloud Console) | ⚠️ Pour Drive |
| `ORG_NAME` | Nom affiché dans les emails | ❌ |
| `BCRYPT_SALT_ROUNDS` | Facteur de coût bcrypt (défaut : 12) | ❌ |
| `STORAGE_PATH` | Chemin de stockage local des fichiers | ❌ |

---

## 📦 Scripts disponibles

### Backend (`server/`)

```bash
# Démarrage en développement (hot reload via ts-node-dev)
npm run dev

# Compilation TypeScript pour production
npm run build

# Lancement en production (depuis dist/)
npm start

# Linting
npm run lint

# Tests
npm run test
npm run test:watch
```

> ⚠️ **Important** : Toujours utiliser `npm run dev` pendant le développement. `npm start` exécute le code compilé depuis `dist/` et ne reflétera pas les modifications de code source.

### Frontend (`client/`)

```bash
# Démarrage en développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Linting
npm run lint
```

### Prisma

```bash
cd server

# Générer le client Prisma (après modification du schema)
npx prisma generate

# Pousser le schema vers MongoDB (dev)
npx prisma db push

# Ouvrir Prisma Studio (interface visuelle BDD)
npx prisma studio

# Créer une migration (si migration classique)
npx prisma migrate dev --name nom_de_la_migration
```

---

## 🔄 Workflow documentaire

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  CRÉATION   │───▶│   REVUE      │───▶│  APPROBATION   │───▶│   PUBLIÉ     │
│  (DRAFT)    │    │ (IN_REVIEW)  │    │  (APPROVED)    │    │  (ACTIVE)    │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ MODIFICATIONS │
                   │   DEMANDÉES  │
                   │(REQ_CHANGES) │
                   └──────────────┘
```

### Étapes détaillées

| Étape | Acteur | Action | Résultat |
|-------|--------|--------|----------|
| **1. Création** | Contributeur | Remplit le formulaire, upload le fichier, assigne reviewers | Document `DRAFT` créé + fichier uploadé sur Google Drive |
| **2. Assignation** | Système | Crée automatiquement les `DocumentReview` pour chaque reviewer | Reviewers notifiés par email |
| **3. Revue** | Reviewer | Consulte le document, rend sa décision | `APPROVE` / `REJECT` / `REQUEST_CHANGES` |
| **4. Modifications** | Contributeur | Si modifications demandées : upload nouvelle version | Nouveau cycle de revue déclenché |
| **5. Approbation** | Gestionnaire | Valide la décision finale après toutes les revues | Document passe en `APPROVED` |
| **6. Publication** | Système | Document disponible pour consultation | Conformité mise à jour en `COMPLIANT` |
| **7. Archivage** | Gestionnaire | Document obsolète archivé | Document retiré de la liste active |

### Versioning

Chaque nouvelle version suit le format `vMAJEUR.MINEUR` :
- **Majeur** : nouvelle version après modifications substantielles
- **Mineur** : corrections mineures (patch)

L'historique complet est conservé, chaque version est accessible et liée à son fichier Google Drive.

---

## 🔒 Sécurité

### Authentification JWT

```
┌──────────┐  login  ┌─────────┐  access token (15m)   ┌────────────┐
│  Client  │────────▶│   API   │──────────────────────▶│  Resource  │
│          │◀────────│         │                        │            │
│  Cookie  │  refresh│         │  refresh token (1-30j) │            │
│ httpOnly │◀────────│         │                        │            │
└──────────┘         └─────────┘                        └────────────┘
```

- **Access token** : courte durée de vie (15 min), transmis dans le header `Authorization`
- **Refresh token** : longue durée (1j ou 30j selon "Se souvenir de moi"), stocké en cookie `httpOnly`
- **Rotation** : le refresh token est régénéré à chaque renouvellement

### Mesures de sécurité implémentées

| Mesure | Détail |
|--------|--------|
| 🔑 **Hachage passwords** | bcrypt avec salt rounds = 12 |
| 🛡️ **Rate limiting** | 10 tentatives / 15 min sur `/auth/login` |
| 🍪 **Cookie sécurisé** | `httpOnly`, `sameSite: strict`, `secure` en production |
| 🔐 **Validation entrées** | Zod sur tous les endpoints (body, params, query) |
| 🚫 **Pas d'exposition** | `passwordHash`, `passwordResetToken` exclus de toutes les réponses |
| 🔒 **Complexité password** | Min. 8 chars, majuscule, minuscule, chiffre, caractère spécial |
| 🏷️ **Autorisation RBAC** | Middleware de vérification des rôles sur chaque route sensible |
| 📝 **Audit trail** | Toutes les actions critiques sont journalisées |

### Rôles et permissions

| Rôle | Description | Accès |
|------|-------------|-------|
| `ADMIN` | Administrateur système | Accès complet |
| `CONTRIBUTOR` | Auteur de documents | Créer, modifier ses documents |
| `REVIEWER` | Réviseur | Consulter et réviser les documents assignés |
| `VIEWER` | Lecteur | Consultation uniquement |

---

## 🌐 API

### Structure des endpoints

```
POST   /auth/login                     # Connexion
POST   /auth/refresh                   # Renouvellement du token
POST   /auth/logout                    # Déconnexion
POST   /auth/request-password-reset    # Demande reset mot de passe
POST   /auth/change-password           # Changement de mot de passe
POST   /auth/verify-account            # Vérification du compte

GET    /documents                      # Liste des documents
POST   /documents                      # Créer un document
GET    /documents/:id                  # Détail d'un document
PUT    /documents/:id                  # Modifier un document
DELETE /documents/:id                  # Supprimer un document

GET    /document-reviews               # Liste des revues
POST   /document-reviews               # Créer une revue
GET    /document-reviews/:id           # Détail d'une revue
POST   /document-reviews/:id/decision  # Soumettre une décision
GET    /document-reviews/user/:userId  # Revues d'un utilisateur

GET    /users                          # Liste des utilisateurs
POST   /users                          # Créer un utilisateur
GET    /users/:id                      # Détail utilisateur
PUT    /users/:id                      # Modifier utilisateur

GET    /notifications/:userId          # Notifications d'un utilisateur
PATCH  /notifications/:id/read         # Marquer comme lue

GET    /audit                          # Journal d'audit
GET    /compliance                     # Données de conformité
```

### Authentification des requêtes

```http
GET /documents HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemple de réponse

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Politique de Sécurité",
  "status": "IN_REVIEW",
  "version": "v1.0",
  "reviewers": [
    { "id": "...", "name": "Jean Dupont", "email": "jean@solumada.mg" }
  ],
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

---

## 🗄️ Base de données

### Modèles principaux (Prisma / MongoDB)

```
User ──────────────────── DocumentReview
 │                              │
 ├── DocumentAuthor ────── Document ──── DocumentVersion
 │                              │
 ├── DocumentReviewer ──── ISOClause
 │                              │
 └── Notification         ClauseCompliance
                                │
                          DocumentApproval
                                │
                    Department ── DepartmentRole ── DepartmentRoleUser
```

### Relations clés

| Modèle | Description |
|--------|-------------|
| `User` | Comptes utilisateurs avec rôles (`ADMIN`, `CONTRIBUTOR`, `REVIEWER`, `VIEWER`) |
| `Document` | Document ISMS avec métadonnées, statut, clause ISO liée |
| `DocumentVersion` | Versions successives d'un document, lien vers Google Drive |
| `DocumentReview` | Instance de revue assignée à un reviewer pour une version donnée |
| `DocumentApproval` | Approbation finale d'un document |
| `ISOClause` | Référentiel des clauses ISO 27001 |
| `ClauseCompliance` | Statut de conformité d'un document par rapport à sa clause |
| `AuditLog` | Journal immuable de toutes les actions |
| `Notification` | Alertes in-app pour les utilisateurs |
| `GoogleAccount` | Tokens OAuth2 Google Drive stockés en base |
| `Department` | Structure organisationnelle |
| `DepartmentRole` | Postes au sein des départements |

---

## 🚢 Déploiement

### Render (recommandé)

**Backend — Web Service :**
```
Build Command  : cd server && npm install && npm run build
Start Command  : cd server && npm start
```

**Frontend — Static Site :**
```
Root Directory : client
Build Command  : npm run build
Publish Dir    : dist
```

**Variables d'environnement à configurer sur Render :**
```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://...
JWT_ACCESS_SECRET=<secret_long_et_aleatoire>
JWT_REFRESH_SECRET=<secret_long_et_aleatoire>
RESEND_API_KEY=re_...
CORS_ORIGIN=https://votre-frontend.onrender.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://votre-api.onrender.com/google-drive/oauth2callback
STORAGE_PATH=/var/data
```

### Docker (optionnel)

```dockerfile
# server/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
COPY prisma/ ./prisma/
RUN npx prisma generate
EXPOSE 8080
CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./server
    ports:
      - "8080:8080"
    env_file: ./server/.env

  client:
    build: ./client
    ports:
      - "3000:80"
```

### Checklist avant déploiement production

- [ ] `NODE_ENV=production` configuré
- [ ] Secrets JWT longs et aléatoires (min. 64 chars)
- [ ] `CORS_ORIGIN` pointant vers l'URL de production du frontend
- [ ] `REFRESH_TOKEN_COOKIE_SECURE=true`
- [ ] `RESEND_API_KEY` configuré avec domaine vérifié (SPF + DKIM)
- [ ] `GOOGLE_REDIRECT_URI` mis à jour avec l'URL de production
- [ ] `STORAGE_PATH=/var/data` (Render Persistent Disk)
- [ ] MongoDB Atlas : IP Whitelist configurée

---

## 📐 Bonnes pratiques

### Convention de code

- **TypeScript strict** activé sur frontend et backend
- **ESLint** configuré avec règles React (hooks, refresh)
- **Zod** pour la validation à toutes les entrées API
- **Séparation claire** Controller → Service → Prisma (pas de logique BDD dans les controllers)
- **Pas de `any`** sauf dans les cas inévitables (documentés)

### Git Workflow

```
main          ──────────────────────────────▶  (production)
              │               ↑
dev           ├───────────────┤               (intégration)
              │         merge │
feature/xxx   └───────────────┘               (fonctionnalité)
```

- `main` : branche de production, déployée automatiquement
- `dev` : branche d'intégration
- `feature/*` : nouvelles fonctionnalités
- `fix/*` : corrections de bugs
- `chore/*` : maintenance, dépendances

### Convention de commits

```bash
feat: ajouter le workflow de review automatique
fix: corriger l'affichage des documents en attente
chore: mettre à jour les dépendances npm
docs: documenter les endpoints de l'API review
refactor: extraire la logique email dans EmailService
```

---

## 🗺️ Roadmap

### Version 1.x — En cours ✅

- [x] Authentification JWT + refresh token
- [x] Gestion documentaire complète
- [x] Workflow de revue et approbation
- [x] Intégration Google Drive
- [x] Notifications email via Resend / SMTP
- [x] Journal d'audit
- [x] Conformité ISO par clause
- [x] Tableau de bord
- [x] Gestion des départements et postes
- [x] Export Excel

### Version 2.x — Prévue 🔜

- [ ] 🔍 Recherche full-text dans les documents
- [ ] 📱 Interface mobile responsive améliorée
- [ ] 🤖 Rappels automatiques de revue périodique
- [ ] 📊 Rapports de conformité exportables (PDF)
- [ ] 🔗 SSO / SAML pour l'authentification entreprise
- [ ] 🌐 Support multi-organisations (multi-tenant)
- [ ] 📝 Signature électronique des documents
- [ ] 🔔 Notifications push (web push)
- [ ] 🔄 Import en masse de documents
- [ ] 📈 Métriques avancées et analytics

---

## 👤 Auteur & Licence

### Développé par

**OPTIMUM-SOLUMADA**
- 🌐 Organisation GitHub : [OPTIMUM-SOLUMADA](https://github.com/OPTIMUM-SOLUMADA)
- 📧 Contact : developers@solumadateam.com
- 🐛 Issues : [GitHub Issues](https://github.com/OPTIMUM-SOLUMADA/isms-platform/issues)

### Licence

Ce projet est distribué sous licence **ISC**.
Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

**ISMS Platform** — Développé avec ❤️ par Solumada

*Sécuriser l'information, certifier la confiance.*

</div>
