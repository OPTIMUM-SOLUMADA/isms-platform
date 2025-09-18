import { create } from "zustand";
import type { Department } from "@/types";
import type { Pagination } from "@/types/pagination";

interface DepartmentState {
    departments: Department[];
    setDepartments: (departments: Department[]) => void;
    currentDepartment: Department | null;
    setCurrentDepartment: (department: Department | null) => void;
    // CRUD
    deleteDepartment: (id: string) => void;
    replaceDepartement: (id: string, department: Department) => void;
    // pagination
    pagination: Pagination;
    setPagination: (pagination: Pagination) => void;
    // search
    query: string;
    setQuery: (query: string) => void;
}

const useDepartmentStore = create<DepartmentState>((set) => ({
    departments: [],
    currentDepartment: null,
    setDepartments: (departments) => set({ departments: departments }),
    setCurrentDepartment: (department) => set({ currentDepartment: department }),

    deleteDepartment: (id: string) => set((state) => ({ departments: state.departments.filter((dep) => dep.id !== id) })),
    replaceDepartement: (id: string, department: Department) => set((state) => ({ departments: state.departments.map((dep) => dep.id === id ? department : dep) })),

    pagination: { page: 1, limit: 11, total: 0, totalPages: 0 },
    setPagination: (pagination) => set({ pagination }),

    query: '',
    setQuery: (query) => set({ query }),
}));

export default useDepartmentStore;