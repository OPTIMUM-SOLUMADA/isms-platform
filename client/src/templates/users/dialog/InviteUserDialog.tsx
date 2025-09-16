import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useTranslation } from "react-i18next";
import { useUserUIStore } from "@/stores/user/useUserUIStore";
import { useSendInvitation } from "@/hooks/queries/useUserMutations";

export const InviteUserConfirmDialog = () => {
    const { isInvitationOpen, closeInvitation, currentUser } = useUserUIStore();
    const { mutate: sendInvitation, isPending } = useSendInvitation();
    const { t } = useTranslation();

    const handleClose = () => {
        closeInvitation();
    };

    const confirmInvite = () => {
        if (!currentUser) return alert("current user is null");
        sendInvitation(
            { id: currentUser.id },
            {
                onSuccess: () => {
                    handleClose();
                },
            }
        );
    };

    return (
        <Dialog open={isInvitationOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("user.reinvite.dialog.title")}</DialogTitle>
                    <DialogDescription>
                        {t("user.reinvite.dialog.message")}
                        <ul className="list-disc list-inside p-2 text-primary">
                            <li
                                dangerouslySetInnerHTML={{
                                    __html: t("user.reinvite.dialog.description", { email: currentUser?.email })
                                }}
                            />
                        </ul>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        {t("user.reinvite.dialog.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        variant="default"
                        onClick={confirmInvite}
                        isLoading={isPending}
                        loadingText={t("user.reinvite.dialog.actions.send.loading")}
                    >
                        {t("user.reinvite.dialog.actions.send.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
