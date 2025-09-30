import { test, expect } from '@playwright/test';

test.describe("Page Login", () => {
    test("renders translated title and form", async ({ page }) => {
        await page.goto("/login");

        // Vérifie le <title> (WithTitle met à jour document.title)
        await expect(page).toHaveTitle(/Login/i);

        // Vérifie le titre principal (CardTitle)
        const heading = page.getByRole("heading", { name: /login/i });
        await expect(heading).toBeVisible();

        // Vérifie le sous-titre
        const subtitle = page.getByText(/Enter your/i);
        await expect(subtitle).toBeVisible();

        // Vérifie que le formulaire est bi en rendu
        const form = page.locator("form");
        await expect(form).toBeVisible();

        // Vérifie le bouton "Login"
        const loginButton = page.getByRole("button", { name: /login/i });
        await expect(loginButton).toBeVisible();

        // Vérifie que le bouton "Mot de passe oublié" redirige
        const forgotButton = page.getByRole("button", { name: /forgot/i });
        await forgotButton.click();
        await expect(page).toHaveURL("/forgot-password");
    })
})