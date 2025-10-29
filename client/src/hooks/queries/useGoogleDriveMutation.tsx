import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiAxiosError } from "@/types/api";
import { googleDriveService } from "@/services/googleDriveService";

export const useGrantPermissionsToDocumentVersion = () => {
    const queryClient = useQueryClient();
    return useMutation<any, ApiAxiosError, { documentId: string }>({
        mutationFn: async ({ documentId }) => await googleDriveService.grantPermissionsToDocumentVersion(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            queryClient.invalidateQueries({ queryKey: ["document-versions"] });
            queryClient.invalidateQueries({ queryKey: ["document-reviews"] });
        },
    });
};
