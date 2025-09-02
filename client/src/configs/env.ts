import { z } from "zod";

export const envSchema = z.object({
    BASE_URL: z.string().url(),
    ACCESS_TOKEN_KEY: z.string().default("accessToken"),
    DOCUMENT_PREVIEW_URL: z.string().optional().default("/uploads/documents"),
});

const envClient = envSchema.safeParse({
    BASE_URL: import.meta.env.VITE_BACKEND_URL,
    ACCESS_TOKEN_KEY: import.meta.env.ACCESS_TOKEN_KEY,
    DOCUMENT_PREVIEW_URL: import.meta.env.DOCUMENT_PREVIEW_URL
});

if (!envClient.success) {
    console.error(envClient.error.issues);
    throw new Error('There is an error with the server environment variables');
}

export const env = envClient.data;
