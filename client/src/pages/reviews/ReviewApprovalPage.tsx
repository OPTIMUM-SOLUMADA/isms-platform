import BackButton from '@/components/BackButton';
import HtmlContent from '@/components/HTMLContent';
import CircleLoading from '@/components/loading/CircleLoading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useGetReview } from '@/hooks/queries/useReviewMutation';
import WithTitle from '@/templates/layout/WithTitle';
import ApproveDocumentDialog from '@/templates/reviews/dialogs/ApproveDocumentDialog';
import RejectDocumentDialog from '@/templates/reviews/dialogs/RejectDocumentDialog';
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
    if (data?.reviewer?.id === user?.id) {
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
            <div className="mb-2 flex items-center gap-2">
                <BackButton />
                <div>
                    <h1 className="page-title">{t("reviewApproval.title")}</h1>
                    <p className="page-description">{data?.document?.title}</p>
                </div>
            </div>
            <Card className="flex-grow flex flex-col p-0">
                <CardContent className='flex flex-col grow p-0'>
                    <iframe
                        src="https://docs.google.com/document/d/1i12G55H6V0mcVWHCzlRfC3CKpyDt1sRI/preview"
                        className="border-none shadow-lg bg-white overflow-hidden w-full flex-grow min-h-[600px]"
                    />
                    <div
                        className="w-full p-4 space-y-3 bg-gray-200 flex flex-col items-center justify-center"
                    >
                        {data.decision && (
                            <div className='w-full bg-white max-w-3xl p-4 border rounded-lg text-sm'>
                                {(data.decision === "REJECT" && data.comment) && (
                                    <>
                                        <p className='mb-2'>{t(`reviewApproval.dialogs.reject.done`)}</p>
                                        <div className="px-2">
                                            <HtmlContent html={data.comment} />
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

export default ReviewApprovalPage;