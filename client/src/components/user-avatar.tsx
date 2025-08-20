import { generateAvatar } from '@/lib/avatar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    className?: string;
    name: string;
    id: string;
    children?: React.ReactNode
}

export const UserAvatar = ({
    className,
    name,
    id,
    children
}: UserAvatarProps) => {
    return (
        <Avatar className={cn("h-10 w-10 border border-white", className)}>
            <AvatarImage src={generateAvatar(id, name)} />
            <AvatarFallback className="bg-blue-100 text-blue-700">
                {getInitials(name)}
            </AvatarFallback>
            {children}
        </Avatar>
    )
}

const getInitials = (name: string) => {
    return name.charAt(0)
};