import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {Files } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import type { AuditLog } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { getDateFnsLocale } from "@/lib/date";
import { UserHoverCard } from "../users/hovercard/UserHoverCard";
import CellNoValue from "@/components/CellNoValue";
import { Badge } from "@/components/ui/badge";

// Table component using the reusable DataTable
interface TableProps {
    data: AuditLog[];
    onView?: (audit: AuditLog) => void;
    isLoading?: boolean;
}

const Table = ({
    data = [],
    isLoading = false,
}: TableProps) => {
    const { t } = useTranslation();

    // Define columns for UserTable
    const columns: ColumnDef<AuditLog>[] = useMemo(() => [
        {
            accessorKey: "name",
            enableSorting: true,
            header: t("Timestamp"),
            enableHiding: false,
            size: 20,
            cell: ({ row }) => {
                const audit = row.original;
                return (
                    <div className="space-y-0 text-sm">
                        <div className="font-medium">
                            {format(audit.timestamp!, "P", { locale: getDateFnsLocale()})}
                        </div>
                        <div className="opacity-70">
                            {format(audit.timestamp!, "p", { locale: getDateFnsLocale()})}
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "user",
            enableSorting: true,
            header: t("User"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const audit = row.original;
                if (!audit.user) return <CellNoValue />;
                return (
                    <UserHoverCard user={audit.user!} />
                );
            },
        },
        {
            accessorKey: "action",
            enableSorting: true,
            header: t("Action"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const audit = row.original;
                return audit.eventType;
            },
        },
        {
            accessorKey: "types",
            enableSorting: true,
            header: t("Types"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const audit = row.original;
                return audit.targets?.map((item, index) => (
                    <Badge key={index}>{item.type}</Badge>
                ));
            },
        },
        {
            accessorKey: "status",
            enableSorting: true,
            header: t("Status"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const audit = row.original;
                return audit.status;
            },
        },
        {
            accessorKey: "ip",
            enableSorting: true,
            header: t("IP Address"),
            enableHiding: false,
            size: 100,
            cell: ({ row }) => {
                const { ipAddress } = row.original;
                if (!ipAddress) return <CellNoValue />;
                return <span className="font-mono opacity-90">{ipAddress.split(',')[0]}</span>;
            },
        },
        {
            accessorKey: "details",
            enableSorting: true,
            header: t("Details"),
            enableHiding: false,
            size: 200,
            cell: ({ row }) => {
                const { details } = row.original;
                if (!details) return null;
                // show json
                return Object.entries(details).map(([key, value], index) => (
                    <div key={index} className="space-y-0 text-sm flex gap-2 items-start">
                        <div className="font-light uppercase">
                            {key}:
                        </div>
                        <div className="opacity-70">
                            {JSON.stringify(value)}
                        </div>
                    </div>
                ))
            },
        },

    ], [t]);

    return (
        <DataTable
            title={t("Audits list") + " (" + data.length + ")"}
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
            showHeader={false}
        />
    );
}

export const AuditTable = React.memo(Table);