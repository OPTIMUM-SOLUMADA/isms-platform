import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiAxiosError } from "@/types/api";
import { useEffect } from "react";
import { depService } from "@/services/departmentService";
import useDepartmentStore from "@/stores/department/useDepatrmentStore";
import { AddDepartmentFormData } from "@/templates/departments/forms/AddDepartmentForm";
import { useToast } from "../use-toast";
import { Department } from "@/types";
import { useTranslation } from "react-i18next";
import { EditDepartmentFormData } from "@/templates/departments/forms/EditDepartmentForm";

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

// -----------------------------
// Update Department
// -----------------------------
export const useUpdateDepartment = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { replaceDepartement } = useDepartmentStore();

    return useMutation<any, ApiAxiosError, EditDepartmentFormData>({
        mutationFn: ({ id, ...rest }) => depService.update(id, rest),
        onSuccess: (res, variables) => {
            toast({
                title: t("components.toast.success.title"),
                description: t("components.toast.success.department.updated"),
                variant: "success",
            });
            replaceDepartement(variables.id, res.data);
        },
    });
};

// -----------------------------
// Delete Department
// -----------------------------
export const useDeleteDepartment = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { deleteDepartment } = useDepartmentStore();

    return useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: ({ id }) => depService.delete(id),
        onSuccess: (_, variables) => {
            toast({
                title: t("components.toast.success.title"),
                description: t("components.toast.success.department.deleted"),
                variant: "success",
            });
            deleteDepartment(variables.id);
        },
    });
};