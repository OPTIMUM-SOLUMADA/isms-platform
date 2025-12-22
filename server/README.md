# 🚀 ISMS Backend (Express + Node.js + TypeScript)

This project is a backend API built with **Express.js**, a **hybrid PostgreSQL + MongoDB architecture**, and **JWT authentication**.  
It supports user management, email notifications, Google OAuth2, and more.

## 🗄️ Database Architecture

This project uses a **hybrid database architecture**:

- **PostgreSQL**: Relational data (users, documents, departments, compliance, etc.)
- **MongoDB**: High-volume data (audit logs, notifications)

### Why Hybrid?
- PostgreSQL provides ACID compliance and complex relational queries for core business data
- MongoDB offers flexible schema and high-write performance for logs and notifications
- PostgreSQL views provide optimized read access for common queries

---

## 📁 Folder structure
```bash
├── prisma                   # Prisma schemas (postgresql.prisma, mongodb.prisma)
├── public                   # Static public assets (images, css, uploads)
├── src                      # Application source code
│   ├── configs              # App configuration files (env, mail, puppeteer, etc.)
│   ├── controllers          # Route handlers (receive requests, call services)
│   ├── database             # Prisma clients (PostgreSQL + MongoDB), DB setup
│   ├── init                 # App initialization logic (creating or inserting data in db before using the app)
│   ├── jobs                 # Cron jobs / background tasks (Generating reviews)
│   ├── middlewares          # Express middlewares (auth, error handling)
│   ├── routes               # API routes (mapping endpoints to controllers)
│   ├── scripts              # Database scripts (create-views.ts)
│   ├── services             # Business logic (controllers call services)
│   ├── types                # TypeScript types/interfaces
│   ├── utils                # Reusable helpers (date, file, string utils)
│   ├── validators           # Request validators (Joi)
│   ├── views                # Template views (EJS)
│   ├── app.ts               # Express app configuration (middlewares, routes)
│   └── server.ts            # Server entry (starts the HTTP server)
├── templates                # Email templates
│   ├── en                   # English templates
│   ├── fr                   # French templates
│   └── partials             # Reusable template parts
├── tests                    # Automated tests (unit/integration)

```

## ⚙️ Setup Guide

### 🧩 Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **PostgreSQL** database (for relational data)
- **MongoDB** database (for audit logs and notifications)
- **Google Cloud credentials** for OAuth2 login (optional)
- **SMTP credentials** for sending emails (optional)

---

### 📦 Installation

Clone the repository and install dependencies:

```bash
# If you didn't clone yet
git clone https://github.com/OPTIMUM-SOLUMADA/isms-platform
# Then
cd server
npm install
```

### 🗃️ Database Setup

1. **Set up PostgreSQL** and create a database
2. **Set up MongoDB** (local or cloud like MongoDB Atlas)
3. **Configure environment variables** (see below)
4. **Generate Prisma clients**:
```bash
npm run prisma:generate
```

5. **Run PostgreSQL migrations**:
```bash
npm run prisma:migrate:pg
npx prisma migrate dev --name init --schema=.\prisma\postgresql.prisma
```

6. **Push MongoDB schema**:
```bash
npm run prisma:push:mongo
```

7. **Create PostgreSQL views** (optional, for optimized queries):
```bash
npm run db:views
```

### 🧰 Common Scripts

| Command                       | Description                                            |
| ----------------------------- | ------------------------------------------------------ |
| `npm run dev`                 | Run the server in development mode using ts-node-dev.  |
| `npm run build`               | Compile the code for production.                       |
| `npm start`                   | Start the compiled production server.                  |
| `npm test`                    | Run the test suite.                                    |
| `npm run prisma:generate`     | Generate both PostgreSQL and MongoDB Prisma clients.   |
| `npm run prisma:migrate:pg`   | Run PostgreSQL migrations in development.              |
| `npm run prisma:studio:pg`    | Open Prisma Studio for PostgreSQL.                     |
| `npm run prisma:studio:mongo` | Open Prisma Studio for MongoDB.                        |
| `npm run db:views`            | Create PostgreSQL views for optimized queries.         |

### Example `.env` File

You need to create **.env** file inside server folder.
See the [Setup .env Guide](ENV.md) or copy from `.env.example`

```env
# PostgreSQL - Main relational database
DATABASE_URL=postgresql://user:pass@localhost:5432/isms_db

# MongoDB - Audit logs and notifications
DATABASE_URL_MONGO=mongodb+srv://user:pass@cluster.mongodb.net/isms_logs

PORT=8080
CORS_ORIGIN="http://localhost:5173"

SMTP_HOST=mail.example.com
SMTP_PORT=587
SMTP_USER=admin@example.com
SMTP_USER_NOREPLY=noreply@example.com
SMTP_PASS=your_password
SMTP_SECURE=false

JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_SHORT_EXPIRES_IN="1d"
JWT_REFRESH_LONG_EXPIRES_IN="30d"
JWT_RESET_EXPIRES_IN="2h"
JWT_ISSUER="isms-solumada"

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8080/gd/oauth2callback

BCRYPT_SALT_ROUNDS=12
```

## API Documentation

For detailed API usage and endpoints, please check the [API Documentation](API.md).
