import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiAxiosError } from "@/types/api";
import { useEffect } from "react";
// import { depService } from "@/services/departmentRoleService";
// import useDepartmentRoleStore from "@/stores/departmentRole/useDepatrmentStore";
// import { AddDepartmentRoleFormData } from "@/templates/departmentRoles/forms/AddDepartmentRoleForm";
import { useToast } from "../use-toast";
import { DepartmentRole } from "@/types";
import { useTranslation } from "react-i18next";
// import { EditDepartmentRoleFormData } from "@/templates/departmentRoles/forms/EditDepartmentRoleForm";
import { isEqual } from "lodash";
import { useDebounce } from "../use-debounce";
import useDepartmentRoleStore from "@/stores/department/useDepatrmentRoleStore";
import { depService } from "@/services/departmentService";
import { AddDepartmentRoleFormData } from "@/templates/departments/forms/AddDepartmentRoleForm";

// -----------------------------
// Fetch DepartmentRoles
// -----------------------------
export const useFetchDepartmentRoles = () => {
    const { setDepartmentRoles, setPagination, pagination } = useDepartmentRoleStore();
    const query = useQuery<any, ApiAxiosError>({
        queryKey: ["departements", pagination.page, pagination.limit],
        queryFn: () => depService.getRoles(pagination),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (query.data) {
            const { departmentRoles, pagination: newPag } = query.data.data;
            setDepartmentRoles(departmentRoles);

            // only update store if values actually changed
            if (!isEqual(pagination, newPag)) {
                setPagination(newPag);
            }
        };
    }, [query.data, setDepartmentRoles, setPagination, pagination]);

    return query;
};

// Search
export const useSearchDepartmentRoles = () => {
    const { query } = useDepartmentRoleStore();
    const debounceQuery = useDebounce(query, 500);
    return useQuery<DepartmentRole[], ApiAxiosError>({
        queryKey: ["departements", "search", debounceQuery],
        queryFn: async () => (await depService.searchRole(debounceQuery)).data,
        staleTime: 1000 * 30,
        // enabled: !!debounceQuery,
    });
};

// -----------------------------
// Create DepartmentRole
// -----------------------------
export const useCreateDepartmentRole = (departmentId: string) => {
    const { toast } = useToast();
    const { setDepartmentRoles, departmentRoles } = useDepartmentRoleStore();
    const queryClient = useQueryClient();

    return useMutation<any, ApiAxiosError, AddDepartmentRoleFormData>({
        mutationFn: async (data) => await depService.createRole(departmentId, data),
            onSuccess: (res) => {
                console.log("departmentRoles", res);
                toast({
                    title: "Success",
                    description: "DepartmentRole created successfully",
                    variant: "success",
                });
                const newDep = res.data as DepartmentRole;
                setDepartmentRoles([...departmentRoles, newDep]);
                queryClient.invalidateQueries({ queryKey: ["departements"] });
            },
    });
};

// -----------------------------
// Update DepartmentRole
// -----------------------------
// export const useUpdateDepartmentRole = () => {
//     const { toast } = useToast();
//     const { t } = useTranslation();
//     const { replaceDepartement } = useDepartmentRoleStore();
//     const queryClient = useQueryClient();

//     return useMutation<any, ApiAxiosError, EditDepartmentRoleFormData>({
//         mutationFn: ({ id, ...rest }) => depService.updateRoles(id, rest),
//         onSuccess: (res, variables) => {
//             toast({
//                 title: t("components.toast.success.title"),
//                 description: t("components.toast.success.departmentRole.updated"),
//                 variant: "success",
//             });
//             replaceDepartement(variables.id, res.data);
//             queryClient.invalidateQueries({ queryKey: ["departements"] });
//         },
//     });
// };

// -----------------------------
// Delete DepartmentRole
// -----------------------------
export const useDeleteDepartmentRole = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { deleteDepartmentRole } = useDepartmentRoleStore();
    const queryClient = useQueryClient();

    return useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: ({ id }) => depService.deleteRoles(id),
        onSuccess: (_, variables) => {
            toast({
                title: t("components.toast.success.title"),
                description: t("components.toast.success.departmentRole.deleted"),
                variant: "success",
            });
            deleteDepartmentRole(variables.id);

            queryClient.invalidateQueries({ queryKey: ["departements"] });
        },
    });
};