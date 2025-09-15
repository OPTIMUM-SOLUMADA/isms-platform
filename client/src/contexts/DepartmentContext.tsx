import { createContext, useContext, ReactNode, useMemo } from "react";
import { useFetchDepartments } from "@/hooks/queries/departmentMutations";

type DepartmentContextType = {
    isLoading: boolean;
};

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined); type DepartmentProviderProps = {
    children: ReactNode;
};

export const DepartmentProvider = ({ children }: DepartmentProviderProps) => {

    const { isLoading } = useFetchDepartments();

    const values = useMemo(() => ({
        isLoading,
    }), [isLoading,]);

    return (
        <DepartmentContext.Provider value={values}>
            {children}
        </DepartmentContext.Provider>
    );
};

export const useDepartment = (): DepartmentContextType => {
    const context = useContext(DepartmentContext);
    if (!context) {
        throw new Error("useUser must be used within a DepartmentProvider");
    }
    return context;
};
