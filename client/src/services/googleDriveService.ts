import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const api = API_CONFIG.ENDPOINTS.GOOGLE_DRIVE;

export const googleDriveService = {
    getFiles: () => axios.get(api.BASE),
    grantPermissionsToDocumentVersion: (versionId: string) => axios.post(api.GRANT_PERMISSIONS_TO_FILE_VERSION(versionId), {}),
};