import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env
dotenv.config({
    path: path.resolve(__dirname, '../..', '.env'),
});

export const envSchema = z.object({
    PORT: z.number().default(8000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    // Database
    DATABASE_URL: z.string().url(),

    // Password Hashing
    BCRYPT_SALT_ROUNDS: z
        .string()
        .transform((val) => parseInt(val))
        .refine((val) => !isNaN(val) && val > 0, {
            message: 'BCRYPT_SALT_ROUNDS must be a positive number',
        })
        .default(12),

    // CORS
    CORS_ORIGIN: z.string().default('*'),

    // Session (optional, if you mix JWT with sessions for some flows)
    SESSION_SECRET: z.string().min(16).optional(),

    // JWT
    JWT_ACCESS_SECRET: z
        .string()
        .min(10, 'JWT_ACCESS_SECRET must be at least 10 characters for security'),
    JWT_ACCESS_EXPIRES_IN: z.string().default('1h'),
    JWT_REFRESH_SECRET: z
        .string()
        .min(10, 'JWT_REFRESH_SECRET must be at least 10 characters for security'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    JWT_ISSUER: z.string().default(''),

    JWT_RESET_EXPIRES_IN: z.string().default('1h'),

    // Optional Email Config (if you want password reset)
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z
        .string()
        .transform((val) => parseInt(val))
        .optional()
        .default(587),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_SECURE: z.string().optional().default('false'),
});

const envServer = envSchema.safeParse({
    PORT: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_RESET_EXPIRES_IN: process.env.JWT_RESET_EXPIRES_IN,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    SESSION_SECRET: process.env.SESSION_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_SECURE: process.env.SMTP_SECURE,
});

if (!envServer.success) {
    console.error(envServer.error.issues);
    throw new Error('There is an error with the server environment variables');
}

export const env = envServer.data;
