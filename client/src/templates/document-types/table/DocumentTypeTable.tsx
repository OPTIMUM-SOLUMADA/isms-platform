import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PlusCircle, Edit, Trash, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import DocumentsHoverCard from "@/templates/documents/hovercard/DocumentsHoverCard";
import type { DocumentType as DocType } from "@/types";
import { useDocumentTypeUIStore } from "@/stores/document-type/useDocumentTypeUIStore";
import CellNoValue from "@/components/CellNoValue";
import { UserHoverCard } from "@/templates/users/hovercard/UserHoverCard";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/date";
import useDocumentTypeStore from "@/stores/document-type/useDocumentTypeStore";


// UserTable component using the reusable DataTable
interface TableProps {
    data: DocType[];
    isLoading?: boolean;
}

const Table = ({
    data,
    isLoading = false,
}: TableProps) => {
    const { t } = useTranslation();
    const { openDelete, setCurrentDocumentType, openEdit } = useDocumentTypeUIStore();
    const { user: activeUser } = useAuth();
    const { pagination, setPagination } = useDocumentTypeStore();

    // Define columns for UserTable
    const columns: ColumnDef<DocType>[] = useMemo(() => [
        {
            accessorKey: "name",
            header: t("documentType.table.columns.name"),
            size: 100,
            cell: ({ row }) => {
                const department = row.original;
                return (
                    <span className="font-semibold text-primary">{department.name}</span>
                );
            },
        },
        {
            accessorKey: "description",
            header: t("documentType.table.columns.description"),
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
            accessorKey: "documents",
            header: t("documentType.table.columns.documents"),
            size: 40,
            cell: ({ row }) => {
                const docs = row.original.documents;
                return docs.length > 0 ? (
                    <DocumentsHoverCard documents={docs} />
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
            header: t("documentType.table.columns.actions"),
            size: 60,
            cell: ({ row }) => {
                const docType = row.original;
                return (
                    <>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setCurrentDocumentType(docType);
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
                                setCurrentDocumentType(docType);
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
    ], [t, openDelete, setCurrentDocumentType, openEdit, activeUser]);

    return (
        <DataTable
            title={t("documentType.table.title")}
            columns={columns}
            data={data}
            enableSearch
            searchableColumnId="name"
            enableRowSelection
            renderNoData={() => (
                <Card className="shadow-none flex-grow w-full h-full">
                    <CardContent className="p-12 text-center">
                        <FileType2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("documentType.table.empty.title")}</h3>
                        <p className="text-gray-500 mb-4">{t("documentType.table.empty.message")}</p>
                        <Button>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            {t("documentType.table.empty.actions.add.label")}
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

export const DocumentTypeTable = React.memo(Table);