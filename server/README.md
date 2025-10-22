# 🚀 ISMS Backend (Express + Node.js + TypeScript)

This project is a backend API built with **Express.js**, **MongoDB**, and **JWT authentication**.  
It supports user management, email notifications, Google OAuth2, and more.

---

## ⚙️ Setup Guide

### 🧩 Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **MongoDB** database (cloud or local)
- **Google Cloud credentials** for OAuth2 login
- **SMTP credentials** for sending emails

---

### 📦 Installation

Clone the repository and install dependencies:

```bash
# If you didn't cloned yet
git clone https://github.com/OPTIMUM-SOLUMADA/isms-platform
# Then
cd server
npm install
```

### 🧰 Common Scripts

| Command         | Description                                           |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Run the server in development mode using ts-node-dev. |
| `npm run build` | Compile the code for production.                      |
| `npm start`     | Start the compiled production server.                 |
| `npm test`      | Run the test suite.                                   |

### Example `.env` File

You need to create **.env** file inside server folder.
See the [Setup .env Guide](ENV.md)

```env
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/isms
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
