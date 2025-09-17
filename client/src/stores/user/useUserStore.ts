import { create } from "zustand";
import type { User } from "@/types";
import type { UserPagination } from "@/services/userService";

interface UserState {
    users: User[];
    setUsers: (users: User[]) => void;
    pushUser: (user: User) => void;
    removeUser: (id: string) => void;
    replaceUser: (id: string, user: User) => void;
    clearUsers: () => void;

    pagination: UserPagination;
    setPagination: (pagination: UserPagination) => void;
}

const useUserStore = create<UserState>((set) => ({
    users: [],
    setUsers: (users) => set({ users }),
    pushUser: (user) => set((state) => ({ users: [...state.users, user] })),
    removeUser: (id) => set((state) => ({ users: state.users.filter((user) => user.id !== id) })),
    replaceUser: (id, user) => set((state) => ({ users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)) })),
    clearUsers: () => set({ users: [] }),

    pagination: { page: 1, limit: 10 },
    setPagination: (pagination) => set({ pagination }),
}));

export default useUserStore;