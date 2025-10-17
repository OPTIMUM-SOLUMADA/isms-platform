import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FileText, Calendar, AlertCircle, CheckCircle2, ChevronDown, FilePen, CheckCheck } from 'lucide-react';
import { DocumentReview } from '@/types';
import { useState } from 'react';
import HtmlContent from '@/components/HTMLContent';
import { useTranslation } from 'react-i18next';
import { useMarkAsCompleted } from '@/hooks/queries/useReviewMutation';
import { LoadingButton } from '@/components/ui/loading-button';
import { UserHoverCard } from '../users/hovercard/UserHoverCard';
import { useNavigate } from 'react-router-dom';

interface PendingReviewItemProps {
    review: DocumentReview;
}

export function PendingReviewItem({ review }: PendingReviewItemProps) {
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
    const { t } = useTranslation();
    const navigate = useNavigate();

    const {
        mutate: markAsCompleted,
        isPending: isMarkingAsCompleted
    } = useMarkAsCompleted();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const toggleExpand = (reviewId: string) => {
        setExpandedReviews((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId);
            } else {
                newSet.add(reviewId);
            }
            return newSet;
        });
    };

    function handleMarkAsCompleted() {
        markAsCompleted({ id: review.id }, {
            onSuccess: () => {

            },
        });
    }


    function handleUpdateDocument() {
        navigate(`/patch-document-version/${review.id}`);
    }

    const isExpanded = expandedReviews.has(review.id);
    return (
        <Card key={review.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <Collapsible open={isExpanded} onOpenChange={() => toggleExpand(review.id)}>
                <CardHeader className="py-4">
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
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant={review.decision === 'REJECT' ? 'destructive' : 'default'} className="text-xs">
                                {review.decision === 'REJECT' ? (
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                ) : (
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                )}
                                {t(`common.reviews.decisions.${review.decision?.toLowerCase()}`)}
                            </Badge>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </Button>
                            </CollapsibleTrigger>
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
                </CardHeader>

                <CollapsibleContent>
                    <CardContent className="pt-0 pb-4 space-y-4">
                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {review.reviewDate && (
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Review Date</p>
                                    <p className="text-sm">{formatDate(review.reviewDate)}</p>
                                </div>
                            )}
                            {review.createdAt && (
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">Created</p>
                                    <p className="text-sm">{formatDate(review.createdAt)}</p>
                                </div>
                            )}
                        </div>

                        {review.document?.versions && review.document?.versions.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Document Version</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Badge variant="secondary" className="text-xs">v{review.document?.versions[0].version}</Badge>
                                    <span className="text-xs text-muted-foreground truncate">{review.document?.versions[0]?.fileUrl}</span>
                                </div>
                            </div>
                        )}

                        {review.comment && review.decision === 'REJECT' && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                    Review Comments
                                </p>
                                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3">
                                    <HtmlContent
                                        className="prose max-w-none text-xs [&>p]:my-2 [&>ol]:my-2 [&>ul]:my-2"
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
                                Update Document
                            </Button>
                        )}
                        {review.decision === 'APPROVE' && !review.isCompleted && (
                            <LoadingButton
                                onClick={handleMarkAsCompleted}
                                size="sm"
                                isLoading={isMarkingAsCompleted}

                            >
                                <CheckCheck className="h-4 w-4 mr-1" />
                                Mark as Completed
                            </LoadingButton>
                        )}
                        {review.isCompleted && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Completed
                            </Badge>
                        )}
                    </CardFooter>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
