import { GoogleDriveService } from '@/services/googleapi.service';
import { GOOGLE_DRIVE_JSON_PATH } from './path';

const svc = new GoogleDriveService({
    keyFile: GOOGLE_DRIVE_JSON_PATH,
});

svc.initialize();

export default svc;
