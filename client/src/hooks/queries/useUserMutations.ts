import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import type { AddUserFormData } from "@/templates/users/forms/AddUserForm";
import type { UpdateUserFormData } from "@/templates/users/forms/EditUserForm";
import { ApiAxiosError } from "@/types/api";
import useUserStore from "@/stores/user/useUserStore";
import { User } from "@/types";
import { useEffect, useMemo } from "react";
import { useDebounce } from "../use-debounce";
import { isEqual } from "lodash";

// -----------------------------
// Fetch Users
// -----------------------------
export const useFetchUsers = () => {
    const { pagination, setUsers, setPagination } = useUserStore();
    const query = useQuery<any, ApiAxiosError>({
        queryKey: ["users", pagination.page, pagination.limit],
        queryFn: () => userService.list({ ...pagination }),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (query.data) {
            const { users, pagination: newP } = query.data.data;
            setUsers(users);
            if (!isEqual(pagination, newP)) {
                setPagination(pagination);
            }
        };
    }, [query.data, setUsers, setPagination, pagination]);

    return query;
};

export const useSearchUsers = () => {
    const { query } = useUserStore();
    const debounceQuery = useDebounce(query, 500);
    return useQuery<User[], ApiAxiosError>({
        queryKey: ["users", "search", debounceQuery],
        queryFn: async () => (await userService.search(debounceQuery)).data,
        // staleTime: 1000 * 30,
        enabled: !!debounceQuery,
    });
};

export const useFetchUsersByIds = (ids: string[]) => {
    const stableIds = useMemo(() => ids, [ids]);
    return useQuery<User[], ApiAxiosError>({
        queryKey: ["users", "useFetchUsersByIds", ids],
        queryFn: async () => (await userService.getUserByIds(stableIds)).data,
        // staleTime: 1000 * 5,
        enabled: stableIds.length > 0,
    });
};


// -----------------------------
// Create User
// -----------------------------
export const useCreateUser = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { pushUser } = useUserStore();
    const queryClient = useQueryClient();

    return useMutation<any, ApiAxiosError, AddUserFormData>({
        mutationFn: (data) => userService.create(data),
        onSuccess: (res) => {
            toast({
                title: t("components.toast.success.title"),
                description: t("components.toast.success.user.created"),
                variant: "success",
            });
            const newUser = res.data as User;
            pushUser(newUser);
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
            toast({
                title: t("components.toast.error.title"),
                description: t("components.toast.error.description"),
                variant: "destructive",
            });
        },
    });
};

// -----------------------------
// Update User
// -----------------------------
export const useUpdateUser = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { replaceUser } = useUserStore();
    const queryClient = useQueryClient();

    return useMutation<any, ApiAxiosError, UpdateUserFormData>({
        mutationFn: ({ id, ...rest }) => userService.update(id, rest),
        onSuccess: (res, variables) => {
            toast({
                title: t("components.toast.success.title"),
                description: t("components.toast.success.user.updated"),
                variant: "success",
            });
            replaceUser(variables.id, res.data);
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

// -----------------------------
// Delete User
// -----------------------------
export const useDeleteUser = () => {
    const { toast } = useToast();
    const { t } = useTranslation();
    const { removeUser } = useUserStore();

    const queryClient = useQueryClient();

    return useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: ({ id }) => userService.delete(id),
        onSuccess: (_, variables) => {
            toast({
                title: t("components.toast.success.title"),
                description: t("components.toast.success.user.deleted"),
                variant: "success",
            });
            removeUser(variables.id);
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

// --------------------------
// Activate or Desactivate User
// --------------------------
export const useToggleUserActivation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, active }: { id: string; active: boolean }) =>
            active ? userService.activate(id) : userService.deactivate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

//---------------------
// Send email invitation
//---------------------
export const useSendInvitation = () => {
    const { toast } = useToast();
    const { t } = useTranslation();

    return useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: ({ id }) => userService.sendInvitation(id),
        onSuccess: (res) => {
            toast({
                title: t("components.toast.success.title"),
                description: t("components.toast.success.user.invited", { email: res.data.email }),
                variant: "success",
            });
        },
    });
};