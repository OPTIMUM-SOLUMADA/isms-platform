import { DocumentUIModals } from "@/templates/documents/modals/DocumentUIModals";
import { UserUIModals } from "@/templates/users/modals/UserUIModals";
import { createContext, ReactNode } from "react";

const UIContext = createContext<undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    return (
        <UIContext.Provider value={undefined}>
            {children}
            {/* User modals */}
            <UserUIModals />
            {/* Document modals */}
            <DocumentUIModals />
        </UIContext.Provider>
    );
};