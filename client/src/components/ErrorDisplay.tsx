import { cn } from '@/lib/utils';
import React from 'react'
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
    className?: string;
    children?: React.ReactNode
}
const ErrorDisplay = ({ className, children }: ErrorDisplayProps) => {
    const { t } = useTranslation();

    const handleReload = () => {
        window.location.reload();
    }

    return (
        <div className={cn("w-full h-full flex flex-col items-center justify-center gap-4", className)}>
            {children || <h1>{t("common.error.somethingWentWrong")}</h1>}
            <Button variant="outline" onClick={handleReload}>
                {t("common.error.tryAgain")}
            </Button>
        </div>
    )
}

export default ErrorDisplay