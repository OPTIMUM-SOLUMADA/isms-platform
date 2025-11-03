import { ArrowLeft, ArrowUpRight, SearchX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div aria-label="404" className='flex grow items-center justify-center'>
            <div className="space-y-3">
                <SearchX className="h-10 w-10 text-muted-foreground" />
                <h2 className="text-xl font-semibold text-foreground">
                    {t('notFoundItem.title')}
                </h2>
                <p className="text-muted-foreground">
                    {t('notFoundItem.description')}
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Button type="button" variant='outline' onClick={() => navigate(-1)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t('notFoundItem.actions.goBack.label')}
                    </Button>
                    <Button type="button" variant='outline' onClick={() => navigate('/')}>
                        {t('notFoundItem.actions.goHome.label')}
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default NotFound;