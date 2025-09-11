import AddUserFormDialog from "@/templates/users/forms/dialogs/AddUserFormDialog";
import EditUserFormDialog from "@/templates/users/forms/dialogs/EditUserFormDialog";
import DeleteUserDialog from "@/templates/users/dialog/DeleteUserDialog";
import { useUserUI } from "@/stores/useUserUI";

export const UserUIModals = () => {
    const {
        isAddOpen,
        isEditOpen,
        isDeleteOpen,
        currentUser,
        // these setters are needed because Dialog’s onOpenChange expects (open: boolean)
        openAdd,
        closeAdd,
        openEdit,
        closeEdit,
        openDelete,
        closeDelete,
    } = useUserUI();

    return (
        <>
            <AddUserFormDialog
                open={isAddOpen}
                onOpenChange={(open) => (open ? openAdd() : closeAdd())}
            />
            {currentUser && (
                <EditUserFormDialog
                    open={isEditOpen}
                    onOpenChange={(open) => (open ? openEdit() : closeEdit())}
                    user={currentUser}
                />
            )}
            {currentUser && (
                <DeleteUserDialog
                    open={isDeleteOpen}
                    onOpenChange={(open) => (open ? openDelete() : closeDelete())}
                    user={currentUser}
                />
            )}
        </>
    );
};
