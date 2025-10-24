import { LoadingButton } from '@/components/ui/loading-button';
import { useDocument } from '@/contexts/DocumentContext';
import { usePermissions } from '@/hooks/use-permissions';
import { Document } from '@/types';
import { Download } from 'lucide-react';
import { PropsWithChildren, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';

interface DownloadDocumentProps extends PropsWithChildren {
    className?: string;
    document: Document;
    loadingText?: string
}
const DownloadDocument = ({
    children,
    document,
    loadingText = ""
}: DownloadDocumentProps) => {
    const { download } = useDocument();
    const { hasActionPermission } = usePermissions();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const cannotBeDownloaded = useMemo(() =>
        !hasActionPermission('document.download') || document.classification !== "PUBLIC"
        , [document, hasActionPermission]);

    const handleClick = async () => {
        if (cannotBeDownloaded) return;
        try {
            setLoading(true);
            await download({ id: document.id });
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoadingButton
            aria-label='Download button'
            isLoading={loading}
            loadingText={loadingText}
            variant="outline"
            onClick={handleClick}
            title={t("document.actions.download.label")}
            disabled={cannotBeDownloaded}
            {...(cannotBeDownloaded && { title: "Not allowed" })}
        >
            {children || <Download className='h-4 w-4' />}
        </LoadingButton>
    );
};

export default DownloadDocument