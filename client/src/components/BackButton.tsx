import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className='aspect-square'
        >
            <ChevronLeft className="h-5 w-5" />
        </Button>
    )
}

export default BackButton