import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileText, Calendar, AlertCircle, CheckCircle2, FilePen, CheckCheck } from 'lucide-react';
import { DocumentReview } from '@/types';
import HtmlContent from '@/components/HTMLContent';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@/components/ui/loading-button';
import { UserHoverCard } from '../users/hovercard/UserHoverCard';
import { useNavigate } from 'react-router-dom';
import { formatDate, getDateFnsLocale } from '@/lib/date';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import FinalDocumentApprovalDialog from './dialogs/FinalDocumentApprovalDialog';

interface PendingReviewItemProps {
    review: DocumentReview;
    isSelected?: boolean;
    onSelect?: (review: DocumentReview | null) => void;
}

export function PendingReviewItem({ review, isSelected = false, onSelect }: PendingReviewItemProps) {
    const { t } = useTranslation();


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handleSelect = useCallback(() => {
        onSelect?.(isSelected ? null : review)
    }, [isSelected, onSelect, review])

    return (
        <Card key={review.id}
            onClick={handleSelect}
            className={cn(
                "hover:shadow-md transition-shadow hover:cursor-pointer",
                isSelected ? "border border-indigo-600 from-indigo-400/10 to-indigo-400/10" :
                    "hover:from-indigo-300/10 hover:to-indigo-300/10 hover:border-indigo-900/20"
            )}>
            <CardHeader className="p-4">
                <div className="flex gap-5 items-start">
                    <Checkbox color='blue' checked={isSelected} onCheckedChange={handleSelect} />
                    <div className='w-full'>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base truncate">{review.document?.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 text-xs mt-1">
                                        <span className="font-medium">{review.document?.isoClause.code}</span>
                                        <Separator orientation="vertical" className="h-3" />
                                        <span className="truncate">{review.document?.isoClause.name}</span>
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">

                                <span className="text-xs text-muted-foreground text-right">
                                    {formatDistanceToNow(review.reviewDate, { locale: getDateFnsLocale(), addSuffix: true, includeSeconds: true })}
                                </span>
                                <div className="flex items-center justify-end gap-2 flex-shrink-0">
                                    <Badge variant={review.decision === 'REJECT' ? 'destructive' : 'default'} className="text-xs">
                                        {review.decision === 'REJECT' ? (
                                            <AlertCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                        )}
                                        {t(`common.reviews.decisions.${review.decision?.toLowerCase()}`)}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            {review.reviewer && (
                                <UserHoverCard user={review.reviewer} />
                            )}
                            {review.dueDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Due: {formatDate(review.dueDate)}</span>
                                </div>
                            )}
                            <Badge variant="outline" className="text-xs">{review.document?.status}</Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}


interface PendingReviewItemPreviewProps {
    review: DocumentReview;
    onSuccess?: (id?: string) => void;
}

export const PrendingItemPreview = ({ review, onSuccess }: PendingReviewItemPreviewProps) => {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const [approvalOpen, setApprovalOpen] = useState(false);

    function handleOpenConfirmDialog() {
        setApprovalOpen(true);
    }

    function handleUpdateDocument() {
        navigate(`/patch-document-version/${review.id}`);
    }

    return (
        <>
            <CardContent className="p-4 space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {review.reviewDate && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">{t("pendingReviews.preview.reviewDate")}</p>
                            <p className="text-sm">{formatDate(review.reviewDate)}</p>
                        </div>
                    )}
                    {review.createdAt && (
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">{t("pendingReviews.preview.createdAt")}</p>
                            <p className="text-sm">{formatDate(review.createdAt)}</p>
                        </div>
                    )}
                </div>

                {review.document?.versions && review.document?.versions.length > 0 && (
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{t("pendingReviews.preview.documentVersion")}</p>
                        <div className="flex items-center gap-2 text-sm">
                            <Badge variant="secondary" className="text-xs">v{review.document?.versions[0].version}</Badge>
                            <span className="text-xs text-muted-foreground truncate">{review.document?.versions[0]?.fileUrl}</span>
                        </div>
                    </div>
                )}

                {review.comment && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-destructive" />
                            {t("pendingReviews.preview.comments")}
                        </p>
                        <div className={cn(
                            "bg-destructive/5 border border-destructive/20 rounded-lg p-3",
                            review.decision === "APPROVE" && "bg-theme/5 border-theme/20",
                        )}>
                            <HtmlContent
                                html={review.comment}
                            />
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="bg-muted/30 py-3 flex justify-end items-center gap-2">
                {review.decision === 'REJECT' && (
                    <Button
                        onClick={handleUpdateDocument}
                        size="sm"
                        variant="primary"
                    >
                        <FilePen className="h-4 w-4 mr-1" />
                        {t("pendingReviews.preview.actions.update.label")}
                    </Button>
                )}
                {review.decision === 'APPROVE' && !review.isCompleted && (
                    <LoadingButton
                        onClick={handleOpenConfirmDialog}
                        size="sm"
                    >
                        <CheckCheck className="h-4 w-4 mr-1" />
                        {t("pendingReviews.preview.actions.markAsComplete.label")}
                    </LoadingButton>
                )}
                {review.isCompleted && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                    </Badge>
                )}
            </CardFooter>

            <FinalDocumentApprovalDialog
                item={review}
                onOpenChange={setApprovalOpen}
                open={approvalOpen}
                onSuccess={onSuccess}
            />
        </>
    )
}