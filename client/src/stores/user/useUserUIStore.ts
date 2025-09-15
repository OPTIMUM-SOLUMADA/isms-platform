import { create } from "zustand";
import type { User } from "@/types";

type UserUIState = {
    // states
    isAddOpen: boolean;
    isEditOpen: boolean;
    isDeleteOpen: boolean;
    isActivationOpen: boolean;
    isDesactivationOpen: boolean;
    currentUser: User | null;

    // actions
    openAdd: () => void;
    closeAdd: () => void;
    openEdit: () => void;
    closeEdit: () => void;
    openDelete: () => void;
    closeDelete: () => void;
    openActivation: () => void;
    closeActivation: () => void;
    openDesactivation: () => void;
    closeDesactivation: () => void;
    setCurrentUser: (user: User | null) => void;
};

export const useUserUIStore = create<UserUIState>((set) => ({
    // initial state
    isAddOpen: false,
    isEditOpen: false,
    isDeleteOpen: false,
    isActivationOpen: false,
    isDesactivationOpen: false,
    currentUser: null,

    // actions
    openAdd: () => set({ isAddOpen: true }),
    closeAdd: () => set({ isAddOpen: false }),
    openEdit: () => set({ isEditOpen: true }),
    closeEdit: () => set({ isEditOpen: false }),
    openDelete: () => set({ isDeleteOpen: true }),
    closeDelete: () => set({ isDeleteOpen: false }),
    openActivation: () => set({ isActivationOpen: true }),
    closeActivation: () => set({ isActivationOpen: false }),
    openDesactivation: () => set({ isDesactivationOpen: true }),
    closeDesactivation: () => set({ isDesactivationOpen: false }),
    setCurrentUser: (user) => set({ currentUser: user }),
}));
