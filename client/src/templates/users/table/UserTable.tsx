import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, MoreHorizontal, Edit, Trash2, Users, UserPlus, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/DataTable";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { userRoleColors } from "@/constants/color";
import type { RoleType, User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { UserHoverCard } from "../hovercard/UserHoverCard";
import DepartmentHoverCard from "../../departments/hovercard/DepartmentHoverCard";
import You from "@/components/You";
import { usePermissions } from "@/hooks/use-permissions";
import { useUserUIStore } from "@/stores/user/useUserUIStore";
import { UserActivationSwitch } from "../actions/UserActivationSwitch";
import useUserStore from "@/stores/user/useUserStore";

interface UserActionsCell {
    user: User;
    onEdit?: (user: User) => Promise<void>;
    onDelete?: (user: User) => Promise<boolean>;
    onView?: (user: User) => void;
}

const UserActionsCell = ({ user, onEdit, onView }: UserActionsCell) => {
    const { t } = useTranslation();
    const { hasActionPermission, hasActionPermissions } = usePermissions();
    const { openDelete, setCurrentUser, openInvitation } = useUserUIStore();

    const handleDelete = async () => {
        setCurrentUser(user);
        openDelete();
    };

    function handleOpenInvitationDialog() {
        setCurrentUser(user);
        openInvitation();
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={!hasActionPermissions(["user.read", "user.update", "user.delete"])}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {hasActionPermission("user.read") && (
                        <DropdownMenuItem onClick={() => onView?.(user)}>
                            <Eye className="mr-2 h-4 w-4" /> {t("user.table.actions.view")}
                        </DropdownMenuItem>
                    )}
                    {hasActionPermission("user.update") && (
                        <DropdownMenuItem onClick={() => onEdit?.(user)}>
                            <Edit className="mr-2 h-4 w-4" /> {t("user.table.actions.edit")}
                        </DropdownMenuItem>
                    )}
                    {(hasActionPermission("user.invite") && !user.lastLogin) && (
                        <DropdownMenuItem className="text-theme" onClick={handleOpenInvitationDialog}>
                            <UserPlus className="mr-2 h-4 w-4" /> {t("user.table.actions.reinvite")}
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {hasActionPermission("user.delete") && (
                        <DropdownMenuItem className="text-theme-danger" onClick={handleDelete}>
                            <Trash2 className="mr-2 h-4 w-4" /> {t("user.table.actions.delete")}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

// UserTable component using the reusable DataTable
interface UserTableProps {
    data: User[];
    onEdit?: (user: User) => Promise<void>;
    onDelete?: (user: User) => Promise<boolean>;
    onAddUser?: () => void;
    onView?: (user: User) => void;
    onMessage?: (user: User) => void;
    isLoading?: boolean;
}

const Table = ({
    data,
    onEdit,
    onDelete,
    onAddUser,
    onView,
    onMessage,
    isLoading = false,
}: UserTableProps) => {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();
    const { pagination, setPagination } = useUserStore();

    // Define columns for UserTable
    const userColumns: ColumnDef<User>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: t("user.table.columns.name"),
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <UserHoverCard
                        user={user}
                        currentUserId={currentUser?.id}
                        onViewDetails={onView}
                        onEdit={onEdit}
                        onMessage={onMessage}
                    >
                        <div className="flex items-center space-x-3">
                            <UserAvatar id={user.id} name={user.name} />
                            <div>
                                <div className="font-medium">{user.name} {currentUser?.id === user.id && <You />}</div>
                                <div className="text-xs text-gray-500 flex items-center">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </UserHoverCard>
                );
            },
        },
        {
            accessorKey: "role",
            header: t("user.table.columns.role"),
            cell: ({ row }) => {
                const role = row.getValue<string>("role") as RoleType;
                return <Badge className={cn(userRoleColors[role], "uppercase")}>
                    {t(`role.options.${role.toLowerCase()}`)}
                </Badge>;
            },
        },
        {
            accessorKey: "department",
            header: t("user.table.columns.department"),
            cell: ({ row }) => <DepartmentHoverCard department={row.original.department} />
        },
        {
            accessorKey: "isActive",
            header: t("user.table.columns.status"),
            size: 100,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <UserActivationSwitch user={user} active={user.isActive} />
                )
            }
        },
        {
            id: "actions",
            header: t("user.table.columns.actions"),
            size: 50,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <>
                        <UserActionsCell
                            user={user}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onView={onView}
                        />
                    </>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ], [onEdit, onDelete, onMessage, onView, currentUser, t]);

    return (
        <DataTable
            title={t("user.table.title")}
            columns={userColumns}
            data={data}
            searchableColumnId="name"
            enableRowSelection
            renderNoData={() => (
                <Card className="shadow-none flex-grow">
                    <CardContent className="p-12 text-center">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("user.table.empty.title")}</h3>
                        <p className="text-gray-500 mb-4">{t("user.table.empty.message")}</p>
                        <Button onClick={onAddUser}>
                            <UserPlus className="h-4 w-4 mr-2" />
                            {t("user.table.empty.actions.add.label")}
                        </Button>
                    </CardContent>
                </Card>
            )}
            className="flex-grow"
            isLoading={isLoading}
            // pagination
            page={pagination.page}
            pageSize={pagination.limit}
            totalCount={pagination.totalPages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
        />
    );
}

export const UserTable = React.memo(Table);