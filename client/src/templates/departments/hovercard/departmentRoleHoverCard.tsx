import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { DepartmentRole } from "@/types"
import { Building2 } from "lucide-react";

interface DepartmentRoleHoverCardProps {
    role: DepartmentRole;
}
const DepartmentRoleHoverCard = ({
    role
}: DepartmentRoleHoverCardProps) => {

    if (!role) return null;

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="link" className="p-0 min-h-4">
                    {role.name}
                </Button>
            </HoverCardTrigger>

            <HoverCardContent className="w-80 p-4">
                <div className="space-y-3">
                    {/* Department Info */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-full">
                            <Building2 className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-semibold">{role?.name}</p>
                            {role.description && (
                                <p className="text-xs text-muted-foreground">{role.description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default DepartmentRoleHoverCard