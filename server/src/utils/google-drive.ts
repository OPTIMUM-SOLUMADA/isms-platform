import { GoogleDriveService } from '@/services/googledrive.service';
import { Request } from 'express';

export const useGoogleDriveService = (req: Request) => {
    const user = (req.session as any)?.user;
    if (!user) {
        throw new Error('A google account is not authenticated');
    }

    return new GoogleDriveService(user.tokens, user.workingDirId);
};
