import { env } from "@/configs/env";
import { User } from "@/types";
import { create } from "zustand";

type StringNull = string | null;

interface AuthState {
    user: User | null;
    accessToken: StringNull;
    isAuthenticated: boolean;
    setAuth: (user: any, token: string) => void;
    logout: () => void;
}

export const useAuthstore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: !!localStorage.get(env.ACCESS_TOKEN_KEY),

    setAuth: (user, token) =>
        set((state) => ({
            ...state,
            user,
            accessToken: token,
            isAuthenticated: true,
        })),

    logout: () =>
        set((state) => ({
            ...state,
            user: null,
            accessToken: null,
            isAuthenticated: false,
        })),
}));