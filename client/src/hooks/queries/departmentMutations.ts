import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiAxiosError } from "@/types/api";
import { useEffect } from "react";
import { depService } from "@/services/departmentService";
import useDepartmentStore from "@/stores/department/useDepatrmentStore";
import { AddDepartmentFormData } from "@/templates/departments/AddDepartmentForm";
import { useToast } from "../use-toast";
import { Department } from "@/types";

// -----------------------------
// Fetch Departments
// -----------------------------
export const useFetchDepartments = () => {
    const { setDepartments } = useDepartmentStore();
    const query = useQuery<any, ApiAxiosError>({
        queryKey: ["departelents"],
        queryFn: () => depService.list(),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        console.log(query.data.data)
        if (query.data) setDepartments(query.data.data);
    }, [query.data, setDepartments]);

    return query;
};

// -----------------------------
// Create Department
// -----------------------------
export const useCreateDepartment = () => {
    const { toast } = useToast();
    const { setDepartments, departments } = useDepartmentStore();

    return useMutation<any, ApiAxiosError, AddDepartmentFormData>({
        mutationFn: async (data) => await depService.create(data),
        onSuccess: (res) => {
            toast({
                title: "Success",
                description: "Department created successfully",
                variant: "success",
            });
            const newDep = res.data as Department;
            setDepartments([...departments, newDep]);
        },
    });
};