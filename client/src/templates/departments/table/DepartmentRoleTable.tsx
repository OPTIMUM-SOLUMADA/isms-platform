import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash, Building2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import type { DepartmentRole } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { UserHoverCard } from "@/templates/users/hovercard/UserHoverCard";
import { formatDate } from "@/lib/date";
import { useAuth } from "@/contexts/AuthContext";
import CellNoValue from "@/components/CellNoValue";

import { useDepartmentRoleUI } from "@/stores/department/useDepartmentRoleUI";
import useDepartmentRoleStore from "@/stores/department/useDepatrmentRoleStore";
// import { useDepartmentRoleStore } from "@/stores/department/useDepatrmentRoleStore";


// UserTable component using the reusable DataTable
interface DepartmentRoleTableProps {
    data: DepartmentRole[];
    onView?: (user: DepartmentRole) => void
    isLoading?: boolean;
}

const Table = ({
    data,
    onView,
    isLoading = false,
}: DepartmentRoleTableProps) => {
    const { t } = useTranslation();
    const { openDelete, setCurrentDepartmentRole, openEdit } = useDepartmentRoleUI();
    const { user: activeUser } = useAuth();

    const { pagination, setPagination } = useDepartmentRoleStore();

    // Define columns for UserTable
    const departmentRoleColumns: ColumnDef<DepartmentRole>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: t("departmentRole.table.columns.name"),
            size: 140,
            cell: ({ row }) => {
                const departmentRole = row.original;
                return (
                    <span className="font-semibold text-primary">{departmentRole.name}</span>
                );
            },
        },
        {
            accessorKey: "description",
            header: t("departmentRole.table.columns.description"),
            cell: ({ row }) => {
                const { description } = row.original;
                return description ? (
                    <span>{description}</span>
                ) : (
                    <CellNoValue />
                );
            },
        },
        {
            accessorKey: "createdBy",
            header: t("departmentRole.table.columns.createdBy"),
            size: 60,
            cell: ({ row }) => {
                const user = row.original.createdBy;
                return user ? (
                    <UserHoverCard user={user} currentUserId={activeUser?.id} />
                ) : (
                    <CellNoValue />
                );
            }
        },
        {
            accessorKey: "createdAt",
            header: t("departmentRole.table.columns.createdAt"),
            size: 60,
            cell: ({ row }) => {
                return <span className="text-muted-foreground">{formatDate(row.original.createdAt)}</span>;
            }
        },

        {
            id: "actions",
            header: t("departmentRole.table.columns.actions"),
            size: 60,
            cell: ({ row }) => {
                const departmentRole = row.original;
                return (
                    <>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setCurrentDepartmentRole(departmentRole);
                                onView?.(departmentRole);
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setCurrentDepartmentRole(departmentRole);
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
                                setCurrentDepartmentRole(departmentRole);
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
    ], [t, openDelete, setCurrentDepartmentRole, openEdit, activeUser, onView]);

    return (
        <DataTable
            title={t("documentType.table.title")}
            columns={departmentRoleColumns}
            data={data}
            enableSearch
            searchableColumnId="name"
            enableRowSelection
            renderNoData={() => (
                <Card className="shadow-none flex-grow">
                    <CardContent className="p-12 text-center">
                        <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("departmentRole.table.empty.title")}</h3>
                        <p className="text-gray-500 mb-4">{t("departmentRole.table.empty.message")}</p>
                        {/* <Button>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t("departmentRole.table.empty.actions.add.label")}
                        </Button> */}
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

export const DepartmentRoleTable = React.memo(Table);