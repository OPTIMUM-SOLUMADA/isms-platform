import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PlusCircle, Edit, Trash, Building2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import type { Department } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useDepartmentUI } from "@/stores/department/useDepartmentUI";
import { UserHoverCard } from "@/templates/users/hovercard/UserHoverCard";
import { formatDate } from "@/lib/date";
import { useAuth } from "@/contexts/AuthContext";
import CellNoValue from "@/components/CellNoValue";
import useDepartmentStore from "@/stores/department/useDepatrmentStore";
import { Link } from "react-router-dom";


// UserTable component using the reusable DataTable
interface DepartmentTableProps {
    data: Department[];
    onView?: (user: Department) => void
    isLoading?: boolean;
}

const Table = ({
    data,
    onView,
    isLoading = false,
}: DepartmentTableProps) => {
    const { t } = useTranslation();
    const { openDelete, setCurrentDepartment, openEdit } = useDepartmentUI();
    const { user: activeUser } = useAuth();
    const { openAdd } = useDepartmentUI();

    const { pagination, setPagination } = useDepartmentStore();

    // Define columns for UserTable
    const departmentColumns: ColumnDef<Department>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: t("department.table.columns.name"),
            size: 140,
            cell: ({ row }) => {
                const department = row.original;
                return (
                    <Link to={`/departments/view/${department.id}`}>
                        <span className="font-semibold text-primary">{department.name}</span>
                    </Link>
                );
            },
        },
        {
            accessorKey: "description",
            header: t("department.table.columns.description"),
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
            accessorKey: "functions",
            header: t("department.table.columns.functions"),
            size: 60,
            cell: ({ row }) => {
                const docs = row.original.roles;
                if (!docs) return;
                return docs.length > 0 ? (
                    <span>{docs.length}</span>
                ) : (
                    <CellNoValue />
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
                    <CellNoValue />
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
            size: 100,
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
                                onView?.(department);
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
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
                        {department.roles.length === 0 && (
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
                        )}
                    </>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ], [t, openDelete, setCurrentDepartment, openEdit, activeUser, onView]);

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
                        <Button onClick={openAdd}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t("department.table.empty.actions.add.label")}
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

export const DepartmentTable = React.memo(Table);