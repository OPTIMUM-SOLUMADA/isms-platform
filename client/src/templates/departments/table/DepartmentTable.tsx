import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Users, PlusCircle, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import type { Department } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { UserAvatarGroup } from "@/components/UserAvatarGroup";
import { useDepartmentUI } from "@/stores/department/useDepartmentUI";


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
    const { openDelete, setCurrentDepartment } = useDepartmentUI();

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
                return (
                    <UserAvatarGroup users={users} />
                );
            }
        },
        {
            accessorKey: "documents",
            header: t("department.table.columns.documents"),
            cell: ({ row }) => {
                const docs = row.original.documents;
                return (
                    <span>{docs.length}</span>
                );
            }
        },

        {
            id: "actions",
            header: t("department.table.columns.actions"),
            size: 40,
            cell: ({ row }) => {
                const department = row.original;
                return (
                    <>
                        <Button type="button" variant="ghost" size="sm">
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
    ], [t, openDelete, setCurrentDepartment]);

    return (
        <DataTable
            title={t("user.table.title")}
            columns={departmentColumns}
            data={data}
            searchableColumnId="name"
            enableRowSelection
            renderNoData={() => (
                <Card className="shadow-none flex-grow">
                    <CardContent className="p-12 text-center">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("user.table.empty.title")}</h3>
                        <p className="text-gray-500 mb-4">{t("user.table.empty.message")}</p>
                        <Button>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t("user.table.empty.actions.add.label")}
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