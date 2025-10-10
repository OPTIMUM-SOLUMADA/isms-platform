import { GoogleDriveService } from '@/services/googleapi.service';
import { env } from './env';

const svc = new GoogleDriveService({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URI,
});

svc.initialize();

export default svc;
