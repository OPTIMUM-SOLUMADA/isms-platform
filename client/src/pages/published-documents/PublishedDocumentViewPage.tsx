import { useGetDocument } from '@/hooks/queries/useDocumentMutations'
import { useParams } from 'react-router-dom';
import ItemNotFound from '../ItemNotFound';
import CircleLoading from '@/components/loading/CircleLoading';
import WithTitle from '@/templates/layout/WithTitle';
import DocumentPreview from '@/templates/documents/tabs/DocumentPreview';
import BackButton from '@/components/BackButton';
import DownloadDocument from '@/templates/documents/actions/DownloadDocument';

const PublishedDocumentViewPage = () => {

    const { documentId } = useParams();
    const {
        data: document,
        isLoading,
        isError
    } = useGetDocument(documentId);

    const currentVersion = document?.versions?.find(v => v.isCurrent);

    if (isLoading) return <CircleLoading />;
    if (isError) return <div>Error</div>;

    if (!document) return <ItemNotFound />;
    return (
        <WithTitle title={document.title}>
            <div className="mb-2 flex items-center gap-5 justify-between">
                <div className="mb-2 flex items-center gap-2">
                    <BackButton />
                    <div>
                        <h1 className="page-title">{document.title}</h1>
                        <p className="page-description">{document?.description}</p>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <DownloadDocument document={document} />
                </div>
            </div>
            {currentVersion && (
                <DocumentPreview className='grow' version={currentVersion} mode="view" />
            )}
        </WithTitle>
    )
}

export default PublishedDocumentViewPage