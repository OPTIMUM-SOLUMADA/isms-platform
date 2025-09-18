import { create } from "zustand";
import type { User } from "@/types";

type Pagination = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

interface UserState {
    users: User[];
    setUsers: (users: User[]) => void;
    pushUser: (user: User) => void;
    removeUser: (id: string) => void;
    replaceUser: (id: string, user: User) => void;
    clearUsers: () => void;
    // Search
    query: string;
    setQuery: (query: string) => void;

    pagination: Pagination;
    setPagination: (pagination: Pagination) => void;

}

const useUserStore = create<UserState>((set) => ({
    users: [],
    setUsers: (users) => set({ users }),
    pushUser: (user) => set((state) => ({ users: [...state.users, user] })),
    removeUser: (id) => set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
    replaceUser: (id, user) => set((state) => ({ users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)) })),
    clearUsers: () => set({ users: [] }),

    pagination: { page: 1, limit: 5, total: 0, totalPages: 0 },
    setPagination: (pagination) => set({ pagination }),

    query: '',
    setQuery: (query) => set({ query }),

}));

export default useUserStore;