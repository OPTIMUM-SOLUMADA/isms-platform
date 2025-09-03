import { LoadingButton } from '@/components/ui/loading-button';
import { useDocument } from '@/contexts/DocumentContext';
import { usePermissions } from '@/hooks/use-permissions';
import { Download } from 'lucide-react';
import { PropsWithChildren, useState } from 'react'
import { useTranslation } from 'react-i18next';

interface DownloadDocumentProps extends PropsWithChildren {
    className?: string;
    documentId: string
    loadingText?: string
}
const DownloadDocument = ({
    children,
    documentId,
    loadingText = ""
}: DownloadDocumentProps) => {
    const { download } = useDocument();
    const { hasActionPermission } = usePermissions();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    if (!hasActionPermission('document.download')) return null;

    const handleClick = async () => {
        try {
            setLoading(true);
            await download({ id: documentId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoadingButton
            isLoading={loading}
            loadingText={loadingText}
            variant="outline"
            onClick={handleClick}
            title={t("document.actions.download.label")}
        >
            {children || <Download className='h-4 w-4' />}
        </LoadingButton>
    );
};

export default DownloadDocument