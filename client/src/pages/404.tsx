import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface NotFoundPageProps {
    fullPage?: boolean
}
const NotFoundPage = ({
    fullPage = false
}: NotFoundPageProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleGoHome = () => {
        navigate("/");
    };
    return (
        <div className={cn('flex-grow flex flex-col gap-4 items-center justify-center', fullPage && "min-h-screen")}>
            <img
                src="./404.png"
                alt="404"
                className="w-[204px]"
            />
            <p className="text-sm">{t("notFound.subtitle")}</p>
            <Button variant="default" onClick={handleGoHome}>
                {t("notFound.actions.goHome.label")}
            </Button>
        </div>
    )
}

export default NotFoundPage