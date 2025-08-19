import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import type { Department } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ApiAxiosError } from "@/types/api";
import { depService } from "@/services/departmentService";

type DepartmentContextType = {
    isLoading: boolean;
    departments: Department[]
};

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined); type DepartmentProviderProps = {
    children: ReactNode;
};

export const DepartmentProvider = ({ children }: DepartmentProviderProps) => {
    const [departments, setDepartments] = useState<Department[]>([]);

    const { data: depResponse, isLoading } = useQuery<any, ApiAxiosError>({
        queryKey: ['departments'],
        queryFn: async () => await depService.list(),
        refetchInterval: 15000,
    });

    useEffect(() => {
        if (depResponse) {
            setDepartments(depResponse.data);
        }
    }, [depResponse]);

    const values = useMemo(() => ({
        departments,
        isLoading
    }), [isLoading, departments]);

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
