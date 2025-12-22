## 🔧 Environment Variables

This project uses a `.env` file to configure the backend server.  
Below is a description of all the environment variables and their purposes.

---

### ⚙️ Required Variables

| Variable              | Description                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DATABASE_URL**      | PostgreSQL connection string for the main relational database. Example: `postgresql://username:password@localhost:5432/isms_db`.                                |
| **DATABASE_URL_MONGO** | MongoDB connection string for audit logs and notifications. Example: `mongodb+srv://username:password@cluster.mongodb.net/isms_logs`.                          |
| **PORT**              | The port on which the backend server will run. Default: `8080`.                                                                                                  |
| **CORS_ORIGIN**       | The URL of the frontend application (React). Used to allow cross-origin requests. Example: `http://localhost:5173`.                                             |

---

### 📧 Email Configuration (Nodemailer)

| Variable              | Description                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| **SMTP_HOST**         | SMTP mail server host used to send emails (e.g., password reset, notifications).                       |
| **SMTP_PORT**         | Port number for the SMTP server, usually `587` for TLS or `465` for SSL.                               |
| **SMTP_USER**         | Main SMTP username (email address) used for sending mail.                                              |
| **SMTP_USER_NOREPLY** | Optional no-reply email account for system-generated messages.                                         |
| **SMTP_PASS**         | Password or app key for the SMTP user.                                                                 |
| **SMTP_SECURE**       | Whether to use a secure SSL/TLS connection. Set `true` for SSL (port 465), `false` for TLS (port 587). |

---

### 🔐 JSON Web Token (JWT) Configuration

| Variable               | Description                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| **JWT_ACCESS_SECRET**  | Secret key for signing short-lived access tokens. Must be at least 10 characters. |
| **JWT_REFRESH_SECRET** | Secret key for signing refresh tokens. Must be at least 10 characters.            |

#### Optional JWT Settings

| Variable                         | Description                                                                      |
| -------------------------------- | -------------------------------------------------------------------------------- |
| **JWT_ACCESS_EXPIRES_IN**        | Access token lifetime. Example: `"15m"` (15 minutes).                            |
| **JWT_REFRESH_SHORT_EXPIRES_IN** | Short refresh token lifetime. Example: `"1d"` (1 day).                           |
| **JWT_REFRESH_LONG_EXPIRES_IN**  | Long refresh token lifetime. Example: `"30d"` (30 days).                         |
| **JWT_RESET_EXPIRES_IN**         | Token lifetime for password reset links. Example: `"2h"`.                        |
| **JWT_ISSUER**                   | Token issuer name (used to verify the token origin). Example: `"isms-solumada"`. |

---

### 🔑 Google API Configuration (OAuth2)

| Variable                 | Description                                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **GOOGLE_CLIENT_ID**     | Google OAuth2 client ID for login or file integrations.                                                                                                                  |
| **GOOGLE_CLIENT_SECRET** | Google OAuth2 client secret key.                                                                                                                                         |
| **GOOGLE_REDIRECT_URI**  | Redirect URI configured in the Google Cloud Console. Should point to your backend endpoint handling OAuth2 callback. Example: `http://localhost:8080/gd/oauth2callback`. |

---

### 🔒 Security Configuration

| Variable               | Description                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **BCRYPT_SALT_ROUNDS** | Number of salt rounds used for hashing passwords with bcrypt. Higher values increase security but also CPU usage. Recommended: `12`. |

---

### 🧠 Example `.env` File

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
