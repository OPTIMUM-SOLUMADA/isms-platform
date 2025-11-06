import CircleLoading from '@/components/loading/CircleLoading';
import { useGetPublishedDocuments } from '@/hooks/queries/useDocumentMutations'
import WithTitle from '@/templates/layout/WithTitle'

const PublishedDocumentPage = () => {

    const { data: documents, isLoading, isError, error } = useGetPublishedDocuments();

    if (isLoading) return <CircleLoading />

    if (isError) return <div>{error.message}</div>;

    return (
        <WithTitle title='Published documents'>
            <div className="grow">
                {/* List of documnents */}
                {documents.map((doc) => (
                    <div key={doc.id} className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold">{doc.title}</h2>
                        <p className="text-gray-600">{doc.description}</p>
                    </div>
                ))}
            </div>
        </WithTitle>
    )
}

export default PublishedDocumentPage