import { DepartmentRoleUIModals } from "@/templates/departments/modal/DepartmentRoleUIModals";
import { DepartmentUIModals } from "@/templates/departments/modal/DepartmentUIModals";
import { DocumentTypeUIModals } from "@/templates/document-types/modal/DocumentTypeUIModals";
import { DocumentUIModals } from "@/templates/documents/modals/DocumentUIModals";
import { ISOClauseUIModals } from "@/templates/iso-clauses/modal/ISOClauseUIModals";
import ReviewsAlertDrawer from "@/templates/reviews/ReviewsAlertDrawer";
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
            {/* Department modals */}
            <DepartmentUIModals />
            {/* Department Role modals */}
            <DepartmentRoleUIModals />
            {/* Document type modals */}
            <DocumentTypeUIModals />
            {/* ISOClause modals */}
            <ISOClauseUIModals />

            {/* Reviews Alert */}
            <ReviewsAlertDrawer />
        </UIContext.Provider>
    );
};