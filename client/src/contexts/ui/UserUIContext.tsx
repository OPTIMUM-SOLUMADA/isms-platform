import { createContext, useContext, useState, ReactNode } from "react";

type UserUIContextType = {
    isAddOpen: boolean;
    isEditOpen: boolean;
    openAdd: () => void;
    closeAdd: () => void;
    openEdit: () => void;
    closeEdit: () => void;
};

const UserUIContext = createContext<UserUIContextType | undefined>(undefined);

export const UserUIProvider = ({ children }: { children: ReactNode }) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <UserUIContext.Provider
            value={{
                isAddOpen,
                isEditOpen,
                openAdd: () => setIsAddOpen(true),
                closeAdd: () => setIsAddOpen(false),
                openEdit: () => setIsEditOpen(true),
                closeEdit: () => setIsEditOpen(false),
            }}
        >
            {children}
        </UserUIContext.Provider>
    );
};

export const useUserUI = () => {
    const ctx = useContext(UserUIContext);
    if (!ctx) throw new Error("useUserUIContext must be used within UserUIProvider");
    return ctx;
};
