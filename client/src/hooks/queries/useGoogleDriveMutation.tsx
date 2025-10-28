import { useMutation } from "@tanstack/react-query";
import type { ApiAxiosError } from "@/types/api";
import { googleDriveService } from "@/services/googleDriveService";

export const useGrantPermissionsToDocumentVersion = () => {
    return useMutation<any, ApiAxiosError, { documentId: string }>({
        mutationFn: async ({ documentId }) => await googleDriveService.grantPermissionsToDocumentVersion(documentId),
    });
};
