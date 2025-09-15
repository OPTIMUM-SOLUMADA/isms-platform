import { create } from "zustand";
import type { Department } from "@/types";

interface DepartmentState {
    departments: Department[];
    setDepartments: (departments: Department[]) => void;
    currentDepartment: Department | null;
    setCurrentDepartment: (department: Department | null) => void;
}

const useDepartmentStore = create<DepartmentState>((set) => ({
    departments: [],
    currentDepartment: null,
    setDepartments: (departments) => set({ departments: departments }),
    setCurrentDepartment: (department) => set({ currentDepartment: department }),
}));

export default useDepartmentStore;