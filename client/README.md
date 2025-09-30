## 📂 Project Structure

```
├── components/
├── configs/
├── constants/
├── contexts/
├── hooks/
├── i18n/
├── init/
├── lib/
├── mocks/
├── pages/
├── providers/
├── routes/
├── services/
├── stores/
├── styles/
├── templates/
├── types/
├── App.css
├── App.tsx
├── main.tsx
```

### 📁 Folder & File Explanations

### 📚 Description of Key Folders

| Folder        | Purpose                                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------------- |
| `components/` | Contains small, reusable UI elements (buttons, inputs, modals).                                            |
| `configs/`    | Holds app configuration files such as API URLs, environment variable, feature toggles, or theme constants. |
| `constants/`  | Centralized constants used throughout the app (navigation, frequency, color, etc.).                        |
| `contexts/`   | React Context providers for global state management (e.g., AuthContext).                                   |
| `hooks/`      | Custom hooks that encapsulate logic reusable across components.                                            |
| `i18n/`       | Files for translations and locale handling.                                                                |
| `init/`       | Initialization scripts like setting up analytics, error tracking, etc.                                     |
| `lib/`        | Utility libraries, helpers, or third-party API wrappers.                                                   |
| `mocks/`      | Mock data and services for local development or testing.                                                   |
| `pages/`      | Top-level page components linked to routes.                                                                |
| `providers/`  | Wrappers for React Context or higher-order providers (AppProviders).                                       |
| `routes/`     | Routing configuration and definitions (React Router).                                                      |
| `services/`   | API calls, domain logic, or external integrations.                                                         |
| `stores/`     | Centralized state management (Zustand).                                                                    |
| `styles/`     | Global CSS, SCSS, Tailwind configs, theme files.                                                           |
| `templates/`  | Predefined layout skeletons or page templates.                                                             |
| `types/`      | Shared TypeScript interfaces and type declarations.                                                        |
| `App.css`     | Styles for the root `App.tsx` component.                                                                   |
| `App.tsx`     | Root React component — sets up providers, routes, and layout.                                              |
| `main.tsx`    | Application entry point — mounts React app to the DOM.                                                     |

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have the following installed:

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x or **yarn** ≥ 1.x

Check versions:

```bash
node -v
npm -v
```

### 2. Clone the repository

```bash
git clone https://github.com/OPTIMUM-SOLUMADA/isms-platform
cd client
```

### 3. Install Dependencies

```bash
npm install
```

### 4 Setup Environment Variables

Copy **.env.example** to **.env**

```bash
cp .env.example .env
```

Then edit **.env** with your actual values

```ini
VITE_BACKEND_URL=your_backend_api_url
```

### 5. Run Development Server

```bash
npm run dev
```

## ⚙️ Common Scripts

| Script          | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the development server     |
| `npm run build` | Build a production-ready bundle  |
| `npm run lint`  | Run ESLint to check code quality |
| `npm run test`  | Run tests (if configured)        |
