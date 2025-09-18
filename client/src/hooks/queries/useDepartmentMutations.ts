import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiAxiosError } from "@/types/api";
import { useEffect } from "react";
import { depService } from "@/services/departmentService";
import useDepartmentStore from "@/stores/department/useDepatrmentStore";
import { AddDepartmentFormData } from "@/templates/departments/forms/AddDepartmentForm";
import { useToast } from "../use-toast";
import { Department } from "@/types";
import { useTranslation } from "react-i18next";
import { EditDepartmentFormData } from "@/templates/departments/forms/EditDepartmentForm";
import { isEqual } from "lodash";

// -----------------------------
// Fetch Departments
// -----------------------------
export const useFetchDepartments = () => {
    const { setDepartments, setPagination, pagination } = useDepartmentStore();
    const query = useQuery<any, ApiAxiosError>({
        queryKey: ["departements", pagination.page, pagination.limit],
        queryFn: () => depService.list(pagination),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (query.data) {
            const { departments, pagination: newPag } = query.data.data;
            setDepartments(departments);

            // only update store if values actually changed
            if (!isEqual(pagination, newPag)) {
                setPagination(newPag);
            }
        };
    }, [query.data, setDepartments, setPagination, pagination]);

    return query;
};

// -----------------------------
// Create Department
// -----------------------------
export const useCreateDepartment = () => {
    const { toast } = useToast();
    const { setDepartments, departments } = useDepartmentStore();
    const queryClient = useQueryClient();

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
            queryClient.invalidateQueries({ queryKey: ["departements"] });
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
    const queryClient = useQueryClient();

    return useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: ({ id }) => depService.delete(id),
        onSuccess: (_, variables) => {
            toast({
                title: t("components.toast.success.title"),
                description: t("components.toast.success.department.deleted"),
                variant: "success",
            });
            deleteDepartment(variables.id);

            queryClient.invalidateQueries({ queryKey: ["departements"] });
        },
    });
};