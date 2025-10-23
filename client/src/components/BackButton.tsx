import { cn } from '@/lib/utils';
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, useNavigationType } from 'react-router-dom'

interface Props {
    className?: string;
    size?: 'sm' | 'default' | 'lg' | 'icon';
}

const BackButton = ({ className, size = 'default' }: Props) => {
    const navigate = useNavigate();
    const navigationType = useNavigationType();

    const handleBack = () => {
        // If the user navigated here manually (not via PUSH)
        if (navigationType === 'POP') {
            navigate('/', { replace: true }); // fallback
        } else {
            navigate(-1);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className={cn('aspect-square', className)}
            size={size}
        >
            <ChevronLeft className="h-5 w-5" />
        </Button>
    )
}

export default BackButton