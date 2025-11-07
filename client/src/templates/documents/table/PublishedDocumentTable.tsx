import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {Files, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import type { Document } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { getFileIconByName } from "@/lib/icon";
import DownloadDocument from "../actions/DownloadDocument";
import DateLabel from "@/components/DateLabel";

// UserTable component using the reusable DataTable
interface UserTableProps {
    data: Document[];
    onView?: (doc: Document) => void;
    isLoading?: boolean;
}

const Table = ({
    data,
    onView,
    isLoading = false,
}: UserTableProps) => {
    const { t } = useTranslation();

    // Define columns for UserTable
    const columns: ColumnDef<Document>[] = useMemo(() => [
        {
            accessorKey: "name",
            enableSorting: true,
            header: t("publishedDocument.sections.allDocuments.table.columns.document"),
            enableHiding: false,
            size: 220,
            cell: ({ row }) => {
                const doc = row.original;
                return (
                    <button
                        type="button"
                        className="flex items-center gap-1"
                        onClick={() => onView?.(doc)}
                    >
                        {getFileIconByName(doc.fileUrl!)}
                        <div className="text-sm ml-1 flex items-center line-clamp-1 whitespace-nowrap">
                            {doc.title}
                        </div>
                    </button>
                );
            },
        },
        {
            accessorKey: "version",
            enableSorting: true,
            size: 20,
            header: () => <span className="block text-center w-full">{t("publishedDocument.sections.allDocuments.table.columns.version")}</span>,
            cell: ({ row }) => {
                const currentVersion = row.original.versions?.find(v => v.isCurrent);

                return currentVersion ? (
                    <div className="w-full flex">
                        <Badge variant="outline" className="mx-auto">{currentVersion.version}</Badge>
                    </div>
                ) : (
                    <>-</>
                )
            },
        },
        {
            accessorKey: "type",
            enableSorting: true,
            size: 40,
            header: t("publishedDocument.sections.allDocuments.table.columns.type"),
            cell: ({ row }) => {
                return <span>{row.original.type.name}</span>;
            },
        },
        {
            accessorKey: "classification",
            enableSorting: true,
            size: 160,
            header: t("publishedDocument.sections.allDocuments.table.columns.classification"),
            cell: ({ row }) => {
                const { classification } = row.original;
                return <span className="w-full text-center uppercase">{t(`common.document.classification.${classification.toLowerCase()}`)}</span>;
            },
        },
        {
            accessorKey: "isoClause",
            enableSorting: true,
            size: 180,
            header: t("publishedDocument.sections.allDocuments.table.columns.isoClause"),
            cell: ({ row }) => {
                const { isoClause } = row.original;
                return <span className="w-full text-center">{isoClause.code} {isoClause.name}</span>;
            },
        },
        {
            accessorKey: "isoClause",
            enableSorting: true,
            size: 100,
            header: t("publishedDocument.sections.allDocuments.table.columns.publishedAt"),
            cell: ({ row }) => {
                const { publicationDate } = row.original;
                if (!publicationDate) return null;
                return <DateLabel date={publicationDate} />;
            },
        },
        {
            id: "actions",
            enableSorting: false,
            size: 40,
            header: t("publishedDocument.sections.allDocuments.table.columns.actions"),
            cell: ({ row }) => {
                const doc = row.original;
                return (
                    <>

                        {/* Download */}
                        <Button
                            variant="default"
                            size="sm"
                            className="mr-2"
                        >
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View document
                        </Button>

                        <DownloadDocument
                            document={doc}
                        />
                    </>
                );
            },
            enableHiding: false,
        },
    ], [t, onView]);

    return (
        <DataTable
            title={t("publishedDocument.sections.allDocuments.table.title") + " (" + data.length + ")"}
            columns={columns}
            data={data}
            searchableColumnId="name"
            enableRowSelection={false}
            isLoading={isLoading}
            renderNoData={() => (
                <Card className="shadow-none flex-grow">
                    <CardContent className="p-12 text-center">
                        <Files className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("publishedDocument.sections.allDocuments.table.empty.title")}</h3>
                        <p className="text-gray-500 mb-4">{t("publishedDocument.sections.allDocuments.table.empty.message")}</p>
                    </CardContent>
                </Card>
            )}
            className="flex-grow"
        />
    );
}

export const PublishedDocumentTable = React.memo(Table);