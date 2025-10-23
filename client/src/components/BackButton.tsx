import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate, useNavigationType } from 'react-router-dom'

const BackButton = () => {
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
            className='aspect-square'
        >
            <ChevronLeft className="h-5 w-5" />
        </Button>
    )
}

export default BackButton