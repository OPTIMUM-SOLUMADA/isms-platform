import { create } from "zustand";
import type { DocumentOwner } from "@/types";
import type { Pagination } from "@/types/pagination";


interface OwnerState {
    owners: DocumentOwner[];
    setOwners: (owners: DocumentOwner[]) => void;
    pushUser: (user: DocumentOwner) => void;
    removeUser: (id: string) => void;
    replaceUser: (id: string, user: DocumentOwner) => void;
    clearOwners: () => void;
    // Search
    query: string;
    setQuery: (query: string) => void;

    pagination: Pagination;
    setPagination: (pagination: Pagination) => void;

}

const useOwnerStore = create<OwnerState>((set) => ({
    owners: [],
    setOwners: (owners) => set({ owners }),
    pushUser: (user) => set((state) => ({ owners: [...state.owners, user] })),
    removeUser: (id) => set((state) => ({ owners: state.owners.filter((user) => user.id !== id) })),
    replaceUser: (id, user) => set((state) => ({ owners: state.owners.map((u) => (u.id === id ? { ...u, ...user } : u)) })),
    clearOwners: () => set({ owners: [] }),

    pagination: { page: 1, limit: 5, total: 0, totalPages: 0 },
    setPagination: (pagination) => set({ pagination }),

    query: '',
    setQuery: (query) => set({ query }),

}));

export default useOwnerStore;