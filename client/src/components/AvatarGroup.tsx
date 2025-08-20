import type { User } from "@/types";
import { AvatarGroup, AvatarGroupTooltip } from "@/components/ui/shadcn-io/avatar-group";
import { UserAvatar } from "./user-avatar";

interface AvatarGroupProps {
    avatars: User[]
}

const AvatarGroupDemo = ({
    avatars
}: AvatarGroupProps) => {
    return (
        <AvatarGroup variant="motion" className="h-12 -space-x-3">
            {avatars.map((avatar, index) => (
                <UserAvatar
                    key={index}
                    id={avatar.id}
                    name={avatar.name}
                    className="size-8 text-xs"
                >
                    <AvatarGroupTooltip>
                        <p>{avatar.email}</p>
                    </AvatarGroupTooltip>
                </UserAvatar>
            ))}
        </AvatarGroup>
    );
};

export default AvatarGroupDemo;