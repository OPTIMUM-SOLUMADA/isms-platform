import { GoogleDriveService } from '@/services/googledrive.service';
import { RequestWithGoogleAccount } from '@/types/request';

export const useGoogleDriveService = (req: RequestWithGoogleAccount) => {
    const user = req.session.googleAccount;
    if (!user) throw new Error('A Google account is not authenticated');

    return new GoogleDriveService(user.tokens, user.workingDirId);
};


// import { GoogleDriveService } from '@/services/googledrive.service';
// import { Request } from 'express';
// import { Session } from 'express-session';

// export const useGoogleDriveService = (req: Request) => {
//     // const user = req.session.googleAccount;
//                 // Cast pour indiquer à TypeScript que googleAccount existe
//     const user = req.session as Session & { googleAccount?: {
//         googleId: string;
//         email: string;
//         tokens: {
//             access_token: string;
//             refresh_token?: string;
//             scope?: string;
//             token_type?: string;
//             id_token?: string;
//             refresh_token_expires_in?: number;
//             expiry_date?: number;
//         } | null;
//         workingDirId?: string;
//     }};
//     if (!user.googleAccount) {
//         throw new Error('A google account is not authenticated');
//     }

//     return new GoogleDriveService(user.tokens, user.workingDirId);
// };
