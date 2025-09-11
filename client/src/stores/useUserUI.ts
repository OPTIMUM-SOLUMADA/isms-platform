import { create } from "zustand";
import type { User } from "@/types";

type UserUIState = {
    // states
    isAddOpen: boolean;
    isEditOpen: boolean;
    isDeleteOpen: boolean;
    currentUser: User | null;

    // actions
    openAdd: () => void;
    closeAdd: () => void;
    openEdit: () => void;
    closeEdit: () => void;
    openDelete: () => void;
    closeDelete: () => void;
    setCurrentUser: (user: User | null) => void;
};

export const useUserUI = create<UserUIState>((set) => ({
    // initial state
    isAddOpen: false,
    isEditOpen: false,
    isDeleteOpen: false,
    currentUser: null,

    // actions
    openAdd: () => set({ isAddOpen: true }),
    closeAdd: () => set({ isAddOpen: false }),
    openEdit: () => set({ isEditOpen: true }),
    closeEdit: () => set({ isEditOpen: false }),
    openDelete: () => set({ isDeleteOpen: true }),
    closeDelete: () => set({ isDeleteOpen: false }),
    setCurrentUser: (user) => set({ currentUser: user }),
}));
