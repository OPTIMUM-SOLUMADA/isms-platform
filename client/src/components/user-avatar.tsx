import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
    className?: string;
    name: string;
    url?: string;
}

export const UserAvatar = ({
    className,
    name,
    url
}: UserAvatarProps) => {
    return (
        <Avatar className={cn("h-10 w-10", className)}>
            <AvatarImage src={url} />
            <AvatarFallback className="bg-blue-100 text-blue-700">
                {getInitials(name)}
            </AvatarFallback>
        </Avatar>
    )
}

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
};