import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DocumentType } from "@/types";
import type { ApiAxiosError } from "@/types/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { documentTypeService } from "@/services/documenttypeService";
import { useDocumentTypeStore } from "@/stores/document-type/useDocumentTypeStore";
import { AddDocumentTypeFormData } from "@/templates/document-types/forms/AddDocumentTypeForm";
import { EditDocumentTypeFormData } from "@/templates/document-types/forms/EditDocumentTypeForm";
import { isEqual } from "lodash";

// -----------------------------
// Fetch Document Types
// -----------------------------
export const useFetchDocumentTypes = () => {
    const { pagination, setPagination, setDocumentTypes } = useDocumentTypeStore();

    const query = useQuery<any, ApiAxiosError>({
        queryKey: ["documentTypes", pagination.page, pagination.limit],
        queryFn: () => documentTypeService.list(pagination),
        staleTime: 1000 * 60 * 2,
    });

    useEffect(() => {
        if (query.data) {
            const { documentTypes, pagination: newP } = query.data.data;
            setDocumentTypes(documentTypes);
            if (!isEqual(pagination, newP)) {
                setPagination(newP);
            }
        }
    }, [query.data, setDocumentTypes, pagination, setPagination]);

    return query;
};

// -----------------------------
// Get Document Type by ID
// -----------------------------
export const useGetDocumentType = () => {
    return useMutation<DocumentType, ApiAxiosError, { id: string }>({
        mutationFn: async ({ id }) => (await documentTypeService.getById(id)).data,
        mutationKey: ["documentType", "get"],
    });
};

// -----------------------------
// Create Document Type
// -----------------------------
export const useCreateDocumentType = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { setDocumentTypes, documentTypes } = useDocumentTypeStore();
    const queryClient = useQueryClient();

    return useMutation<DocumentType, ApiAxiosError, AddDocumentTypeFormData>({
        mutationFn: async (data) => {
            return (await documentTypeService.create(data)).data;
        },
        onSuccess: (newDocType) => {
            toast({
                title: t("documentType.forms.add.toast.success.title"),
                description: t("documentType.forms.add.toast.success.description"),
                variant: "success",
            });
            setDocumentTypes([...documentTypes, newDocType]);
            queryClient.invalidateQueries({ queryKey: ["documentTypes"] });
        },
        onError: () => {
            toast({
                title: t("documentType.forms.add.toast.error.title"),
                description: t("documentType.forms.add.toast.error.description"),
                variant: "destructive",
            });
        },
    });
};

// -----------------------------
// Update Document Type
// -----------------------------
export const useUpdateDocumentType = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const setDocumentTypes = useDocumentTypeStore((s) => s.setDocumentTypes);
    const docTypes = useDocumentTypeStore((s) => s.documentTypes);
    const queryClient = useQueryClient();

    return useMutation<DocumentType, ApiAxiosError, { id: string; data: Partial<EditDocumentTypeFormData> }>({
        mutationFn: async ({ id, data }) => {
            return (await documentTypeService.update(id, data)).data;
        },
        onSuccess: (updatedDocType, vars) => {
            toast({
                title: t("documentType.forms.edit.toast.success.title"),
                description: t("documentType.forms.edit.toast.success.description"),
                variant: "success",
            });
            setDocumentTypes(docTypes.map((d) => (d.id === vars.id ? updatedDocType : d)));
            queryClient.invalidateQueries({ queryKey: ["documentTypes"] });
        },
        onError: () => {
            toast({
                title: t("documentType.forms.edit.toast.error.title"),
                description: t("documentType.forms.edit.toast.error.description"),
                variant: "destructive",
            });
        },
    });
};

// -----------------------------
// Delete Document Type
// -----------------------------
export const useDeleteDocumentType = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const setDocumentTypes = useDocumentTypeStore((s) => s.setDocumentTypes);
    const docTypes = useDocumentTypeStore((s) => s.documentTypes);
    const queryClient = useQueryClient();

    return useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: async ({ id }) => await documentTypeService.delete(id),
        onSuccess: (_, vars) => {
            toast({
                title: t("documentType.forms.delete.toast.success.title"),
                description: t("documentType.forms.delete.toast.success.description"),
                variant: "success",
            });
            setDocumentTypes(docTypes.filter((d) => d.id !== vars.id));
            queryClient.invalidateQueries({ queryKey: ["documentTypes"] });
        },
        onError: () => {
            toast({
                title: t("documentType.forms.delete.toast.error.title"),
                description: t("documentType.forms.delete.toast.error.description"),
                variant: "destructive",
            });
        },
    });
};
