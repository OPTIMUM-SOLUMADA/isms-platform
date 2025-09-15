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

export const ActivateUserDialog = () => {
    // you can re-use the same store or have a separate flag for activation
    const { currentUser, isActivationOpen, closeActivation, setCurrentUser } =
        useUserUIStore();
    const { mutate: toggleUser, isPending } = useToggleUserActivation();

    const { t } = useTranslation();

    const confirmActivate = () => {
        if (!currentUser) return;
        toggleUser(
            { id: currentUser.id, active: true },
            {
                onSuccess: () => {
                    handleCloseModal();
                },
            }
        );
    };

    function handleCloseModal() {
        setCurrentUser(null);
        closeActivation();
    }

    return (
        <Dialog open={isActivationOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("user.activate.dialog.title")}</DialogTitle>
                    <DialogDescription>
                        {t("user.activate.dialog.message")}
                        <br />
                        <p className="text-primary p-2 border bg-theme-warning/20 border-theme-warning/20 mt-2 rounded-lg">
                            {t("user.activate.dialog.important")}
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCloseModal}>
                        {t("user.activate.dialog.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        variant="default"
                        onClick={confirmActivate}
                        isLoading={isPending}
                        loadingText={t("user.activate.dialog.actions.confirm.loading")}
                    >
                        {t("user.activate.dialog.actions.confirm.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
