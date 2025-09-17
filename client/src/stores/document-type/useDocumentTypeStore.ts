import type { DocumentType } from '@/types';
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

    page: number;
    setPage: (page: number) => void;
    limit: number;
    setLimit: (limit: number) => void;
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

    page: 1,
    setPage: (page) => set({ page }),
    limit: 50,
    setLimit: (limit) => set({ limit }),
}));

export default useDocumentTypeStore;
