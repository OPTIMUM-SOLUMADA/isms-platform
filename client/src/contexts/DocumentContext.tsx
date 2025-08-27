import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import type { Document } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { documentService } from "@/services/documentService";
import { ApiAxiosError } from "@/types/api";
import { AddDocumentFormData } from "@/templates/forms/documents/AddDocumentForm";
import { useToast } from "@/hooks/use-toast";

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
}

// Create context
const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Provider
export const DocumentProvider = ({ children }: { children: ReactNode }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const { toast } = useToast();

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<Document[], Error>({
        queryKey: ["documents"],
        queryFn: async () => {
            const res = await documentService.list();
            return res.data;
        },
        staleTime: 1000 * 60, // cache data for 1 min
    });

    useEffect(() => {
        if (data) {
            setDocuments(data);
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
                title: "Document ajouté",
                description: "Le document a bien été ajouté.",
                variant: "success",
            });
            setDocuments(prev => [...prev, data]);
        },
        onError: (err) => {
            console.error(err.response?.data);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'ajout du document.",
                variant: "destructive",
            })
        }
    });

    // Delete document
    const { mutateAsync: deleteDocument, isPending: isDeleting, isSuccess: isDeleted } = useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: async ({ id }) => await documentService.delete(id),
        onSuccess: (data) => {
            toast({
                title: "Document supprimé",
                description: "Le document a bien été supprimé.",
                variant: "success",
            });
            setDocuments(prev => prev.filter(document => document.id !== data.id));
        },
        onError: (err) => {
            console.error(err.response?.data);
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la suppression du document.",
                variant: "destructive",
            })
        }
    })

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
                isDeleted
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
