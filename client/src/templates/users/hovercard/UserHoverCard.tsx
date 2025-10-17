import { Mail, Eye, MessageSquare, Pencil, Calendar } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import type { User } from "@/types";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { userRoleColors } from "@/constants/color";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import You from "@/components/You";
import { usePermissions } from "@/hooks/use-permissions";
import { useUserUIStore } from "@/stores/user/useUserUIStore";
import { MouseEvent } from "react";


interface UserHoverCardProps {
    user: User;
    currentUserId?: string;
    children?: React.ReactNode;
    onViewDetails?: (user: User) => void;
    onMessage?: (user: User) => void;
    onEdit?: (user: User) => void;
    className?: string;
}

export function UserHoverCard({
    user,
    currentUserId,
    children,
    onViewDetails,
    onMessage,
    className
}: UserHoverCardProps) {
    const { t } = useTranslation();
    const { hasActionPermission } = usePermissions();
    const { setCurrentUser, openEdit } = useUserUIStore();

    const handleEdit = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setCurrentUser(user);
        openEdit();
    };

    return (
        <HoverCard>
            <HoverCardTrigger asChild className={cn("hover:cursor-default group", className)}>
                {children ?? (
                    <div className="flex items-center gap-1 cursor-pointer font-medium text-primary hover:text-theme-2 px-1 rounded hover:underline">
                        <UserAvatar className="size-4" id={user.id} name={user.name} />
                        {user.name}
                    </div>
                )}
            </HoverCardTrigger>
            <HoverCardContent className="w-full">
                <div className="flex items-start space-x-3">
                    <UserAvatar id={user.id} name={user.name} />
                    <div className="space-y-1">
                        <div className="font-medium text-left">
                            {user.name} {currentUserId === user.id && (
                                <You />
                            )}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {t("user.hovercard.createdAt")} {formatDate(user.createdAt)}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={cn(userRoleColors[user.role], "uppercase")}>
                            {t(`role.options.${user.role?.toLowerCase()}`)}
                        </Badge>
                    </div>
                </div>
                {/* Actions */}
                {currentUserId !== user.id && (
                    <div className="mt-3 flex gap-2">
                        {hasActionPermission("user.read") && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onViewDetails?.(user)}
                                className="flex items-center gap-1 normal-case"
                            >
                                <Eye className="h-4 w-4" />
                                {t("user.hovercard.actions.view.label")}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onMessage?.(user)}
                            className="flex items-center gap-1 normal-case"
                        >
                            <MessageSquare className="h-4 w-4" />
                            {t("user.hovercard.actions.contact.label")}
                        </Button>
                        {hasActionPermission("user.update") && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={handleEdit}
                                className="flex items-center gap-1 normal-case"
                            >
                                <Pencil className="h-4 w-4" />
                                {t("user.hovercard.actions.edit.label")}
                            </Button>
                        )}
                    </div>
                )}
            </HoverCardContent>
        </HoverCard>
    )
}