import BackButton from '@/components/BackButton';
import HtmlContent from '@/components/HTMLContent';
import CircleLoading from '@/components/loading/CircleLoading';
import RTERichText from '@/components/RTERichText';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserAvatar } from '@/components/user-avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useGetReview, useUpdateComment } from '@/hooks/queries/useReviewMutation';
import { formatDate } from '@/lib/date';
import DocumentPreview from '@/templates/documents/tabs/DocumentPreview';
import WithTitle from '@/templates/layout/WithTitle';
import ApproveDocumentDialog from '@/templates/reviews/dialogs/ApproveDocumentDialog';
import RejectDocumentDialog from '@/templates/reviews/dialogs/RejectDocumentDialog';
import { Pen, Save } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const ReviewApprovalPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { reviewId } = useParams();
    const [openApproval, setOpenApproval] = useState(false);
    const [openReject, setOpenReject] = useState(false);

    const { data, isLoading, isError } = useGetReview(reviewId);


    // Check if review use for the active user
    if (data && (data.reviewer.id !== user?.id)) {
        return <Navigate to={'/reviews'} replace />
    }

    function handleApproveSuccess() {
        navigate('/reviews', { replace: true });
    }

    function handleRejectSuccess() {
        navigate('/reviews', { replace: true })
    }

    if (isLoading) return (
        <CircleLoading />
    )

    if (isError) return (
        <div>
            <h1>404</h1>
        </div>
    );

    if (!data) return (
        <div>
            <h1>Data is null.</h1>
        </div>
    );

    return (
        <WithTitle title={t('reviewApproval.title')}>
            <div className="mb-2 flex items-center gap-5 justify-between">
                <div className="mb-2 flex items-center gap-2">
                    <BackButton />
                    <div>
                        <h1 className="page-title">{t("reviewApproval.title")}</h1>
                        <p className="page-description">{data?.document?.title}</p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <Badge>{data.documentVersion?.version}</Badge>
                </div>
            </div>
            <Card className="flex-grow flex flex-col p-0">
                <CardContent className='flex flex-col grow p-0'>
                    {data.documentVersion && (
                        <DocumentPreview
                            version={data.documentVersion}
                            mode='view'
                            className='grow'
                        />
                    )}
                    <div
                        className="w-full p-4 space-y-3 bg-gray-200 flex flex-col items-center justify-center"
                    >
                        {data.decision && (
                            <div className='w-full bg-white max-w-3xl p-4 border-2 border-gray-300 rounded-lg text-sm'>
                                {(data.decision === "REJECT" && data.comment) && (
                                    <>
                                        <div className='mb-4'>{t(`reviewApproval.dialogs.reject.done`)}</div>
                                        <div className="w-full p-2 bg-gray-50 border-gray-100 border">
                                            {data.reviewer && (
                                                <div className='flex items-start justify-between gap-2 py-3'>
                                                    <div className="flex items-center gap-2">
                                                        <UserAvatar className="size-8" id={data.reviewer.id} name={data.reviewer.name} />
                                                        <div className='flex flex-col'>
                                                            <span>{data.reviewer.name}</span>
                                                            <span className='text-muted-foreground text-xs'>{data.reviewer.email}</span>
                                                        </div>
                                                    </div>
                                                    {data.reviewDate && (<span className='opacity-70 text-sm'>{formatDate(data.reviewDate)}</span>)}
                                                </div>
                                            )}
                                            <EditableComment comment={data.comment} reviewId={data.id} />
                                        </div>
                                    </>
                                )}
                                {(data.decision === "APPROVE") && (
                                    <p>{t(`reviewApproval.dialogs.approve.done`)}</p>
                                )}
                            </div>
                        )}
                        <fieldset
                            className="w-full flex items-center justify-center gap-4 py-4 bg-gray-200"
                            disabled={isLoading || !!data.decision}
                        >
                            {/* Approve */}
                            <Button
                                type='button'
                                onClick={() => setOpenApproval(true)}
                            >
                                {t('reviewApproval.actions.approve.label')}
                            </Button>

                            {/* Reject */}
                            <Button
                                type='button'
                                variant='destructive'
                                onClick={() => setOpenReject(true)}
                            >
                                {t('reviewApproval.actions.reject.label')}
                            </Button>
                        </fieldset>
                    </div>
                </CardContent>
            </Card>

            {data && (
                <>
                    <ApproveDocumentDialog
                        item={data}
                        open={openApproval}
                        onOpenChange={setOpenApproval}
                        onSuccess={handleApproveSuccess}
                    />

                    <RejectDocumentDialog
                        item={data}
                        open={openReject}
                        onOpenChange={setOpenReject}
                        onSuccess={handleRejectSuccess}
                    />
                </>
            )}
        </WithTitle>
    )
}

interface EditableCommentProps {
    comment: string;
    reviewId: string;
}

export const EditableComment = ({ comment, reviewId, }: EditableCommentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [commentValue, setCommentValue] = useState(comment);

    const { mutate: updateComment, isPending } = useUpdateComment(reviewId);

    const handleSave = () => {
        updateComment({
            comment: commentValue
        }, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    }

    return (
        <div className="px-2 relative">
            <div className="absolute top-0 right-2 z-10">
                {isEditing ? (
                    <Button type="submit" variant="ghost" className='absolute top-1 right-2' onClick={handleSave} disabled={isPending}>
                        <Save size={16} className='mr-2' />
                        Save
                    </Button>
                ) : (
                    <Button type="button" variant="ghost" className='absolute top-1 right-2' onClick={() => setIsEditing(true)}>
                        <Pen size={16} className='mr-2' />
                        Edit
                    </Button>
                )}
            </div>
            {isEditing ? (
                <RTERichText value={commentValue} onChange={setCommentValue} />
            ) : (
                <HtmlContent html={commentValue} />
            )}
        </div>
    )
}

export default ReviewApprovalPage;