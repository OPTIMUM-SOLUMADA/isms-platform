import type { DocumentType } from '@/types';
import { Pagination } from '@/types/pagination';
import { create } from 'zustand';

type DocumentTypeStore = {
    documentTypes: DocumentType[];
    setDocumentTypes: (docTypes: DocumentType[]) => void;
    currentDocumentType: DocumentType | null;
    setCurrentDocumentType: (docType: DocumentType) => void;
    clearDocumentType: () => void;
    replaceDocumentType: (id: string, newDT: DocumentType) => void;
    removeDocumentType: (id: string) => void;
    pushDocumentType: (docType: DocumentType) => void;

    query: string;
    setQuery: (page: string) => void;

    // pagination
    pagination: Pagination;
    setPagination: (pagination: Pagination) => void;
};

export const useDocumentTypeStore = create<DocumentTypeStore>((set) => ({
    documentTypes: [],
    setDocumentTypes: (docTypes) => set({ documentTypes: docTypes }),
    currentDocumentType: null,

    setCurrentDocumentType: (docType) => set({ currentDocumentType: docType }),

    pushDocumentType: (docType) => set((state) => ({ documentTypes: [...state.documentTypes, docType] })),

    clearDocumentType: () => set({ documentTypes: [] }),

    replaceDocumentType: (id, newDT) => set((state) => ({ documentTypes: state.documentTypes.map((dt) => (dt.id === id ? newDT : dt)) })),

    removeDocumentType: (id) => set((state) => ({ documentTypes: state.documentTypes.filter((dt) => dt.id !== id) })),

    query: "",
    setQuery: (query) => set({ query }),

    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    setPagination: (pagination) => set({ pagination }),
}));

export default useDocumentTypeStore;
