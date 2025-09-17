import { create } from "zustand";
import type { Document } from "@/types";

interface DocumentState {
    documents: Document[];
    setDocuments: (docs: Document[]) => void;

    currentDocument: Document | null;
    setCurrentDocument: (doc: Document | null) => void;

    page: number;
    setPage: (page: number) => void;

    limit: number;
    setLimit: (limit: number) => void;
}

const useDocumentStore = create<DocumentState>((set) => ({
    documents: [],
    setDocuments: (docs) => set({ documents: docs }),

    currentDocument: null,
    setCurrentDocument: (doc) => set({ currentDocument: doc }),

    page: 1,
    setPage: (page) => set({ page }),

    limit: 50,
    setLimit: (limit) => set({ limit }),
}));

export default useDocumentStore;