
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@/components/ui/loading-button";
import type { DepartmentRole } from "@/types";
import { useDeleteDepartmentRole } from "@/hooks/queries/useDepartmentRoleMutations";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    departmentRole: DepartmentRole;
}
const DeleteDepartmentRoleDialog = ({
    open = false,
    onOpenChange,
    departmentRole,
}: Props) => {
    const { t } = useTranslation();
    const { mutate: deleteDepartmentRole, isPending } = useDeleteDepartmentRole();

    function handleClose() {
        onOpenChange(false);
    }

    const confirmDeletion = () => {
        deleteDepartmentRole(
            { id: departmentRole.id },
            {
                onSuccess: () => {
                    handleClose();
                },
            }
        );
    };

    // const hasMembers = departmentRole.departmentMembers.length > 0;
    // const hasDocuments = departmentRole.documents.length > 0;

    // const cannotBeDeleted = hasMembers;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-theme-danger" />
                        <DialogTitle>
                            {t("components.deleteDialog.title", { entity: departmentRole.name })}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {t("components.deleteDialog.description", { entity: departmentRole.name })}
                        <div className="mt-3 text-primary">

                            {/* <p className="text-primary">
                                {t("departmentRole.actions.delete.dialog.message")}
                            </p>

                            <ul className="mt-3 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                                {/* <li>{t("department.actions.delete.dialog.relatedItems.users")}</li> * /}
                                <li>{t("departmentRole.actions.delete.dialog.relatedItems.douments")}</li>
                            </ul> */}
                                {/* <p className="mt-3 text-theme-1 font-semibold flex items-center gap-2">
                                    <Info className="w-4 h-4 shrink-0" />
                                    {t("department.actions.delete.dialog.canBeDeleted")}
                                </p> */}
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={handleClose}>
                        {t("components.deleteDialog.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        variant="destructive"
                        onClick={() => {
                            confirmDeletion();
                        }}
                        isLoading={isPending}
                        loadingText={t("components.deleteDialog.actions.confirm.loading")}
                    >
                        {t("components.deleteDialog.actions.confirm.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteDepartmentRoleDialog;