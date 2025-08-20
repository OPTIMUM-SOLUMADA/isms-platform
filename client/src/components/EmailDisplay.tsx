import { Mail } from 'lucide-react'
import { cn } from '@/lib/utils';

interface EmailDisplayProps {
    className?: string;
    email: string;
}
const EmailDisplay = ({
    className,
    email
}: EmailDisplayProps) => {
    return (
        <div className={cn("flex items-center text-xs text-muted-foreground", className)}>
            <Mail className="h-3 w-3 mr-1" />
            {email}
        </div>
    )
}

export default EmailDisplay