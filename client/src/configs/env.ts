import { z } from "zod";

export const envSchema = z.object({
    BASE_URL: z.string().url(),
});

const envClient = envSchema.safeParse({
    BASE_URL: import.meta.env.VITE_BACKEND_URL,
});

if (!envClient.success) {
    console.error(envClient.error.issues);
    throw new Error('There is an error with the server environment variables');
}

export const env = envClient.data;
