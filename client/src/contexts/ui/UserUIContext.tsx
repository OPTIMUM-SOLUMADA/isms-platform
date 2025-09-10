import AddUserFormDialog from "@/templates/users/forms/dialogs/AddUserFormDialog";
import EditUserFormDialog from "@/templates/users/forms/dialogs/EditUserFormDialog";
import { User } from "@/types";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

type UserUIContextType = {
    isAddOpen: boolean;
    isEditOpen: boolean;
    openAdd: () => void;
    closeAdd: () => void;
    openEdit: () => void;
    closeEdit: () => void;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
};

const UserUIContext = createContext<UserUIContextType | undefined>(undefined);

export const UserUIProvider = ({ children }: { children: ReactNode }) => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [currentUser, _setCurrentUser] = useState<User | null>(null);

    const setCurrentUser = useCallback((user: User | null) => {
        _setCurrentUser(user);
    }, []);

    return (
        <UserUIContext.Provider
            value={{
                isAddOpen,
                isEditOpen,
                openAdd: () => setIsAddOpen(true),
                closeAdd: () => setIsAddOpen(false),
                openEdit: () => setIsEditOpen(true),
                closeEdit: () => setIsEditOpen(false),
                currentUser,
                setCurrentUser
            }}
        >
            {children}

            {/* Modals */}
            <AddUserFormDialog
                open={isAddOpen}
                onOpenChange={setIsAddOpen}
            />
            {currentUser && (
                <EditUserFormDialog
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    user={currentUser}
                />
            )}

        </UserUIContext.Provider>
    );
};

export const useUserUI = () => {
    const ctx = useContext(UserUIContext);
    if (!ctx) throw new Error("useUserUIContext must be used within UserUIProvider");
    return ctx;
};
