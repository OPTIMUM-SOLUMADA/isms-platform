import 'express-session';

declare module 'express-session' {
    interface SessionData {
        user?: {
            id: string;
            email: string;
            tokens: {
                access_token: string;
                refresh_token?: string;
                scope?: string;
                token_type?: string;
                expiry_date?: number;
            };
        };
    }
}
