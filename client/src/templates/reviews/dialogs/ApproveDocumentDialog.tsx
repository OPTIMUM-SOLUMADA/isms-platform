
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
import type { DocumentReview } from "@/types";
import { useDocumentUI } from "@/stores/document/useDocumentUi";
import { useSubmitReview } from "@/hooks/queries/useReviewMutation";
import { useToast } from "@/hooks/use-toast";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: DocumentReview;
    onSuccess?: () => void;
}

const ApproveDocumentDialog = ({
    open = false,
    onOpenChange,
    item,
    onSuccess,
}: Props) => {
    const { t } = useTranslation();
    const { setCurrentDocument } = useDocumentUI();
    const { toast } = useToast();

    const { document } = item;

    const { mutate: submitReview, isPending } = useSubmitReview(item.id);

    function handleOpenChange(value: boolean) {
        if (!value) setCurrentDocument(null);
        onOpenChange(value);
    }

    function handleApprove() {
        submitReview({
            decision: "APPROVE",
            comment: "",
        }, {
            onSuccess: () => {
                toast({
                    title: t("reviewApproval.dialogs.approve.toast.success.title"),
                    description: t("reviewApproval.dialogs.approve.toast.success.description"),
                    variant: "success"
                });
                handleOpenChange(false);
                onSuccess?.();
            },
            onError: () => {
                toast({
                    title: t("reviewApproval.dialogs.approve.toast.error.title"),
                    description: t("reviewApproval.dialogs.approve.toast.error.description"),
                    variant: "destructive"
                });
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-6 h-6 text-theme-danger" />
                        <DialogTitle>
                            {t("reviewApproval.dialogs.approve.title", { entity: document.title })}
                        </DialogTitle>
                    </div>
                    <DialogDescription
                        dangerouslySetInnerHTML={{
                            __html: t("reviewApproval.dialogs.approve.description", { entity: document.title })
                        }}
                    />
                    <p className="mt-3 text-primary">
                        {t("reviewApproval.dialogs.approve.message")}
                    </p>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                        {t("reviewApproval.dialogs.approve.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        onClick={handleApprove}
                        isLoading={isPending}
                        loadingText={t("reviewApproval.dialogs.approve.actions.confirm.loading")}
                    >
                        {t("reviewApproval.dialogs.approve.actions.confirm.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ApproveDocumentDialog;