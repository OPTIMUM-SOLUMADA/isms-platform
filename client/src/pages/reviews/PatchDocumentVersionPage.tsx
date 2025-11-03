import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { LoadingButton } from '@/components/ui/loading-button';
import { useGetReview } from '@/hooks/queries/useReviewMutation';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Eye, FileCheck2, Layers, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useEffect, useMemo, useState } from 'react';
import { bumpVersion } from '@/lib/version';
import PatchDocumentDialog from '@/templates/reviews/dialogs/PatchDocumentDialog';
import WithTitle from '@/templates/layout/WithTitle';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import RequestDetailsSheet from '@/templates/reviews/RequestDetailsSheet';
import { NumberInput } from '@/components/NumberInput';
import BackButton from '@/components/BackButton';
import DocumentPreview from '@/templates/documents/tabs/DocumentPreview';
import { useCreateDraftVersion } from '@/hooks/queries/useDocumentMutations';
import CircleLoading from '@/components/loading/CircleLoading';
import NotFound from '@/components/NotFound';
import { getCurrentVersion } from '@/lib/review';

const PatchDocumentVersionPage = () => {
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [nextVersion, setNextVersion] = useState<string>('0.0');
    const { reviewId } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Get the review
    const {
        data: review,
        isLoading
    } = useGetReview(reviewId);

    // Create draft version of the document to be patched
    const {
        data: draftVersion,
        isLoading: isCreatingDraft,
        refetch: reCreateDraftVersion,
        isError: isCreatingDraftError,
    } = useCreateDraftVersion(review?.id);

    // CURRENT VERSION
    const currentVersion = useMemo(() => getCurrentVersion(review) || '', [review]);

    // NEXT VERSION
    useEffect(() => {
        if (!currentVersion) return;
        const nextVersion = bumpVersion(currentVersion, 'patch');
        setNextVersion(nextVersion);
    }, [currentVersion]);

    // FETCHING DATA
    if (isLoading) return (
        <CircleLoading text={t('patchDocumentReview.loading.fetching')} />
    );

    // CREATING DRAFT
    if (isCreatingDraft) return (
        <CircleLoading text={t('patchDocumentReview.loading.creatingDraft')} />
    );

    // REVIEW NOT FOUND
    if (!review) return (
        <NotFound />
    );

    // REVIEW IS COMPLETED
    if (review.isCompleted) return (
        <div className='grow flex flex-col items-center justify-center '>
            <div className="space-y-6">
                <FileCheck2 className="mx-auto h-12 w-12 text-primary/40" />
                <p className='text-center text-2xl font-normal w-full max-w-md mx-auto opacity-80'>
                    {t('patchDocumentReview.completed.message')}
                </p>

                <div className="flex items-center justify-center gap-2">
                    <Button type="button" variant="outline" size='sm' onClick={() => navigate("/pending-reviews")}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('patchDocumentReview.actions.pendingReviews.label')}
                    </Button>
                    <Button type="button" variant="outline" size='sm' onClick={() => navigate("/reviews")}>
                        {t('patchDocumentReview.actions.reviews.label')}
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Button>
                    <RequestDetailsSheet item={review} >
                        <Button type="button" variant="outline" size='sm'>
                            <Eye className="mr-2 h-4 w-4" />
                            {t('patchDocumentReview.actions.viewRequest.label')}
                        </Button>
                    </RequestDetailsSheet>
                </div>
            </div>
        </div>
    );

    return (
        <WithTitle title={t("patchDocumentReview.title")}>
            <fieldset className='flex flex-col grow' disabled={isCreatingDraftError}>
                <Card className='flex flex-grow flex-col p-0 space-y-0'>
                    <CardContent className='flex flex-col flex-grow px-0'>
                        {draftVersion ? (
                            <DocumentPreview version={draftVersion} mode="edit" className='grow' />
                        ) : (
                            <div className="w-full max-w-md text-center m-auto spcace-y-4">
                                <p className='text-black text-sm'>
                                    Sorry, we are having some issues creating the draft version of the document. Please try again later.
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size='sm'
                                    aria-label='Refresh'
                                    onClick={() => reCreateDraftVersion()}
                                >
                                    <RefreshCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className='flex justify-between items-center gap-5 py-2 border-t bg-gray-200 my-0'>

                        <div className="flex items-center gap-2">
                            <BackButton className='aspect-auto' size='sm' />
                            <RequestDetailsSheet item={review} >
                                <Button type="button" variant="outline" size='sm'>
                                    <Eye className="mr-2 h-4 w-4" />
                                    {t('patchDocumentReview.actions.viewRequest.label')}
                                </Button>
                            </RequestDetailsSheet>
                        </div>

                        {/* Versions */}
                        <div className="flex items-center gap-2">
                            <Input
                                type="text"
                                name="currentVersion"
                                className='text-center max-w-[80px]'
                                disabled
                                value={currentVersion}
                            />
                            <ArrowRight className="h-4 w-4" />
                            <NumberInput
                                inputMode='decimal'
                                name="nextVersion"
                                className='text-center max-w-[80px]'
                                stepper={0.1}
                                decimalScale={1}
                                fixedDecimalScale
                                allowNegative={false}
                                decimalSeparator='.'
                                value={Number(nextVersion)}
                                onValueChange={e => setNextVersion(e.toString())}
                            />
                        </div>

                        {/* Button */}
                        <LoadingButton type="button"
                            onClick={() => setIsConfirmOpen(true)}
                            size='sm'
                        >
                            <Layers className="mr-2 h-4 w-4" />
                            {t("patchDocumentReview.actions.patch.label")}
                        </LoadingButton>
                    </CardFooter>
                </Card>
            </fieldset>

            {/* Dialog de confirmation */}
            <PatchDocumentDialog
                item={review}
                nextVersion={nextVersion}
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                onSuccess={() => setIsConfirmOpen(false)}
            />
        </WithTitle>
    );
}


export default PatchDocumentVersionPage;