import { create } from "zustand";
import type { DocumentType } from "@/types";

type DocumentTypeUIState = {
    // states
    isAddOpen: boolean;
    isEditOpen: boolean;
    isDeleteOpen: boolean;
    currentDocumentType: DocumentType | null;

    // actions
    openAdd: () => void;
    closeAdd: () => void;
    openEdit: () => void;
    closeEdit: () => void;
    openDelete: () => void;
    closeDelete: () => void;
    setCurrentDocumentType: (document: DocumentType | null) => void;
};

export const useDocumentTypeUIStore = create<DocumentTypeUIState>((set) => ({
    // initial state
    isAddOpen: false,
    isEditOpen: false,
    isDeleteOpen: false,
    currentDocumentType: null,

    // actions
    openAdd: () => set({ isAddOpen: true }),
    closeAdd: () => set({ isAddOpen: false }),
    openEdit: () => set({ isEditOpen: true }),
    closeEdit: () => set({ isEditOpen: false }),
    openDelete: () => set({ isDeleteOpen: true }),
    closeDelete: () => set({ isDeleteOpen: false }),
    setCurrentDocumentType: (document) => set({ currentDocumentType: document }),
}));
