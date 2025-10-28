import { google } from 'googleapis';
import { env } from './env';

export class GoogleAuthConfig {
    private static instance: GoogleAuthConfig;
    private oauth2Client: any;

    private constructor() {
        this.oauth2Client = new google.auth.OAuth2({
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
            redirectUri: env.GOOGLE_REDIRECT_URI!,
        });
    }

    static getInstance(): GoogleAuthConfig {
        if (!this.instance) {
            this.instance = new GoogleAuthConfig();
        }
        return this.instance;
    }

    getClient() {
        return this.oauth2Client;
    }
}
