import LoadingSplash from '@/components/loading';
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { LoadingButton } from '@/components/ui/loading-button';
import { useGetReview } from '@/hooks/queries/useReviewMutation';
import { useParams } from 'react-router-dom';
import Iframe from 'react-iframe';
import { Layers } from 'lucide-react';

const PatchDocumentVersionPage = () => {

    const { reviewId } = useParams();

    const { data, isLoading } = useGetReview(reviewId);

    if (isLoading) return <LoadingSplash />

    if (!data) {
        return <div>404</div>
    }

    console.log(data);

    return (
        <Card className='flex flex-grow flex-col p-0 space-y-0'>
            <CardContent className='flex flex-col flex-grow px-0'>
                <Iframe
                    url="https://docs.google.com/document/d/1i12G55H6V0mcVWHCzlRfC3CKpyDt1sRI/edit?usp=sharing&ouid=104020429096532563212&rtpof=true&sd=true"
                    className="border-none bg-white overflow-hidden w-full grow min-h-[600px]"
                />
            </CardContent>
            <CardFooter className='flex justify-end items-center gap-5 py-2 border-t bg-gray-200 my-0'>
                {/* Versions */}

                {/* Button */}
                <LoadingButton type="button">
                    <Layers className="mr-2 h-4 w-4" />
                    Update Version
                </LoadingButton>
            </CardFooter>
        </Card>
    )
}

export default PatchDocumentVersionPage;