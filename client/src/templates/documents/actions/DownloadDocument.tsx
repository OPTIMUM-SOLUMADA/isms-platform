import { LoadingButton } from '@/components/ui/loading-button';
import { useDownloadDocument } from '@/hooks/queries/useDocumentMutations';
import { usePermissions } from '@/hooks/use-permissions';
import { Document } from '@/types';
import { Download } from 'lucide-react';
import { PropsWithChildren, useMemo } from 'react'
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
    const { mutate:download, isPending } = useDownloadDocument();
    const { hasActionPermission } = usePermissions();
    const { t } = useTranslation();

    const cannotBeDownloaded = useMemo(() =>
        !hasActionPermission('document.download') || document.classification !== "PUBLIC"
        , [document, hasActionPermission]);

    const handleClick = async () => {
        if (cannotBeDownloaded) return;
        download({ id: document.id });
    };

    return (
        <LoadingButton
            aria-label='Download button'
            isLoading={isPending}
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