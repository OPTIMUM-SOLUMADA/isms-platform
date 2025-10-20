import { createContext, useContext, ReactNode } from "react";
import type { DocumentType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { documentTypeService } from "@/services/documenttypeService";

// Define shape of context
interface DocumentTypeContextType {
    types: DocumentType[];
    loading: boolean;
    error: string | null;
    refetchTypes: () => Promise<any>;
}

// Create context
const DocumentTypeContext = createContext<DocumentTypeContextType | undefined>(undefined);

// Provider
export const DocumentTypeProvider = ({ children }: { children: ReactNode }) => {

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<DocumentType[], Error>({
        queryKey: ["documentTypes"],
        queryFn: async () => {
            const res = await documentTypeService.list({ limit: 1000, page: 1 });
            return res.data;
        },
        staleTime: 1000 * 60, // cache data for 1 min
    });

    return (
        <DocumentTypeContext.Provider
            value={{
                types: data ?? [],
                loading: isLoading,
                error: isError ? error.message : null,
                refetchTypes: refetch,
            }}
        >
            {children}
        </DocumentTypeContext.Provider>
    );
};

// Custom hook
export const useDocumentType = (): DocumentTypeContextType => {
    const context = useContext(DocumentTypeContext);
    if (!context) {
        throw new Error("useDocumentType must be used within ISOClauseProvider");
    }
    return context;
};
