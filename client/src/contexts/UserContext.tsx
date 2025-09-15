import { createContext, useContext, ReactNode, useMemo } from "react";
import { useFetchUsers } from "@/hooks/queries/useUserMutations";

// -----------------------------
// Context Types
// -----------------------------
type UserContextType = {
    isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// -----------------------------
// Provider
// -----------------------------
type UserProviderProps = {
    children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const { isLoading } = useFetchUsers();

    const values = useMemo(() => ({
        isLoading
    }), [isLoading]);

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
