import { create } from "zustand";
import type { DepartmentRole } from "@/types";
import type { Pagination } from "@/types/pagination";

interface DepartmentRoleState {
    departmentRoles: DepartmentRole[];
    setDepartmentRoles: (departmentRoles: DepartmentRole[]) => void;
    currentDepartmentRole: DepartmentRole | null;
    setCurrentDepartmentRole: (departmentRole: DepartmentRole | null) => void;
    // CRUD
    deleteDepartmentRole: (id: string) => void;
    replaceDepartement: (id: string, departmentRole: DepartmentRole) => void;
    // pagination
    pagination: Pagination;
    setPagination: (pagination: Pagination) => void;
    // search
    query: string;
    setQuery: (query: string) => void;
}

const useDepartmentRoleStore = create<DepartmentRoleState>((set) => ({
    departmentRoles: [],
    currentDepartmentRole: null,
    setDepartmentRoles: (departmentRoles) => set({ departmentRoles: departmentRoles }),
    setCurrentDepartmentRole: (departmentRole) => set({ currentDepartmentRole: departmentRole }),

    deleteDepartmentRole: (id: string) => set((state) => ({ departmentRoles: state.departmentRoles.filter((dep) => dep.id !== id) })),
    replaceDepartement: (id: string, departmentRole: DepartmentRole) => set((state) => ({ departmentRoles: state.departmentRoles.map((dep) => dep.id === id ? departmentRole : dep) })),

    pagination: { page: 1, limit: 11, total: 0, totalPages: 0 },
    setPagination: (pagination) => set({ pagination }),

    query: '',
    setQuery: (query) => set({ query }),
}));

export default useDepartmentRoleStore;