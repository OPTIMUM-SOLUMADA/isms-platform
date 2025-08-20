import { PropsWithChildren } from 'react'
import { usePageTitle } from '@/hooks/use-page-title';

interface WithTitleProps extends PropsWithChildren {
    title?: string
}
const WithTitle = ({ title, children }: WithTitleProps) => {
    usePageTitle(title);
    return (
        <>{children}</>
    )
}

export default WithTitle;