
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@/components/ui/loading-button";
import type { User } from "@/types";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserUIStore } from "@/stores/user/useUserUIStore";
import { useDeleteUser } from "@/hooks/queries/useUserMutations";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
}
const DeleteUserDialog = ({
    open = false,
    onOpenChange,
    user,
}: Props) => {
    const { t } = useTranslation();
    const { mutate: deleteUser, isSuccess, isPending, reset } = useDeleteUser();
    const { user: activeUser } = useAuth();
    const { setCurrentUser } = useUserUIStore();

    useEffect(() => {
        if (isSuccess) {
            setCurrentUser(null);
            onOpenChange(false);
            reset();
        }
    }, [onOpenChange, isSuccess, setCurrentUser, reset]);

    const isHisOwnAccount = useMemo(() => {
        return user.id === activeUser?.id;
    }, [user, activeUser]);

    const hasDocuments = useMemo(() => {
        return user.documentOwners?.length > 0;
    }, [user]);

    function handleOpenChange(value: boolean) {
        if (!value) setCurrentUser(null);
        onOpenChange(value);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-6 h-6 text-theme-danger" />
                        <DialogTitle>
                            {t("components.deleteDialog.title", { entity: user.name })}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {t("components.deleteDialog.description", { entity: user.name })}
                        <div className="mt-3 text-primary">

                            <p className="text-primary">
                                {t("user.delete.dialog.message")}
                            </p>

                            <ul className="mt-3 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                                <li>
                                    {t("user.delete.dialog.relatedItems.documents", {
                                        name: user.name,
                                    })}
                                </li>
                                <li>
                                    {t("user.delete.dialog.relatedItems.reviews", {
                                        name: user.name,
                                    })}
                                </li>
                                <li>
                                    {t("user.delete.dialog.relatedItems.pendingReviews", {
                                        name: user.name,
                                    })}
                                </li>
                                <li>
                                    {t("user.delete.dialog.relatedItems.auditLogs", {
                                        name: user.name,
                                    })}
                                </li>
                            </ul>
                            {(hasDocuments || isHisOwnAccount) ? (
                                <div className="mt-3 bg-amber-100 rounded-lg py-3 px-5 border border-amber-200">
                                    <p className="text-primary">
                                        {t("user.delete.dialog.cannotDeleteDescription")}
                                    </p>

                                    <ul className="mt-1 space-y-1 list-disc list-inside text-sm text-muted-foreground">
                                        {isHisOwnAccount && (
                                            <li className="text-amber-600 flex items-start gap-2">
                                                <TriangleAlert className="w-4 h-4 shrink-0" />
                                                {t("user.delete.dialog.actions.notPermitted")}
                                            </li>
                                        )}

                                        {hasDocuments && (
                                            <li className="text-amber-600 flex items-start gap-2">
                                                <TriangleAlert className="w-4 h-4 shrink-0" />
                                                {t("user.delete.dialog.actions.hasDocuments")}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            ) : (
                                <p className="mt-3 text-theme-1 font-semibold flex items-center gap-2">
                                    <Info className="w-4 h-4 shrink-0" />
                                    {t("user.delete.dialog.canBeDeleted")}
                                </p>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                        {t("components.deleteDialog.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        variant="destructive"
                        onClick={() => {
                            if (hasDocuments || isHisOwnAccount) return;
                            deleteUser({ id: user.id });
                        }}
                        isLoading={isPending}
                        disabled={hasDocuments || isHisOwnAccount}
                        loadingText={t("components.deleteDialog.actions.confirm.loading")}
                    >
                        {t("components.deleteDialog.actions.confirm.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteUserDialog