import 'express-session';

declare module 'express-session' {
    interface SessionData {
        gooleAccount?: {
            googleId: string;
            email: string;
            tokens: {
                access_token: string;
                refresh_token?: string;
                scope?: string;
                token_type?: string;
                id_token?: string;
                refresh_token_expires_in?: number;
                expiry_date?: number;
            } | null;
            workingDirId?: string;
        };
    }
}
