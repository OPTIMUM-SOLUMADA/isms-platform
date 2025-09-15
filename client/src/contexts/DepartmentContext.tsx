import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import type { Department } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiAxiosError } from "@/types/api";
import { depService } from "@/services/departmentService";
import { AddDepartmentFormData } from "@/templates/departments/AddDepartmentForm";
import { toast } from "sonner";
import { documentTypeService } from "@/services/documenttypeService";

type DepartmentContextType = {
    createDepartment: (data: AddDepartmentFormData) => Promise<boolean>;
    isLoading: boolean;
    isCreating?: boolean;
    createError?: string | null;
    departments: Department[]

    createSuccess?: boolean;
    // resetCreate: () => void;
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

    const createDepartmentMutation = useMutation<any, ApiAxiosError, AddDepartmentFormData>({
        mutationFn: async (data) => await documentTypeService.create(data),

        onSuccess: (res) => {
            setDepartments([...departments, res.data]);
            toast({
                title: "Success",
                description: "Department created successfully",
                variant: "success",
            })
        },
        onError: (err) => {
            console.error(err.response?.data);
            toast({
                title: "Error",
                description: "An error occurred while creating the department. Please try again.",
                variant: "destructive",
            })
        }
    });

    const createDepartment = useCallback(
       async (data: AddDepartmentFormData): Promise<boolean> => {
        
        try {
            await createDepartmentMutation.mutateAsync(data);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }},

        [createDepartmentMutation] 
    ) 

    const values = useMemo(() => ({
        createDepartment,
        departments,
        isLoading,
        // createError: createDepartmentMutation.error?.response?.data?.name ?? null,
    }), [createDepartment, departments, isLoading,]);

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
