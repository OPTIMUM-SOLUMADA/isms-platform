## 📂 Project Structure

```
├── components/
├── configs/
├── constants/
├── hooks/
├── pages/
├── templates/
├── styles
├── App.tsx
├── main.tsx
```

### 📁 Folder & File Explanations

| Path              | Description                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`components/`** | Reusable UI building blocks such as buttons, modals, forms, and navigation bars. Can be presentational or logic-based components used across multiple pages. |
| **`configs/`**    | Configuration files for API endpoints, environment-based settings, or third-party services (e.g., `axios.config.ts`, `firebase.config.ts`).                  |
| **`constants/`**  | Centralized static values such as enums, theme colors, regex patterns, or fixed strings. Avoids magic numbers/strings scattered in the code.                 |
| **`hooks/`**      | Custom React hooks for reusable logic (e.g., `useAuth()`, `useFetch()`, `useDebounce()`).                                                                    |
| **`pages/`**      | Route-level components — each file maps to an application route (e.g., `Home.tsx`, `About.tsx`).                                                             |
| **`templates/`**  | Layout components or page templates that define consistent structure for multiple pages (e.g., `MainLayout.tsx`).                                            |
| **`styles/`**     | Global styles, CSS/SCSS files, Tailwind overrides, or theme-related style definitions.                                                                       |
| **`App.tsx`**     | Root application component. Defines the main app structure, wraps global providers, and renders routes.                                                      |
| **`main.tsx`**    | Entry point of the React app. Bootstraps the application, mounts `App.tsx` to the DOM, and sets up core providers (e.g., Router, Redux, QueryClient).        |
