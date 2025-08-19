import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Mail, Calendar, MoreHorizontal, Edit, Trash2, Users, UserPlus, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/DataTable";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { userRoleColors } from "@/constants/color";
import type { RoleType, User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteDialog } from "@/components/DeleteDialog";
import { useTranslation } from "react-i18next";

interface UserActionsCell {
    user: User;
    onEdit?: (user: User) => Promise<void>;
    onDelete?: (user: User) => Promise<boolean>;
    onView?: (user: User) => void;
}

const UserActionsCell = ({ user, onEdit, onDelete, onView }: UserActionsCell) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);

    const handleDelete = async () => {
        if (onDelete) await onDelete(user);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onView?.(user)}>
                        <Eye className="mr-2 h-4 w-4" /> {t("user.table.actions.view")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(user)}>
                        <Edit className="mr-2 h-4 w-4" /> {t("user.table.actions.edit")}
                    </DropdownMenuItem>

                    <DropdownMenuItem className="text-red-600" onClick={() => setOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" /> {t("user.table.actions.delete")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteDialog
                entityName={user.name}
                open={open}
                onOpenChange={setOpen}
                onConfirm={handleDelete}
            />
        </>
    );
};

// UserTable component using the reusable DataTable
interface UserTableProps {
    data: User[];
    onEdit?: (user: User) => Promise<void>;
    onDelete?: (user: User) => Promise<boolean>;
    onAddUser?: () => void;
}

const Table = ({
    data,
    onEdit,
    onDelete,
    onAddUser
}: UserTableProps) => {
    const { t } = useTranslation();
    const { user: currentUser } = useAuth();

    // Define columns for UserTable
    const userColumns: ColumnDef<User>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: t("user.table.columns.name"),
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center space-x-3">
                        <UserAvatar name={user.name} />
                        <div>
                            <div className="font-medium">{user.name} {currentUser?.id === user.id && '(Vous)'}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {user.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "role",
            header: t("user.table.columns.role"),
            cell: ({ row }) => {
                const role = row.getValue<string>("role") as RoleType;
                return <Badge className={cn(userRoleColors[role], "uppercase")}>
                    {t(`user.role.${role.toLowerCase()}`)}
                </Badge>;
            },
        },
        {
            accessorKey: "department",
            header: t("user.table.columns.department"),
            cell: ({ row }) => <span className="text-sm">{row.original.department.name}</span>,
        },
        // {
        //     accessorKey: "lastLogin",
        //     header: "Last login",
        //     cell: ({ row }) => {
        //         const lastLogin = row.getValue<string>("lastLogin");
        //         return lastLogin ? (
        //             <div className="flex items-center text-gray-600 text-sm">
        //                 <Calendar className="h-3 w-3 mr-1" />
        //                 {new Date(lastLogin).toLocaleDateString()}
        //             </div>
        //         ) : null;
        //     },
        // },
        // {
        //     accessorKey: "documents",
        //     header: "Documents",
        //     cell: ({ row }) => <span className="font-medium text-center block">{row.getValue("documents")}</span>,
        // },
        // {
        //     accessorKey: "reviews",
        //     header: "Reviews",
        //     cell: ({ row }) => <span className="font-medium text-center block">{row.getValue("reviews")}</span>,
        // },
        {
            id: "actions",
            header: t("user.table.columns.actions"),
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <UserActionsCell
                        user={user}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ], [onEdit, onDelete, currentUser, t]);

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
        />
    );
}

export const UserTable = React.memo(Table);