import { GoogleAccountService } from '@/services/google-account.service';
import { GoogleAuthConfig } from '@/configs/google.config';
import { logger } from '@/utils/logger';

const accountService = new GoogleAccountService();

export async function refreshGoogleAuthTokensJob() {
    const accounts = await accountService.getAll(); // get all Google accounts in DB

    for (const account of accounts) {
        try {
            const oauth2Client = GoogleAuthConfig.getInstance().getClient();
            oauth2Client.setCredentials(account.tokens);
            const tokens: any = account.tokens;

            // Force refresh the access token
            const { credentials } = await oauth2Client.refreshAccessToken();
            tokens.access_token = credentials.access_token!;
            if (credentials.refresh_token) tokens.refresh_token = credentials.refresh_token;

            await accountService.update(account.googleId, { tokens: tokens });
            logger.info(`[GOOGLE AUTH] Refreshed tokens for ${account.email}`);
        } catch (err) {
            logger.error(`[GOOGLE AUTH] Failed to refresh tokens for ${account.email}`);
        }
    }
}
