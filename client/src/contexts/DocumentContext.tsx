import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from "react";
import type { Document } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { documentService } from "@/services/documentService";
import { ApiAxiosError } from "@/types/api";
import { AddDocumentFormData } from "@/templates/documents/forms/AddDocumentForm";
import { useToast } from "@/hooks/use-toast";
import { EditDocumentFormData } from "@/templates/documents/forms/EditDocumentForm";
import { useTranslation } from "react-i18next";

// Define shape of context
interface DocumentContextType {
    documents: Document[];
    loading: boolean;
    error: string | null;
    refetchDocuments: () => Promise<any>;
    // create
    create: (data: AddDocumentFormData) => Promise<any>;
    isCreating: boolean;
    isCreated: boolean;
    // delete
    deleteDocument: (payload: { id: string }) => Promise<any>;
    isDeleting: boolean;
    isDeleted: boolean;
    resetDelete: () => void;

    // update
    updateDocument: (payload: { id: string, data: EditDocumentFormData }) => Promise<any>;
    isUpdating: boolean;
    isUpdated: boolean;

    // document to edit
    currentDocument: Document | null;
    setCurrentDocument: (document: Document) => void;

    // get document by id
    document: Document | null;
    getDocument: (payload: { id: string }) => Promise<any>;
    // pagination
    page: number;
    setPage: (page: number) => void;
    limit: number;
    setLimit: (limit: number) => void;

    // stats
    stats: DocumentStats | null;

    // download
    download: (payload: { id: string, name?: string }) => Promise<any>;
    isDownloading: boolean;

    // publish
    publish: (payload: { id: string }) => Promise<any>;
    isPublishing: boolean;

    // publish
    unpublish: (payload: { id: string }) => Promise<any>;
    isUnpublishing: boolean;
}

// Create context
const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

type DocumentsResponse = {
    data: Document[],
    total: number;
    page: number;
    totalPages: number;
}

type DocumentStats = {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    inReview: number;
    draft: number;
    expired: number;
};

// Provider
export const DocumentProvider = ({ children }: { children: ReactNode }) => {
    const [page, _setPage] = useState(1);
    const [limit, _setLimit] = useState(50);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [currentDocument, _setCurrentDocument] = useState<Document | null>(null);
    const { toast } = useToast();
    const { t } = useTranslation();

    const setCurrentDocument = useCallback((document: Document) => {
        _setCurrentDocument(document);
    }, []);

    const setPage = useCallback((page: number) => {
        _setPage(page);
    }, []);

    const setLimit = useCallback((limit: number) => {
        _setLimit(limit);
    }, []);


    // mutation to get document by id using param
    const { data: document, mutateAsync: getDocument } = useMutation<Document, ApiAxiosError, { id: string }>({
        mutationFn: async ({ id }) => {
            const res = await documentService.getById(id);
            return res.data;
        },
    });

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<DocumentsResponse, Error>({
        queryKey: ["documents", page, limit],
        queryFn: async () => {
            const res = await documentService.list({ page, limit });
            return res.data;
        },
        staleTime: 1000 * 120, // cache data for 2 mins
    });

    // get document stats
    const { data: stats } = useQuery<DocumentStats, Error>({
        queryKey: ["documentStats"],
        queryFn: async () => {
            const res = await documentService.getStats();
            return res.data;
        },
        staleTime: 1000 * 60 * 3, // cache data for 1 min

    });

    useEffect(() => {
        if (data) {
            setDocuments(data.data);
        }
    }, [data]);

    const { mutateAsync: createDocument, isPending: isCreating, isSuccess: isCreated } = useMutation<Document, ApiAxiosError, AddDocumentFormData>({
        mutationFn: async (data) => {
            // create form data
            const formData = new FormData();
            const { files, ...rest } = data;
            // add file to form data
            formData.append("document", files[0]);
            // add rest fields to form data
            Object.entries(rest).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            const res = await documentService.create(formData);
            return res.data;
        },
        onSuccess: (data) => {
            toast({
                title: t("document.add.toast.success.title"),
                description: t("document.add.toast.success.description"),
                variant: "success",
            });
            setDocuments(prev => [...prev, data]);
        },
        onError: (err) => {
            console.error(err.response?.data);
            toast({
                title: t("document.add.toast.error.title"),
                description: t("document.add.toast.error.description"),
                variant: "destructive",
            })
        }
    });

    // Update document
    const { mutateAsync: updateDocument, isPending: isUpdating, isSuccess: isUpdated } = useMutation<any, ApiAxiosError, { id: string, data: EditDocumentFormData }>({
        mutationFn: async ({ id, data }) => {
            const formData = new FormData();
            const { files, ...rest } = data;
            // add file to form data
            if (files) formData.append("document", files[0]);
            // add rest fields to form data
            Object.entries(rest).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            const res = await documentService.update(id, formData);
            return res.data;
        },
        onSuccess: (data) => {
            toast({
                title: t("document.edit.toast.success.title"),
                description: t("document.edit.toast.success.description"),
                variant: "success",
            });
            setDocuments(prev => prev.map(document => document.id === data.id ? data : document));
        },
        onError: (err) => {
            console.error(err.response?.data);
            toast({
                title: t("document.edit.toast.error.title"),
                description: t("document.edit.toast.error.description"),
                variant: "destructive",
            })
        }
    });

    // Delete document
    const { mutateAsync: deleteDocument, isPending: isDeleting, isSuccess: isDeleted, reset: resetDelete } = useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: async ({ id }) => await documentService.delete(id),
        onSuccess: (_, { id }) => {
            toast({
                title: t("document.delete.toast.success.title"),
                description: t("document.delete.toast.success.description"),
                variant: "success",
            });
            setDocuments(prev => prev.filter(document => document.id !== id));
        },
        onError: (err) => {
            console.error(err.response?.data);
            toast({
                title: t("document.delete.toast.error.title"),
                description: t("document.delete.toast.error.description"),
                variant: "destructive",
            })
        }
    });

    const { mutateAsync: downloadDocument, isPending: isDownloading } = useMutation<any, ApiAxiosError, { id: string, name?: string }>({
        mutationFn: async ({ id }) => await documentService.download(id),
        onSuccess: (res) => {
            console.log(res.headers);
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

    // Publish document
    const { mutateAsync: publishDocument, isPending: isPublishing } = useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: async ({ id }) => await documentService.publish(id),
        onSuccess: (res, { id }) => {
            toast({
                title: t("document.publish.toast.success.title"),
                description: t("document.publish.toast.success.description"),
                variant: "success",
            });
            setDocuments(prev => prev.map(document => document.id === id ? res.data : document));
        },
        onError: (err) => {
            console.error(err.response?.data);
            toast({
                title: t("document.publish.toast.error.title"),
                description: t("document.publish.toast.error.description"),
                variant: "destructive",
            })
        }
    });

    // Unpublish document
    const { mutateAsync: unpublishDocument, isPending: isUnpublishing } = useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: async ({ id }) => await documentService.unpublish(id),
        onSuccess: (res, { id }) => {
            toast({
                title: t("document.unpublish.toast.success.title"),
                description: t("document.unpublish.toast.success.description"),
                variant: "success",
            });
            setDocuments(prev => prev.map(document => document.id === id ? res.data : document));
        },
        onError: (err) => {
            console.error(err.response?.data);
            toast({
                title: t("document.unpublish.toast.error.title"),
                description: t("document.unpublish.toast.error.description"),
                variant: "destructive",
            })
        }
    });

    return (
        <DocumentContext.Provider
            value={{
                documents,
                loading: isLoading,
                error: isError ? error.message : null,
                refetchDocuments: refetch,
                create: createDocument,
                isCreating,
                isCreated,
                deleteDocument,
                isDeleting,
                isDeleted,
                resetDelete,
                currentDocument,
                setCurrentDocument: setCurrentDocument,
                document: document ?? null,
                getDocument,
                updateDocument,
                isUpdating,
                isUpdated,
                page,
                limit,
                setLimit,
                setPage,
                stats: stats ?? null,
                download: downloadDocument,
                isDownloading,
                publish: publishDocument,
                isPublishing,
                unpublish: unpublishDocument,
                isUnpublishing
            }}
        >
            {children}
        </DocumentContext.Provider>
    );
};

// Custom hook
export const useDocument = (): DocumentContextType => {
    const context = useContext(DocumentContext);
    if (!context) {
        throw new Error("useDocument must be used within ISOClauseProvider");
    }
    return context;
};
