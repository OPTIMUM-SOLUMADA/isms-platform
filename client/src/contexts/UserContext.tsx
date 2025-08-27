import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import type { User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiAxiosError } from "@/types/api";
import { userService } from "@/services/userService";
import type { AddUserFormData } from "@/templates/forms/users/AddUserForm";
import type { UpdateUserFormData } from "@/templates/forms/users/EditUserForm";

// -----------------------------
// Context Types
// -----------------------------
type UserContextType = {
    users: User[];
    isLoading: boolean;
    fetchUsers: () => Promise<any>;
    createUser: (data: AddUserFormData) => Promise<boolean>;
    updateUser: (data: UpdateUserFormData) => Promise<boolean>;
    deleteUser: (id: string) => Promise<boolean>;
    selectedUser: User | null;
    setSelectedUser: (user: User) => void;
    // loading state
    isCreating?: boolean;
    isUpdating?: boolean;
    isDeleting?: boolean;
    // errors
    createError?: string | null;
    updateError?: string | null;
    deleteError?: string | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// -----------------------------
// Provider
// -----------------------------
type UserProviderProps = {
    children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, _setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { data: usersResponse, refetch: refetchUsers } = useQuery<any, ApiAxiosError>({
        queryKey: ['users'],
        queryFn: async () => await userService.list(),
        refetchInterval: 15000,
        staleTime: 1000 * 60,
    });

    useEffect(() => {
        if (usersResponse) {
            setUsers(usersResponse.data);
            setIsLoading(false);
        }
    }, [usersResponse]);

    const createUserMutation = useMutation<any, ApiAxiosError, AddUserFormData>({
        mutationFn: async (data) => await userService.create(data),
        onSuccess: (res) => {
            setUsers([...users, res.data]);
        },
        onError: (err) => {
            console.error(err);
        },
    });

    const updateUserMutation = useMutation<any, ApiAxiosError, UpdateUserFormData>({
        mutationFn: async (data) => {
            const { id, ...rest } = data;
            return await userService.update(id, rest);
        },
        onSuccess: (res) => {
            setUsers(prev => prev.map((user) => (
                user.id === res.data.id ? ({ ...user, ...res.data }) : user))
            );
        },
        onError: (err) => {
            console.error(err);
        },
    });

    const deleteUserMutation = useMutation<any, ApiAxiosError, { id: string }>({
        mutationFn: async ({ id }) => await userService.delete(id),
        onSuccess: (res) => {
            setUsers(prev => prev.filter(user => user.id !== res.data.id));
        },
        onError: (err) => {
            console.error(err);
        },
    });

    const createUser = useCallback(
        async (data: AddUserFormData): Promise<boolean> => {
            try {
                await createUserMutation.mutateAsync(data);
                return true;
            } catch (err) {
                console.error(err);
                return false;
            }
        },
        [createUserMutation]
    );

    const updateUser = useCallback(
        async (data: UpdateUserFormData): Promise<boolean> => {
            try {
                await updateUserMutation.mutateAsync(data);
                return true;
            } catch (err) {
                console.error(err);
                return false;
            }
        },
        [updateUserMutation]
    );


    const deleteUser = useCallback(async (id: string): Promise<boolean> => {
        try {
            await deleteUserMutation.mutateAsync({ id });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }, [deleteUserMutation]);

    const setSelectedUser = useCallback((user: User) => {
        _setSelectedUser(user);
    }, []);

    const values = useMemo(() => ({
        users,
        isLoading,
        fetchUsers: refetchUsers,
        createUser,
        updateUser,
        deleteUser,
        setSelectedUser,
        selectedUser,
        isCreating: createUserMutation.isPending,
        createError: createUserMutation.error?.response?.data?.code ?? null,
        isUpdating: updateUserMutation.isPending,
        updateError: updateUserMutation.error?.response?.data?.code ?? null,
        isDeleting: deleteUserMutation.isPending,
        deleteError: deleteUserMutation.error?.response?.data?.code ?? null
    }), [createUser,
        refetchUsers,
        isLoading,
        updateUser,
        deleteUser,
        users,
        selectedUser,
        setSelectedUser,
        createUserMutation.isPending,
        createUserMutation.error,
        updateUserMutation.isPending,
        updateUserMutation.error,
        deleteUserMutation.isPending,
        deleteUserMutation.error
    ]);

    return (
        <UserContext.Provider value={values}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
