# API Documentation

## 🧩 Route Overview

| Module           | Base Path           | Description                                |
| ---------------- | ------------------- | ------------------------------------------ |
| Auth             | `/auth`             | Authentication and user session management |
| Departments      | `/departments`      | Department CRUD and management             |
| Users            | `/users`            | User CRUD and permissions                  |
| Documents        | `/documents`        | Document storage and metadata              |
| ISO Clauses      | `/iso-clauses`      | ISO clause management                      |
| Document Types   | `/document-types`   | Document type definitions                  |
| Document Reviews | `/document-reviews` | Document review workflow                   |
| Invitation       | `/invitation`       | Invite users to the platform               |
| Owners           | `/owners`           | Document or resource ownership             |
| Department Roles | `/department-roles` | Roles within departments                   |

---

## 🔐 Auth Endpoints

| Method    | Endpoint                   | Description                                      |
| --------- | -------------------------- | ------------------------------------------------ |
| **POST**  | `/auth/login`              | Log in a user and return access + refresh tokens |
| **POST**  | `/auth/logout`             | Log out the user and invalidate tokens           |
| **POST**  | `/auth/refresh`            | Refresh the access token using a refresh token   |
| **POST**  | `/auth/verify`             | Verify the validity of an access token           |
| **POST**  | `/auth/reset-password`     | Request a password reset link via email          |
| **PATCH** | `/auth/change-password`    | Change the current password (authenticated)      |
| **POST**  | `/auth/verify-reset-token` | Verify if a password reset token is valid        |
| **POST**  | `/auth/verify-account`     | Verify a newly created user account              |

## 🏢 Department Endpoints

| Method     | Endpoint                  | Description                                  |
| ---------- | ------------------------- | -------------------------------------------- |
| **GET**    | `/departments/search`     | Search departments by keyword or filters     |
| **POST**   | `/departments/`           | Create a new department                      |
| **GET**    | `/departments/`           | Get all departments                          |
| **GET**    | `/departments/:id`        | Get details of a specific department         |
| **PUT**    | `/departments/:id`        | Update department information                |
| **DELETE** | `/departments/:id`        | Delete a department                          |
| **POST**   | `/departments/initialize` | Initialize default departments or setup data |
| **GET**    | `/departments/:id/roles`  | Get all roles associated with a department   |
| **POST**   | `/departments/:id/roles`  | Add new roles to a department                |
| **PUT**    | `/departments/:id/roles`  | Update existing department roles             |
| **DELETE** | `/departments/:id/roles`  | Remove roles from a department               |
| **GET**    | `/departments/role/:id`   | Get specific role details by role ID         |

## 👤 User Endpoints

| Method     | Endpoint                | Description                                             |
| ---------- | ----------------------- | ------------------------------------------------------- |
| **GET**    | `/users/search`         | Search users by name, email, or filters                 |
| **GET**    | `/users/by-ids`         | Retrieve multiple users by a list of IDs                |
| **POST**   | `/users/`               | Create a new user                                       |
| **GET**    | `/users/:id`            | Get user details by ID                                  |
| **PUT**    | `/users/:id`            | Update user information                                 |
| **DELETE** | `/users/:id`            | Delete a user                                           |
| **GET**    | `/users/`               | List all users                                          |
| **POST**   | `/users/:id/invite`     | Send an email invitation or verification link to a user |
| **PATCH**  | `/users/:id/deactivate` | Deactivate a user account                               |
| **PATCH**  | `/users/:id/activate`   | Activate a previously deactivated user account          |

## 📄 Document Endpoints

| Method     | Endpoint                   | Description                                                           |
| ---------- | -------------------------- | --------------------------------------------------------------------- |
| **POST**   | `/documents/`              | Create a new document (with file upload)                              |
| **GET**    | `/documents/statistics`    | Retrieve document-related statistics (e.g., total, published, drafts) |
| **GET**    | `/documents/:id`           | Get details of a specific document by ID                              |
| **PUT**    | `/documents/:id`           | Update an existing document (with optional file upload)               |
| **DELETE** | `/documents/:id`           | Delete a document                                                     |
| **GET**    | `/documents/`              | List all documents                                                    |
| **GET**    | `/documents/download/:id`  | Download a document file by ID                                        |
| **PUT**    | `/documents/publish/:id`   | Publish a document and make it visible to users                       |
| **PUT**    | `/documents/unpublish/:id` | Unpublish a document and hide it from public access                   |

## 📘 ISO Clause Endpoints

| Method     | Endpoint                  | Description                                 |
| ---------- | ------------------------- | ------------------------------------------- |
| **GET**    | `/iso-clauses/search`     | Search ISO clauses by keyword or filters    |
| **POST**   | `/iso-clauses/`           | Create a new ISO clause                     |
| **POST**   | `/iso-clauses/initialize` | Initialize default ISO clauses or seed data |
| **GET**    | `/iso-clauses/`           | Retrieve a list of all ISO clauses          |
| **GET**    | `/iso-clauses/:id`        | Get details of a specific ISO clause by ID  |
| **PUT**    | `/iso-clauses/:id`        | Update an existing ISO clause               |
| **DELETE** | `/iso-clauses/:id`        | Delete an ISO clause                        |

## 🗂️ Document Type Endpoints

| Method     | Endpoint                     | Description                                   |
| ---------- | ---------------------------- | --------------------------------------------- |
| **GET**    | `/document-types/search`     | Search document types by keyword or filters   |
| **POST**   | `/document-types/`           | Create a new document type                    |
| **POST**   | `/document-types/initialize` | Initialize or seed default document types     |
| **GET**    | `/document-types/`           | Retrieve all document types                   |
| **GET**    | `/document-types/:id`        | Get details of a specific document type by ID |
| **PUT**    | `/document-types/:id`        | Update an existing document type              |
| **DELETE** | `/document-types/:id`        | Delete a document type                        |

## 📝 Document Review Endpoints

| Method    | Endpoint                                        | Description                                                     |
| --------- | ----------------------------------------------- | --------------------------------------------------------------- |
| **GET**   | `/document-reviews/`                            | Retrieve all document reviews                                   |
| **POST**  | `/document-reviews/`                            | Create a new document review                                    |
| **GET**   | `/document-reviews/:id`                         | Get details of a specific document review by ID                 |
| **PUT**   | `/document-reviews/:id`                         | Update a document review                                        |
| **PATCH** | `/document-reviews/:id/patch-document-version`  | Update the review to match a new document version               |
| **GET**   | `/document-reviews/my-reviews/:userId`          | Retrieve all document reviews assigned to a specific user       |
| **GET**   | `/document-reviews/my-reviews/:userId/stats`    | Get review statistics (e.g., completed, pending) for a user     |
| **GET**   | `/document-reviews/my-reviews/:userId/due-soon` | Get document reviews that are due soon for a user               |
| **PUT**   | `/document-reviews/make-decision/:id`           | Submit a decision (approve, reject, etc.) for a document review |
| **GET**   | `/document-reviews/pending-reviews`             | Retrieve all reviews that are currently pending                 |
| **PATCH** | `/document-reviews/mark-as-completed/:id`       | Mark a document review as completed                             |

## 👩‍🏭 Owner Endpoints

| Method  | Endpoint   | Description         |
| ------- | ---------- | ------------------- |
| **GET** | `/owners/` | Retrieve all owners |

## 👩‍🏭 Department Role Endpoints

| Method  | Endpoint                | Description                   |
| ------- | ----------------------- | ----------------------------- |
| **GET** | `/department-roles/`    | Retrieve all department roles |
| **GET** | `/department-roles/:id` | Get a department role by ID   |
