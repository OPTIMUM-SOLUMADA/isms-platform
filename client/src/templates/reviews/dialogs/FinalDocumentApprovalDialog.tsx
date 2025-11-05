
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@/components/ui/loading-button";
import type { DocumentReview } from "@/types";
import { useDocumentUI } from "@/stores/document/useDocumentUi";
import { useMarkAsCompleted, useOtherUsersReviews } from "@/hooks/queries/useReviewMutation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { reviewStatusColors } from "@/constants/color";
import { format } from "date-fns";
import { useMemo } from "react";
import HtmlContent from "@/components/HTMLContent";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: DocumentReview;
    onSuccess?: () => void;
}

const FinalDocumentApprovalDialog = ({
    open = false,
    onOpenChange,
    item,
    onSuccess,
}: Props) => {
    const { t } = useTranslation();
    const { setCurrentDocument } = useDocumentUI();
    const { toast } = useToast();
    const { user } = useAuth();

    const { document } = item;

    const {
        mutate: markAsCompleted,
        isPending: isMarkingAsCompleted
    } = useMarkAsCompleted();


    const {
        data: otherReviews = [],
    } = useOtherUsersReviews({
        documentId: document.id,
        versionId: item.documentVersionId,
    });

    // check if all other reviews are approved
    const allApproved = otherReviews.every(i => i.decision === "APPROVE");


    const filteredOtherReviews = useMemo(
        () => otherReviews.filter(i => i.id !== item.id)
        , [otherReviews, item]);

    function handleOpenChange(value: boolean) {
        if (!value) setCurrentDocument(null);
        onOpenChange(value);
    }

    function handleApprove() {
        markAsCompleted({
            id: item.id,
            userId: user?.id,
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
                            {t("reviewApproval.dialogs.approve.dialogs.finalApproval.title", { entity: document?.title })}
                        </DialogTitle>
                    </div>
                    <DialogDescription
                        dangerouslySetInnerHTML={{
                            __html: t("reviewApproval.dialogs.approve.dialogs.finalApproval.description", { entity: document?.title })
                        }}
                    />
                    <p className="mt-3 text-primary">
                        {t("reviewApproval.dialogs.approve.dialogs.finalApproval.message")}
                    </p>
                    <div className="w-full space-y-3">
                        <div className="div">
                            <h2>Autre reviews de l&apos;utilisateur</h2>
                        </div>
                        {filteredOtherReviews.map((review) => (
                            <div
                                key={review.id}
                                className="p-4 border rounded-lg bg-white shadow-sm text-xs"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 ">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">{review.reviewer?.name}</span>
                                    </div>
                                    {review.decision && (
                                        <Badge className={reviewStatusColors[review.decision]}>
                                            {review.decision}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>{format(new Date(review.createdAt), "dd/MM/yyyy")}</span>
                                </div>
                                <div className="mt-2 text-gray-700">
                                    <HtmlContent html={review.comment} />
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogHeader>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => handleOpenChange(false)}>
                        {t("reviewApproval.dialogs.approve.dialogs.finalApproval.actions.cancel.label")}
                    </Button>
                    {allApproved && (
                        <LoadingButton
                            onClick={handleApprove}
                            isLoading={isMarkingAsCompleted}
                            loadingText={t("reviewApproval.dialogs.approve.dialogs.finalApproval.actions.confirm.loading")}
                        >
                            {t("reviewApproval.dialogs.approve.dialogs.finalApproval.actions.confirm.label")}
                        </LoadingButton>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default FinalDocumentApprovalDialog;