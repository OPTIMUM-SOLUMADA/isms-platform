import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToggleUserActivation } from "@/hooks/queries/useUserMutations";
import { useUserUIStore } from "@/stores/user/useUserUIStore";
import { LoadingButton } from "@/components/ui/loading-button";
import { useTranslation } from "react-i18next";

export const DeactivateUserDialog = () => {
    const { currentUser, isDesactivationOpen, closeDesactivation, setCurrentUser } = useUserUIStore();
    const { mutate: toggleUser, isPending } = useToggleUserActivation();

    const { t } = useTranslation();

    const confirmDeactivate = () => {
        if (!currentUser) return;
        toggleUser({ id: currentUser.id, active: false }, {
            onSuccess: () => {
                handleCloseModal();
            },
        });
    };

    function handleCloseModal() {
        setCurrentUser(null);
        closeDesactivation();
    }

    return (
        <Dialog open={isDesactivationOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("user.deactivate.dialog.title")}</DialogTitle>
                    <DialogDescription>
                        {t("user.deactivate.dialog.message")}
                        <br />
                        <p className="text-primary p-2 border bg-theme-warning/20 border-theme-warning/20 mt-2 rounded-lg">
                            {t("user.deactivate.dialog.important")}
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCloseModal}>
                        {t("user.deactivate.dialog.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        variant="destructive"
                        onClick={confirmDeactivate}
                        isLoading={isPending}
                        loadingText={t("user.deactivate.dialog.actions.confirm.loading")}
                    >
                        {t("user.deactivate.dialog.actions.confirm.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
