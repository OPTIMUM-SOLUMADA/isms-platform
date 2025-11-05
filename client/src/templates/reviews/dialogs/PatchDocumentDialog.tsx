
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
import { usePatchDocumentReview } from "@/hooks/queries/useReviewMutation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useGrantPermissionsToDocumentVersion } from "@/hooks/queries/useGoogleDriveMutation";
import { useState } from "react";
import RTERichText from "@/components/RTERichText";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: DocumentReview;
    nextVersion: string;
    onSuccess?: () => void;
}

const PatchDocumentDialog = ({
    open = false,
    onOpenChange,
    item,
    onSuccess,
    nextVersion
}: Props) => {
    const { t } = useTranslation();
    const { setCurrentDocument } = useDocumentUI();
    const { toast } = useToast();
    const { user } = useAuth();
    const [comment, setComment] = useState('');

    const { document } = item;

    const { mutate: patchDocument, isPending } = usePatchDocumentReview(item.id);
    const { mutate: grantPermission } = useGrantPermissionsToDocumentVersion();

    function handleOpenChange(value: boolean) {
        if (!value) setCurrentDocument(null);
        onOpenChange(value);
    }

    function handleApprove() {
        patchDocument({
            reviewId: "APPROVE",
            patchedVersion: nextVersion,
            userId: user?.id || "",
            comment,
        }, {
            onSuccess: () => {
                toast({
                    title: t("patchDocumentReview.toast.success.title"),
                    description: t("patchDocumentReview.toast.success.description"),
                    variant: "success"
                });
                handleOpenChange(false);
                onSuccess?.();

                grantPermission({
                    documentId: item.documentId
                }, {
                    onError: () => {
                        alert('An error occurred while granting permissions.');
                    }
                });
            },
            onError: () => {
                toast({
                    title: t("patchDocumentReview.toast.error.title"),
                    description: t("patchDocumentReview.toast.error.description"),
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
                            {t("patchDocumentReview.dialogs.confirm.title", { entity: document?.title })}
                        </DialogTitle>
                    </div>
                    <DialogDescription
                        dangerouslySetInnerHTML={{
                            __html: t("patchDocumentReview.dialogs.confirm.description", { entity: document?.title })
                        }}
                    />
                    <p className="mt-3 text-primary">
                        {t("patchDocumentReview.dialogs.confirm.message")}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-theme-2 underline underline-offset-4 text-sm">{t("patchDocumentReview.dialogs.confirm.nextVersion")}</span>
                        <Badge variant="outline">{nextVersion}</Badge>
                    </div>

                    <div className="mt-4">
                        <RTERichText
                            placeholder={t(
                                "reviewApproval.dialogs.approve.form.comments.placeholder"
                            )}
                            onChange={setComment}
                        />
                    </div>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => handleOpenChange(false)} disabled={isPending}>
                        {t("patchDocumentReview.dialogs.confirm.actions.cancel.label")}
                    </Button>
                    <LoadingButton
                        onClick={handleApprove}
                        isLoading={isPending}
                        loadingText={t("patchDocumentReview.dialogs.confirm.actions.confirm.loading")}
                    >
                        {t("patchDocumentReview.dialogs.confirm.actions.confirm.label")}
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PatchDocumentDialog;