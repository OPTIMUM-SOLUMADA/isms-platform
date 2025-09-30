import { create } from "zustand";
import type { DepartmentRole } from "@/types";

type DepartmentRoleUIState = {
  // states
  isAddOpen: boolean;
  isEditOpen: boolean;
  isDeleteOpen: boolean;
  currentDepartmentRole: DepartmentRole | null;

  // actions
  openAdd: () => void;
  closeAdd: () => void;
  openEdit: () => void;
  closeEdit: () => void;
  openDelete: () => void;
  closeDelete: () => void;
  setCurrentDepartmentRole: (departmentRole: DepartmentRole | null) => void;
};

export const useDepartmentRoleUI = create<DepartmentRoleUIState>((set) => ({
  // initial state
  isAddOpen: false,
  isEditOpen: false,
  isDeleteOpen: false,
  currentDepartmentRole: null,

  // actions
  openAdd: () => set({ isAddOpen: true }),
  closeAdd: () => set({ isAddOpen: false }),
  openEdit: () => set({ isEditOpen: true }),
  closeEdit: () => set({ isEditOpen: false }),
  openDelete: () => set({ isDeleteOpen: true }),
  closeDelete: () => set({ isDeleteOpen: false }),
  setCurrentDepartmentRole: (departmentRole) =>
    set({ currentDepartmentRole: departmentRole }),
}));
