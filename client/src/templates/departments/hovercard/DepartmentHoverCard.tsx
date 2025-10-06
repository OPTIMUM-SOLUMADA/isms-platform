import AvatarGroupDemo from "@/components/AvatarGroup";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { Department } from "@/types"
import { Building2, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DepartmentHoverCardProps {
  department: Department;
}
const DepartmentHoverCard = ({
  department
}: DepartmentHoverCardProps) => {
  const { t } = useTranslation();

  if (!department) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="p-0 min-h-4">
          {department.name}
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
              <p className="font-semibold">{department?.name}</p>
              {department.description && (
                <p className="text-xs text-muted-foreground">{department.description}</p>
              )}
            </div>
          </div>

          {/* Members */}
          {department.members && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">
                  {t("department.hovercard.members", { count: department.members.length })}
                </span>
              </div>

              <div className="space-y-2 max-h-40 overflow-auto pr-1">
                {department.members.length > 0 ? (
                  <AvatarGroupDemo avatars={department.members} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("department.hovercard.noMembers")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default DepartmentHoverCard