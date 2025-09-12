import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AuthService from '@/services/authService';
import { User } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { env } from '@/configs/env';
import { useMutation } from '@tanstack/react-query';
import type { ApiAxiosError } from '@/types/api';

export type LoginCredentials = {
    email: string;
    password: string;
    rememberMe?: boolean;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoggingIn: boolean;
    login: (data: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    errorCode?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useLocalStorage<string | null>(env.ACCESS_TOKEN_KEY, null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const isAuthenticated = useMemo(() => !!user, [user]);

    useEffect(() => {
        if (!token) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        AuthService.verify()
            .then(res => {
                setUser(res.data);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [token]);

    const loginMutation = useMutation<any, ApiAxiosError, LoginCredentials>({
        mutationFn: async (credentials) => AuthService.login({
            email: credentials.email,
            password: credentials.password,
            rememberMe: credentials.rememberMe
        }),
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
        errorCode: loginMutation.error?.response?.data?.code,
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