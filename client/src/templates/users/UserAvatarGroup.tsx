import React from "react";
import { cn } from "@/lib/utils"; // ta fonction classNames
import { UserAvatar } from "../../components/user-avatar"; // ton composant avatar ShadCN
import { UserHoverCard } from "./hovercard/UserHoverCard";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@/types";


interface Props {
    users: User[];
    maxVisible?: number; // par défaut 7
    className?: string;
}

export const UserAvatarGroup: React.FC<Props> = ({
    users,
    maxVisible = 7,
    className,
}) => {
    const visibleUsers = users.slice(0, maxVisible);
    const restCount = users.length - maxVisible;
    const { user: activeUser } = useAuth();

    return (
        <div className={cn("flex items-center -space-x-2", className)}>
            {visibleUsers.map((user, index) => (
                <UserHoverCard user={user} key={index} currentUserId={activeUser?.id}>
                    <div>
                        <UserAvatar
                            id={user.id}
                            name={user.name}
                            className="size-6 border-2 border-background"
                        />
                    </div>
                </UserHoverCard>
            ))}

            {restCount > 0 && (
                <div className="flex items-center justify-center size-6 rounded-full bg-muted text-xs font-medium border-2 border-background">
                    +{restCount}
                </div>
            )}
        </div>
    );
};
