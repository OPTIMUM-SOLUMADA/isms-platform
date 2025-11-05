import { documentVersionService } from "@/services/documentVersionService";
import { DocumentVersion } from "@/types";
import { ApiAxiosError } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetDocumentVersions = (documentId?: string) => {
    return useQuery<DocumentVersion[], ApiAxiosError>({
        queryKey: ["document-versions", documentId],
        queryFn: async () =>
            (await documentVersionService.getByDocument(documentId!)).data,
        enabled: !!documentId,
        staleTime: 1000 * 60 * 3,
    });
}



export const useDownloadVersion = () => {
    return useMutation<any, ApiAxiosError, { id: string, name?: string }>({
        mutationFn: async ({ id }) => await documentVersionService.download(id),
        onSuccess: (res) => {
            // get file
            const url = URL.createObjectURL(res.data);
            // Extract filename from Content-Disposition header
            const disposition = res.headers["content-disposition"];
            let filename = "downloaded-file";
            if (disposition && disposition.includes("filename=")) {
                filename = disposition.split("filename=")[1].trim().replace(/["']/g, "");
            }

            const link = window.document.createElement("a");
            link.href = url;
            link.download = filename;
            window.document.body.appendChild(link);
            link.click();
            window.document.body.removeChild(link);

            URL.revokeObjectURL(url);
        }
    });
}
