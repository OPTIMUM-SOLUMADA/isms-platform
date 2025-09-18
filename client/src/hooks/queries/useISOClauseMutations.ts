import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ISOClause } from "@/types";
import type { ApiAxiosError } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { isoClauseService } from "@/services/isoClauseService";
import useISOClauseStore from "@/stores/iso-clause/useISOClauseStore";
import { AddISOClauseFormData } from "@/templates/iso-clauses/forms/AddISOClauseForm";
import { EditISOClauseFormData } from "@/templates/iso-clauses/forms/EditISOClauseForm";
import { isEqual } from "lodash";
import { useDebounce } from "../use-debounce";

// -----------------------------
// Fetch Document Types
// -----------------------------
export const useFetchISOClauses = () => {
    const { pagination, setPagination, setIsoClauses } = useISOClauseStore();

    const query = useQuery<any, ApiAxiosError>({
        queryKey: ["isoClauses", pagination.page, pagination.limit],
        queryFn: () => isoClauseService.list(pagination),
        staleTime: 1000 * 60 * 2,
    });

    useEffect(() => {
        if (query.data) {
            const { iSOClauses, pagination: newP } = query.data.data;
            setIsoClauses(iSOClauses);
            if (!isEqual(pagination, newP)) {
                setPagination(newP);
            }
        }
    }, [query.data, setIsoClauses, pagination, setPagination]);

    return query;
};

// Search
export const useSearchIsoClauses = () => {
    const { query } = useISOClauseStore();
    const debounceQuery = useDebounce(query, 500);
    return useQuery<ISOClause[], ApiAxiosError>({
        queryKey: ["isoClauses", "search", debounceQuery],
        queryFn: async () => (await isoClauseService.search(debounceQuery)).data,
        staleTime: 1000 * 30,
        // enabled: !!debounceQuery,
    });
};


// -----------------------------
// Get Document Type by ID
// -----------------------------
export const useGetISOClause = () => {
    return useMutation<ISOClause, ApiAxiosError, { id: string }>({
        mutationFn: async ({ id }) => (await isoClauseService.getById(id)).data,
        mutationKey: ["isoClauses", "get"],
    });
};

// -----------------------------
// Create Document Type
// -----------------------------
export const useCreateISOClause = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { push } = useISOClauseStore();
    const queryClient = useQueryClient();

    return useMutation<any, ApiAxiosError, AddISOClauseFormData>({
        mutationFn: async (data) => {
            return isoClauseService.create(data);
        },
        onSuccess: (res) => {
            toast({
                title: t("isoClause.forms.add.toast.success.title"),
                description: t("isoClause.forms.add.toast.success.description"),
                variant: "success",
            });
            const newISO = res.data as ISOClause;
            push(newISO);
            queryClient.invalidateQueries({ queryKey: ["isoClauses"] });
        },
        onError: () => {
            toast({
                title: t("isoClause.forms.add.toast.error.title"),
                description: t("isoClause.forms.add.toast.error.description"),
                variant: "destructive",
            });
        },
    });
};

// -----------------------------
// Update Document Type
// -----------------------------
export const useUpdateISOClause = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { replace } = useISOClauseStore();
    const queryClient = useQueryClient();

    return useMutation<ISOClause, ApiAxiosError, { id: string; data: Partial<EditISOClauseFormData> }>({
        mutationFn: async ({ id, data }) => {
            return (await isoClauseService.update(id, data)).data;
        },
        onSuccess: (updatedDocType, vars) => {
            toast({
                title: t("isoClause.forms.edit.toast.success.title"),
                description: t("isoClause.forms.edit.toast.success.description"),
                variant: "success",
            });
            replace(vars.id, updatedDocType);
            queryClient.invalidateQueries({ queryKey: ["documentTypes"] });
            queryClient.invalidateQueries({ queryKey: ["isoClauses"] });
        },
        onError: () => {
            toast({
                title: t("isoClause.forms.edit.toast.error.title"),
                description: t("isoClause.forms.edit.toast.error.description"),
                variant: "destructive",
            });
        },
    });
};

// -----------------------------
// Delete Document Type
// -----------------------------
export const useDeleteISOClause = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { remove } = useISOClauseStore();
    const queryClient = useQueryClient();

    return useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: async ({ id }) => await isoClauseService.delete(id),
        onSuccess: (_, vars) => {
            toast({
                title: t("isoClause.forms.delete.toast.success.title"),
                description: t("isoClause.forms.delete.toast.success.description"),
                variant: "success",
            });
            remove(vars.id);
            queryClient.invalidateQueries({ queryKey: ["isoClauses"] });
        },
        onError: () => {
            toast({
                title: t("isoClause.forms.delete.toast.error.title"),
                description: t("isoClause.forms.delete.toast.error.description"),
                variant: "destructive",
            });
        },
    });
};
