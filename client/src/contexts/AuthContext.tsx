import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '@/services/authService';
import { User } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { env } from '@/configs/env';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ApiAxiosError } from '@/types/api';

export type LoginCredentials = {
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoggingIn: boolean;
    login: (data: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    error?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useLocalStorage<string | null>(env.ACCESS_TOKEN_KEY, null);

    const isAuthenticated = !!user;


    // Verify user if token exists
    const { isLoading, data: verifiedUser } = useQuery<User | null, ApiAxiosError>({
        queryKey: ['auth', token],
        queryFn: async () => {
            if (!token) return null;
            const res = await AuthService.verify();
            return res.data ?? null;
        },
        enabled: !!token,
        retry: false,
    });

    useEffect(() => {
        console.log(verifiedUser)
        if (verifiedUser) {
            setUser(verifiedUser);
        }
    }, [verifiedUser]);



    const loginMutation = useMutation<any, ApiAxiosError, LoginCredentials>({
        mutationFn: async (credentials) => AuthService.login(
            credentials.email,
            credentials.password
        ),
        onSuccess: (res) => {
            setUser(res.data);
        }
    });

    const logoutMutation = useMutation<any, ApiAxiosError, void>({
        mutationFn: async () => AuthService.logout(),
        onSuccess: () => {
            setToken(null);
            setUser(null);
        },
    });

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading: isLoading,
        isLoggingIn: loginMutation.isPending,
        error: loginMutation.error?.response?.data?.error,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};