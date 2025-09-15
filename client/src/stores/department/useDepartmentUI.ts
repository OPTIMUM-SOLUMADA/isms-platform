import { create } from "zustand";
import type { Department } from "@/types";

type DepartmentUIState = {
    // states
    isAddOpen: boolean;
    isEditOpen: boolean;
    isDeleteOpen: boolean;
    currentDepartment: Department | null;

    // actions
    openAdd: () => void;
    closeAdd: () => void;
    openEdit: () => void;
    closeEdit: () => void;
    openDelete: () => void;
    closeDelete: () => void;
    setCurrentDepartment: (department: Department | null) => void;
};

export const useDepartmentUI = create<DepartmentUIState>((set) => ({
    // initial state
    isAddOpen: false,
    isEditOpen: false,
    isDeleteOpen: false,
    currentDepartment: null,

    // actions
    openAdd: () => set({ isAddOpen: true }),
    closeAdd: () => set({ isAddOpen: false }),
    openEdit: () => set({ isEditOpen: true }),
    closeEdit: () => set({ isEditOpen: false }),
    openDelete: () => set({ isDeleteOpen: true }),
    closeDelete: () => set({ isDeleteOpen: false }),
    setCurrentDepartment: (department) => set({ currentDepartment: department }),
}));
