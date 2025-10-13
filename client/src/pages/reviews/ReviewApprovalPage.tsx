import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetReview } from '@/hooks/queries/useReviewMutation';
import WithTitle from '@/templates/layout/WithTitle';
import ApproveDocumentDialog from '@/templates/reviews/dialogs/ApproveDocumentDialog';
import RejectDocumentDialog from '@/templates/reviews/dialogs/RejectDocumentDialog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const ReviewApprovalPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { reviewId } = useParams();
    const [openApproval, setOpenApproval] = useState(false);
    const [openReject, setOpenReject] = useState(false);

    const { data, isLoading, isError } = useGetReview(reviewId);

    if (isError) return (
        <div>
            <h1>404</h1>
        </div>
    );

    // Is already completed
    if (data?.isCompleted) return (
        <div>
            <h4 className="text-center">
                This review has already been approved
            </h4>
        </div>
    );

    function handleApproveSuccess() {
        navigate('/reviews', { replace: true });
    }

    function handleRejectSuccess() {
        navigate('/reviews', { replace: true })
    }

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
                    <fieldset
                        className="w-full flex items-center justify-center gap-4 py-4 bg-gray-200"
                        disabled={isLoading}
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