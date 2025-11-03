import { documentVersionService } from "@/services/documentVersionService";
import { DocumentVersion } from "@/types";
import { ApiAxiosError } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useGetDocumentVersions = (documentId?: string) => {
    return useQuery<DocumentVersion[], ApiAxiosError>({
        queryKey: ["create-draft-version", documentId],
        queryFn: async () =>
            (await documentVersionService.getByDocument(documentId!)).data,
        enabled: !!documentId,
        staleTime: 1000 * 60 * 3,
    });
}