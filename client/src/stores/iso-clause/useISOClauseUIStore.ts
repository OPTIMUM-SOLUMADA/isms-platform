


import { create } from "zustand";
import type { ISOClause } from "@/types";

type ISOClauseUIState = {
    // states
    isAddOpen: boolean;
    isEditOpen: boolean;
    isDeleteOpen: boolean;
    currentISOClause: ISOClause | null;

    // actions
    openAdd: () => void;
    closeAdd: () => void;
    openEdit: () => void;
    closeEdit: () => void;
    openDelete: () => void;
    closeDelete: () => void;
    setCurrentISOClause: (iSOClause: ISOClause | null) => void;
};

export const useISOClauseUIStore = create<ISOClauseUIState>((set) => ({
    // initial state
    isAddOpen: false,
    isEditOpen: false,
    isDeleteOpen: false,
    currentISOClause: null,

    // actions
    openAdd: () => set({ isAddOpen: true }),
    closeAdd: () => set({ isAddOpen: false }),
    openEdit: () => set({ isEditOpen: true }),
    closeEdit: () => set({ isEditOpen: false }),
    openDelete: () => set({ isDeleteOpen: true }),
    closeDelete: () => set({ isDeleteOpen: false }),
    setCurrentISOClause: (iSOClause) => set({ currentISOClause: iSOClause }),
}));
