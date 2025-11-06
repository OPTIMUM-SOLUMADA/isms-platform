
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, CircleCheck, CircleX, Hourglass, MessageCircle, User } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
    // Review count that is not submitted yet
    const pendingReviewsCount = otherReviews.filter(i => !i.decision && !i.reviewDate).length;

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
                    {allApproved && (
                        <DialogDescription
                            dangerouslySetInnerHTML={{
                                __html: t("reviewApproval.dialogs.approve.dialogs.finalApproval.description", { entity: document?.title })
                            }}
                        />
                    )}
                    <div className="w-full space-y-3 flex flex-col max-h-80">
                        {allApproved ? (
                            <p className="mt-3 text-primary">
                                {t("reviewApproval.dialogs.approve.dialogs.finalApproval.message")}
                            </p>
                        ) : (
                            <>
                                <div className="text-sm text-amber-600">
                                    <p >
                                        Avant d'approuver le document, veuillez attendre que tous les autres réviseurs aient donné leur avis.
                                        Il y a encore {pendingReviewsCount} avis en attente de validation.
                                    </p>
                                </div>
                                <ScrollArea className="scroll-p-6">
                                    {filteredOtherReviews.map((review, index) => (
                                        <Item review={review} key={index} />
                                    ))}
                                </ScrollArea>
                            </>
                        )}
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

const Item = ({ review }: { review: DocumentReview }) => {
    return (
        <div
            className="p-4 border rounded-lg bg-white shadow-sm text-xs flex items-center gap-4"
        >
            <div className="shrink-0">
                {review.decision === "APPROVE" ? (
                    <CircleCheck className="h-6 w-6 text-theme" />
                ) : review.decision === "REJECT" ? (
                    <CircleX className="h-6 w-6 text-theme-danger" />
                ) : (
                    <Hourglass className="h-6 w-6 text-muted-foreground" />
                )}
            </div>
            <div className="space-y-1 w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 ">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{review.reviewer?.name}</span>
                    </div>
                    {review.decision && (
                        <Badge className={cn(reviewStatusColors[review.decision], "text-xs")}>
                            {review.decision}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(review.createdAt), "dd/MM/yyyy")}</span>
                </div>
                {review.comment && (
                    <div className="flex items-center gap-2 mt-2 text-gray-500">
                        <MessageCircle className="h-4 w-4" />
                        <HtmlContent html={review.comment} renderNoContent={false} className="line-clamp-2 text-gray-400" />
                    </div>
                )}
            </div>
        </div>
    )
}

export default FinalDocumentApprovalDialog;