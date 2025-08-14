import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AuthService from '@/services/authService';
import { User } from '@/types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<string | null>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const isAuthenticated = !!user;

    useEffect(() => {
        AuthService.verify().then(res => {
            if (res.data) {
                console.log('Checking auth status', res.data);
                setUser(res.data);
            } else {
                setUser(null);
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<string | null> => {
        try {
            const res = await AuthService.login(email, password);
            console.log(res.status)
            setUser(res.data);
            return null;
        } catch (err: any) {
            // Handle API error message
            const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
            console.log(errorMessage)
            return errorMessage;
        }
    }, []);

    const logout = async (): Promise<void> => {
        try {
            await AuthService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading: isLoading,
        login,
        logout,
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