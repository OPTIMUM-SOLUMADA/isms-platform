import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { useGetDocument } from "@/hooks/queries/useDocumentMutations";
import { useGetUser } from "@/hooks/queries/useUserMutations";
import { getFileIconByName } from "@/lib/icon";
import { AuditTargetType } from "@/types";

interface AuditTargetProps {
    id: string;
    type: AuditTargetType;
}


export const AuditTarget = ({ id, type }: AuditTargetProps) => {
    const HoverComponent = HoverComponents[type];

    // If there's a hover component, wrap in Tooltip
    if (HoverComponent) {
        return (
            <HoverCard>
                <HoverCardTrigger asChild>
                    <span className="cursor-pointer underline text-blue-900 text-xs pl-1">
                        {type}
                    </span>
                </HoverCardTrigger>

                <HoverCardContent className="w-64 p-3">
                    <HoverComponent id={id} />
                </HoverCardContent>
            </HoverCard>
        );
    }

    // Default rendering if no hover component
    return <span>{type}</span>;
};

// Map types to hover components
const HoverComponents: Record<AuditTargetType, React.FC<{ id: string }>> = {
    DOCUMENT: ({ id }) => <DocumentTarget id={id} />,
    USER: ({ id }) => <UserTarget id={id} />,
    VERSION: () => <span>Version details not implemented</span>,
    DEPARTMENT: () => <span>Department details not implemented</span>,
    REVIEW: () => <span>Review details not implemented</span>,
    APPROVAL: () => <span>Approval details not implemented</span>,
    // add more types here easily
};

export const DocumentTarget = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetDocument(id);

    if (isLoading) {
        return <Skeleton className="h-5 w-32" />;
    }

    if (!data) return "404";

    return (
        <div className="flex items-center gap-2">
            {getFileIconByName(data.fileUrl, 20)}
            {data.title}
        </div>
    );
}

// Example UserTarget
export const UserTarget = ({ id }: { id: string }) => {
    const { data, isLoading } = useGetUser(id);

    if (isLoading) return <Skeleton className="h-5 w-32" />;
    if (!data) return "404";

    return (
        <div className="flex items-center gap-2">
            <UserAvatar id={data.id} name={data.name} className="size-5" />
            {data.name}
        </div>
    );
};