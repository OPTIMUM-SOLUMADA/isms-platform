import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PlusCircle, Edit, Trash, Building2, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import type { Department } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { UserAvatarGroup } from "@/components/UserAvatarGroup";
import { useDepartmentUI } from "@/stores/department/useDepartmentUI";
import DocumentsHoverCard from "@/templates/documents/hovercard/DocumentsHoverCard";
import { UserHoverCard } from "@/templates/users/hovercard/UserHoverCard";
import { formatDate } from "@/lib/date";
import { useAuth } from "@/contexts/AuthContext";


// UserTable component using the reusable DataTable
interface DepartmentTableProps {
    data: Department[];
    isLoading?: boolean;
}

const Table = ({
    data,
    isLoading = false,
}: DepartmentTableProps) => {
    const { t } = useTranslation();
    const { openDelete, setCurrentDepartment, openEdit } = useDepartmentUI();
    const { user: activeUser } = useAuth();

    // Define columns for UserTable
    const departmentColumns: ColumnDef<Department>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: t("department.table.columns.name"),
            size: 100,
            cell: ({ row }) => {
                const department = row.original;
                return (
                    <span>{department.name}</span>
                );
            },
        },
        {
            accessorKey: "description",
            header: t("department.table.columns.description"),
            cell: ({ row }) => {
                const department = row.original;
                return (
                    <span>{department.description}</span>
                );
            },
        },
        {
            accessorKey: "users",
            header: t("department.table.columns.members"),
            cell: ({ row }) => {
                const users = row.original.members;
                return users.length > 0 ? (
                    <div className="flex items-center gap-1">
                        <UserAvatarGroup users={users} />
                        <span className="text-muted-foreground text-xs">({users.length})</span>
                    </div>
                ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                );
            }
        },
        {
            accessorKey: "documents",
            header: t("department.table.columns.documents"),
            size: 60,
            cell: ({ row }) => {
                const docs = row.original.documents;
                return docs.length > 0 ? (
                    <DocumentsHoverCard documents={docs} />
                ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                );
            }
        },
        {
            accessorKey: "createdBy",
            header: t("department.table.columns.createdBy"),
            size: 60,
            cell: ({ row }) => {
                const user = row.original.createdBy;
                return user ? (
                    <UserHoverCard user={user} currentUserId={activeUser?.id} />
                ) : (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                );
            }
        },
        {
            accessorKey: "createdAt",
            header: t("department.table.columns.createdAt"),
            size: 60,
            cell: ({ row }) => {
                return <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>;
            }
        },

        {
            id: "actions",
            header: t("department.table.columns.actions"),
            size: 60,
            cell: ({ row }) => {
                const department = row.original;
                return (
                    <>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setCurrentDepartment(department);
                                openEdit();
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost-destructive"
                            size="sm"
                            onClick={() => {
                                setCurrentDepartment(department);
                                openDelete();
                            }}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ], [t, openDelete, setCurrentDepartment, openEdit, activeUser]);

    return (
        <DataTable
            title={t("documentType.table.title")}
            columns={departmentColumns}
            data={data}
            enableSearch
            searchableColumnId="name"
            enableRowSelection
            renderNoData={() => (
                <Card className="shadow-none flex-grow">
                    <CardContent className="p-12 text-center">
                        <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("department.table.empty.title")}</h3>
                        <p className="text-gray-500 mb-4">{t("department.table.empty.message")}</p>
                        <Button>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t("department.table.empty.actions.add.label")}
                        </Button>
                    </CardContent>
                </Card>
            )}
            className="flex-grow"
            isLoading={isLoading}
        />
    );
}

export const DepartmentTable = React.memo(Table);