import WithTitle from '@/templates/layout/WithTitle'
import { useMemo } from 'react';
import { useParams } from 'react-router-dom'

type Params = {
    documentId: string;
    type: 'document' | 'spreadsheets';
}

const DocumentEditorPage = () => {
    const { documentId, type } = useParams<Params>();

    const url = useMemo(() => {
        return `https://docs.google.com/${type}/d/${documentId}/edit`;
    }, [type, documentId]);

    return (
        <WithTitle title="Document Editor">
            <div className="flex-grow">
                <iframe
                    // src="https://docs.google.com/spreadsheets/d/10hBayP1L6PLz469KAK6cbtzRWXEoGbzm/edit?usp=drive_web&ouid=104020429096532563212&rtpof=true"
                    src={url}
                    className="border-none shadow-lg bg-white overflow-hidden w-full h-full"
                />
            </div>
        </WithTitle>
    )
}

export default DocumentEditorPage;